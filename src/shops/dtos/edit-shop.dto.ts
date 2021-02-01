import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';

import { CoreOutput } from 'src/core/dtos/coreoutput.dto';

import { CreateShopsInPut } from './create-shop.dto';

@InputType()
export class EditShopsInPut extends PartialType(CreateShopsInPut) {
  @Field(() => Number)
  shopId: number;
}

@ObjectType()
export class EditShopsOutPut extends CoreOutput {}
