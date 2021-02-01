import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from 'src/core/dtos/coreoutput.dto';

@InputType()
export class DeleteShopsInPut {
  @Field(() => Number)
  shopId: number;
}

@ObjectType()
export class DeleteShopsOutPut extends CoreOutput {}
