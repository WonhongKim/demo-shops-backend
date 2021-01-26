import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/core/dtos/coreoutput.dto";
import { User } from "../entities/user.entity";

@InputType()
export class LoginInput extends PickType(User, ["email", 'password']){}


@ObjectType()
export class LoginOutput extends CoreOutput{
    @Field(() => String, { nullable: true })
  token?: string;
}