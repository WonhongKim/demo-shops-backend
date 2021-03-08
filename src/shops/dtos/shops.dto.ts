import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/core/dtos/pagination.dto';
import { Shops } from '../entities/shops.entity';

@InputType()
export class ShopsInput extends PaginationInput {}

@ObjectType()
export class ShopsOutput extends PaginationOutput {
  @Field(() => [Shops], { nullable: true })
  ShopList?: Shops[];
}
