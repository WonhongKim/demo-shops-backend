import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/coreoutput.dto';
import { Shops } from '../entities/shops.entity';

@InputType()
export class MyShopInPut extends PickType(Shops, ['id']) {}

@ObjectType()
export class MyShopOutPut extends CoreOutput {
  @Field(() => Shops, { nullable: true })
  myShop?: Shops;
}
