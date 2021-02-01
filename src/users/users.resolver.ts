import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRole } from 'src/auth/role.decorator';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import {
  UpdateAccountInput,
  UpdateAccountOutPut,
} from './dtos/update-account.dto';
import { UserProfileInput, UserProfileOutPut } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => CreateAccountOutput)
  async createAccount(@Args('input') createAccountInput: CreateAccountInput) {
    try {
      const error = await this.usersService.createAccount(createAccountInput);
      if (error) {
        return {
          result: false,
          error: 'User is alredy exist',
        };
      }
      return {
        result: true,
      };
    } catch (e) {}
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Query(() => UserProfileOutPut)
  async getUserProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutPut> {
    try {
      const user = await this.usersService.findById(userProfileInput.userId);
      if (!user) {
        throw Error();
      }
      return {
        result: Boolean(user),
        user,
      };
    } catch (e) {
      return {
        error: 'User Not Found',
        result: false,
      };
    }
  }

  @Mutation(() => UpdateAccountOutPut)
  @UserRole(['Any'])
  async updateAcccount(
    @AuthUser() authUser: User,
    @Args('input') updateAccountInput: UpdateAccountInput,
  ): Promise<UpdateAccountOutPut> {
    try {
      await this.usersService.updateAcccount(authUser.id, updateAccountInput);
      return {
        result: true,
      };
    } catch (e) {
      return {
        result: false,
        error: 'Fail to update Account',
      };
    }
  }
}
