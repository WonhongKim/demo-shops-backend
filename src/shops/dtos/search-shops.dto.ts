import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/core/dtos/pagination.dto';
import { Shops } from '../entities/shops.entity';

@InputType()
export class SearchShopsInput extends PaginationInput {
  @Field(() => String)
  query: string;
}

@ObjectType()
export class SearchShopsOutput extends PaginationOutput {
  @Field(() => [Shops], { nullable: true })
  shops?: Shops[];
}
