import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Shops } from 'src/shops/entities/shops.entity';
import { CoreOutput } from './coreoutput.dto';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;
}

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field(() => [Shops], { nullable: true })
  shops?: Shops[];

  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Int, { nullable: true })
  totalResults?: number;
}
