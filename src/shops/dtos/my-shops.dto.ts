import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/coreoutput.dto';
import { Shops } from '../entities/shops.entity';

@ObjectType()
export class MyShopsOutPut extends CoreOutput {
  @Field(() => [Shops], { nullable: true })
  myShops?: Shops[];
}
