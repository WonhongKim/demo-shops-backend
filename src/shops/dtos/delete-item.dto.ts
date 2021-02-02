import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/coreoutput.dto';

@InputType()
export class DeleteItemInput {
  @Field(() => Int)
  itemId: number;
}

@ObjectType()
export class DeleteItemOutput extends CoreOutput {}
