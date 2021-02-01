import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';
import { CoreData } from 'src/core/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Shops } from './shops.entity';

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
  @Column()
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
}
