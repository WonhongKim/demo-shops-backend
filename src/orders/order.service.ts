import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/shops/entities/item.entity';
import { Shops } from 'src/shops/entities/shops.entity';
import { Role, User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order, OrderStatus } from './entities/order.entity';
import {
  PUB_SUB,
  NEW_PENDING_ORDER,
  NEW_PICKUP_ORDER,
  NEW_ORDER_UPDATE,
} from 'src/core/core.constants';
import { PubSub } from 'graphql-subscriptions';
import { TakeOrderInput, TakeOrderOutput } from './dtos/take-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Shops)
    private readonly shops: Repository<Shops>,
    @InjectRepository(Item)
    private readonly items: Repository<Item>,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createOrder(
    customer: User,
    { shopId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const shop = await this.shops.findOne(shopId);
      if (!shop) {
        return {
          result: false,
          error: 'Restaurant not found',
        };
      }
      let orderFinalPrice = 0;
      const orderItems: OrderItem[] = [];
      for (const item of items) {
        const dish = await this.items.findOne(item.itemId);
        if (!dish) {
          return {
            result: false,
            error: 'Dish not found.',
          };
        }
        let dishFinalPrice = dish.price;
        for (const itemOption of item.options) {
          const dishOption = dish.options.find(
            dishOption => dishOption.name === itemOption.name,
          );
          if (dishOption) {
            if (dishOption.extra) {
              dishFinalPrice = dishFinalPrice + dishOption.extra;
            } else {
              const dishOptionChoice = dishOption.choices?.find(
                optionChoice => optionChoice.name === itemOption.choice,
              );
              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  dishFinalPrice = dishFinalPrice + dishOptionChoice.extra;
                }
              }
            }
          }
        }
        orderFinalPrice = orderFinalPrice + dishFinalPrice;
        const orderItem = await this.orderItems.save(
          this.orderItems.create({
            dish,
            options: item.options,
          }),
        );
        orderItems.push(orderItem);
      }
      const order = await this.orders.save(
        this.orders.create({
          customer,
          shop,
          total: orderFinalPrice,
          items: orderItems,
        }),
      );
      await this.pubSub.publish(NEW_PENDING_ORDER, {
        pendingOrders: { order, ownerId: shop.ownerId },
      });
      return {
        result: true,
        orderId: order.id,
      };
    } catch (e) {
      return {
        result: false,
        error: 'Could not create order.',
      };
    }
  }

  async getOrders(
    user: User,
    { status }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    try {
      let orders: Order[];
      if (user.role === Role.Customer) {
        orders = await this.orders.find({
          where: {
            customer: user,
            ...(status && { status }),
          },
        });
      } else if (user.role === Role.Staff) {
        orders = await this.orders.find({
          where: {
            driver: user,
            ...(status && { status }),
          },
        });
      } else if (user.role === Role.Owner) {
        const shop = await this.shops.find({
          where: {
            owner: user,
          },
          relations: ['orders'],
        });
        orders = shop.map(shop => shop.orders).flat(1);
        if (status) {
          orders = orders.filter(order => order.status === status);
        }
      }
      return {
        result: true,
        orders,
      };
    } catch {
      return {
        result: false,
        error: 'Could not get orders',
      };
    }
  }

  canSeeOrder(user: User, order: Order): boolean {
    let canSee = true;
    if (user.role === Role.Customer && order.customerId !== user.id) {
      canSee = false;
    }
    if (user.role === Role.Staff && order.driverId !== user.id) {
      canSee = false;
    }
    if (user.role === Role.Owner && order.shop.ownerId !== user.id) {
      canSee = false;
    }
    return canSee;
  }

  async getOrder(
    user: User,
    { id: orderId }: GetOrderInput,
  ): Promise<GetOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        relations: ['shop'],
      });
      if (!order) {
        return {
          result: false,
          error: 'Order not found.',
        };
      }
      if (!this.canSeeOrder(user, order)) {
        return {
          result: false,
          error: 'You cant see that',
        };
      }
      return {
        result: true,
        order,
      };
    } catch {
      return {
        result: false,
        error: 'Could not load order.',
      };
    }
  }

  async editOrder(
    user: User,
    { id: orderId, status }: EditOrderInput,
  ): Promise<EditOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId);
      if (!order) {
        return {
          result: false,
          error: 'Order not found.',
        };
      }
      if (!this.canSeeOrder(user, order)) {
        return {
          result: false,
          error: "Can't see this.",
        };
      }
      let canEdit = true;
      if (user.role === Role.Customer) {
        canEdit = false;
      }
      if (user.role === Role.Owner) {
        if (
          status !== OrderStatus.Ordered &&
          status !== OrderStatus.Accepted &&
          status !== OrderStatus.ReadyforPickup
        ) {
          canEdit = false;
        }
      }
      if (user.role === Role.Staff) {
        if (
          status !== OrderStatus.Delivering &&
          status !== OrderStatus.Delivered
        ) {
          canEdit = false;
        }
      }
      if (!canEdit) {
        return {
          result: false,
          error: "You can't do that.",
        };
      }
      await this.orders.save({
        id: orderId,
        status,
      });
      const newOrder = { ...order, status };
      if (user.role === Role.Owner) {
        if (status === OrderStatus.ReadyforPickup) {
          await this.pubSub.publish(NEW_PICKUP_ORDER, {
            pkciupOrders: newOrder,
          });
        }
      }
      await this.pubSub.publish(NEW_ORDER_UPDATE, { orderUpdates: newOrder });
      return {
        result: true,
      };
    } catch {
      return {
        result: false,
        error: 'Could not edit order.',
      };
    }
  }

  async takeOrder(
    driver: User,
    { id: orderId }: TakeOrderInput,
  ): Promise<TakeOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId);
      if (!order) {
        return {
          result: false,
          error: 'Order not found',
        };
      }
      if (order.driver) {
        return {
          result: false,
          error: 'This order already has a driver',
        };
      }
      await this.orders.save({
        id: orderId,
        driver,
      });
      await this.pubSub.publish(NEW_ORDER_UPDATE, {
        orderUpdates: { ...order, driver },
      });
      return {
        result: true,
      };
    } catch {
      return {
        result: false,
        error: 'Could not upate order.',
      };
    }
  }
}
