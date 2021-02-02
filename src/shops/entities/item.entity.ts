import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';

import { CoreData } from 'src/core/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Shops } from './shops.entity';

@InputType('ItemOptionType', { isAbstract: true })
@ObjectType()
class ItemOtion {
  @Field(() => String)
  name: string;

  @Field(() => [ItemOptionsSubItem], { nullable: true })
  options?: ItemOptionsSubItem[];

  @Field(() => Int, { nullable: true })
  extraprice?: number;
}

@InputType('OptionsInputType', { isAbstract: true })
@ObjectType()
class ItemOptionsSubItem {
  @Field(() => String)
  name: string;
  @Field(() => Int, { nullable: true })
  extraprice?: number;
}

@InputType('Item', { isAbstract: true })
@ObjectType()
@Entity()
export class Item extends CoreData {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field(() => Int)
  @Column()
  @IsNumber()
  price: number;

  @Field(() => String)
  @Column({ nullable: true })
  @IsString()
  photourl: string;

  @Field(() => String)
  @Column()
  @Length(0, 200)
  description: string;

  @Field(() => Shops)
  @ManyToOne(
    () => Shops,
    shop => shop.items,
    { onDelete: 'CASCADE' },
  )
  shop: Shops;

  @RelationId((item: Item) => item.shop)
  shopId: number;

  @Field(() => [ItemOtion], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options: ItemOtion[];
}
