import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserRole } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateShopsInPut, CreateShopsOutPut } from './dtos/create-shop.dto';
import { Shops } from './entities/shops.entity';
import { ShopsService } from './shops.service';

@Resolver(() => Shops)
export class ShopsResolver {
  constructor(private readonly shopsService: ShopsService) {}

  @Mutation(() => CreateShopsOutPut)
  @UserRole(['Owner'])
  async createShop(
    @AuthUser() authUser: User,
    @Args('input') createShopsInPut: CreateShopsInPut,
  ): Promise<CreateShopsOutPut> {
    return this.shopsService.createShop(authUser, createShopsInPut);
  }
}
