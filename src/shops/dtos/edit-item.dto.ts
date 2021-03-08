import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/coreoutput.dto';
import { Item } from '../entities/item.entity';

@InputType()
export class EditItemInput extends PickType(PartialType(Item), [
  'name',
  'options',
  'price',
  'description',
]) {
  @Field(() => Int)
  itemId: number;
}

@ObjectType()
export class EditItemOutput extends CoreOutput {}
