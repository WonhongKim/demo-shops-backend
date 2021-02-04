import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreData } from 'src/core/entities/core.entity';
import { Item } from 'src/shops/entities/item.entity';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field(type => String)
  name: string;
  @Field(type => String, { nullable: true })
  choice: string;
}

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreData {
  @Field(type => Item)
  @ManyToOne(type => Item, { nullable: true, onDelete: 'CASCADE' })
  dish: Item;

  @Field(type => [OrderItemOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: OrderItemOption[];
}
