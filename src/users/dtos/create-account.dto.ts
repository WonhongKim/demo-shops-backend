import {InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from "src/core/dtos/coreoutput.dto";

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'name',
  'role',
]) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput{}
