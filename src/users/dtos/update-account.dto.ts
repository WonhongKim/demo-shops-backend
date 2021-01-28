import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/coreoutput.dto';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateAccountInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}

@ObjectType()
export class UpdateAccountOutPut extends CoreOutput {}
