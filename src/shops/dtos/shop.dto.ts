import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/coreoutput.dto';
import { Shops } from '../entities/shops.entity';

@InputType()
export class ShopInput {
  @Field(() => Int)
  restaurantId: number;
}

@ObjectType()
export class ShopOutput extends CoreOutput {
  @Field(() => Shops, { nullable: true })
  Shop?: Shops;
}
