import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreData } from 'src/core/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Shops } from 'src/shops/entities/shops.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { IsEnum, IsNumber } from 'class-validator';

export enum OrderStatus {
  Ordered = 'Ordered',
  Accepted = 'Accepted',
  ReadyforPickup = 'ReadyforPickup',
  Delivering = 'Delivering',
  Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreData {
  @Field(() => User, { nullable: true })
  @ManyToOne(
    () => User,
    user => user.orders,
    { onDelete: 'SET NULL', nullable: true },
  )
  customer?: User;

  @RelationId((order: Order) => order.customer)
  customerId: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(
    () => User,
    user => user.rides,
    { onDelete: 'SET NULL', nullable: true },
  )
  driver?: User;

  @RelationId((order: Order) => order.driver)
  driverId: number;

  @Field(() => Shops, { nullable: true })
  @ManyToOne(
    () => Shops,
    shop => shop.orders,
    { onDelete: 'SET NULL', nullable: true, eager: true },
  )
  shop?: Shops;

  @Field(() => [OrderItem])
  @ManyToMany(() => OrderItem)
  @JoinTable()
  items: OrderItem[];

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  @IsNumber()
  total?: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Ordered })
  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
