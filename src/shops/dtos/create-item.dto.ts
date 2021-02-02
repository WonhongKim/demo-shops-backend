import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/coreoutput.dto';
import { Item } from '../entities/item.entity';

@InputType()
export class CreateItemInput extends PickType(Item, [
  'name',
  'price',
  'description',
  'options',
]) {
  @Field(() => Int)
  shopId: number;
}

@ObjectType()
export class CreateItemOutput extends CoreOutput {}
