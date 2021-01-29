import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { number } from 'joi';
import { CoreOutput } from 'src/core/dtos/coreoutput.dto';
import { Shops } from '../entities/shops.entity';
import { CreateShopsInPut } from './create-shop.dto';

@InputType()
export class EditShopsInPut extends PartialType(CreateShopsInPut) {
  @Field(() => Number)
  shopId: number;
}

@ObjectType()
export class EditShopsOutPut extends CoreOutput {}
