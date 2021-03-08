import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/coreoutput.dto';
import { MallType } from '../entities/mallType.entity';

@ObjectType()
export class AllMallTypeOutPut extends CoreOutput {
  @Field(() => [MallType], { nullable: true })
  mallTypes?: MallType[];
}
