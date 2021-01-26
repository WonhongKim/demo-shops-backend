import { Resolver,Query, Mutation, Args } from "@nestjs/graphql";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService){}

     @Query(() => Boolean)
        Test(){
            return true;
        }
    

    @Mutation(() => CreateAccountOutput)
    async createAccount(@Args("input") createAccountInput: CreateAccountInput){
        try {
            const error = await this.usersService.createAccount(createAccountInput);
            if(error){
                return {
                    result: false,
                    error: 'User is alredy exist',
                }
            }
            return {
                result: true
            }
        }
        catch(e){
        }
    }

    @Mutation(() => LoginOutput)
    async login(@Args('input') loginInput:LoginInput): Promise<LoginOutput>{
        return this.usersService.login(loginInput);
    }
    
}
    
