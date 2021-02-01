import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/core/dtos/pagination.dto';
import { MallType } from '../entities/mallType.entity';

@InputType()
export class mallTypeInput extends PaginationInput {
  @Field(() => String)
  slug: string;
}

@ObjectType()
export class mallTypeOutPut extends PaginationOutput {
  @Field(() => MallType, { nullable: true })
  mallType?: MallType;
}
