import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/coreoutput.dto';
import { Shops } from '../entities/shops.entity';

@InputType()
export class CreateShopsInPut extends PickType(Shops, [
  'name',
  'address',
  'phoneNumber',
  'coverImage',
]) {
  @Field(() => String)
  mallTypeName: string;
}

@ObjectType()
export class CreateShopsOutPut extends CoreOutput {}
