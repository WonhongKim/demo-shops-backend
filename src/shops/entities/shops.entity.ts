import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreData } from 'src/core/entities/core.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { IsString } from 'class-validator';
import { MallType } from './mallType.entity';
import { User } from 'src/users/entities/user.entity';
import { Item } from './item.entity';
import { Order } from 'src/orders/entities/order.entity';

@InputType('shopsEntity', { isAbstract: true })
@ObjectType()
@Entity()
export class Shops extends CoreData {
  @Field(() => String)
  @Column()
  @IsString()
  name: string;

  @Field(() => String)
  @Column()
  @IsString()
  address: string;

  @Field(() => String)
  @Column()
  @IsString()
  phoneNumber: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImage: string;

  @Field(() => MallType, { nullable: true })
  @ManyToOne(
    () => MallType,
    malltype => malltype.shops,
    { nullable: true, onDelete: 'SET NULL' },
  )
  malltype: MallType;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.shops,
    { onDelete: 'CASCADE' },
  )
  owner: User;

  @RelationId((shops: Shops) => shops.owner)
  ownerId: number;

  @Field(() => [Item])
  @OneToMany(
    () => Item,
    item => item.shop,
  )
  items: Item[];

  @Field(() => [Order])
  @OneToMany(
    () => Order,
    order => order.shop,
  )
  orders: Order[];
}
