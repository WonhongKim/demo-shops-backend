import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserRole } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './order.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersservice: OrdersService) {}

  @Mutation(() => CreateOrderOutput)
  @UserRole(['Customer', 'Owner', 'Admin', 'Staff'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input')
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.ordersservice.createOrder(customer, createOrderInput);
  }

  @Query(() => GetOrdersOutput)
  @UserRole(['Any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersservice.getOrders(user, getOrdersInput);
  }

  @Query(() => GetOrderOutput)
  @UserRole(['Any'])
  async getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.ordersservice.getOrder(user, getOrderInput);
  }

  @Mutation(() => EditOrderOutput)
  @UserRole(['Any'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.ordersservice.editOrder(user, editOrderInput);
  }
}
