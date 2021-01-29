import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserRole } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateShopsInPut, CreateShopsOutPut } from './dtos/create-shop.dto';
import { DeleteShopsInPut, DeleteShopsOutPut } from './dtos/delete-shop.dto';
import { EditShopsInPut, EditShopsOutPut } from './dtos/edit-shop.dto';
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

  @Mutation(() => EditShopsOutPut)
  @UserRole(['Owner'])
  async EidtShop(
    @AuthUser() authUser: User,
    @Args('input') editshopinput: EditShopsInPut,
  ): Promise<EditShopsOutPut> {
    return this.shopsService.editShop(authUser, editshopinput);
  }

  @Mutation(() => DeleteShopsOutPut)
  @UserRole(['Owner'])
  async DeleteShop(
    @AuthUser() authUser: User,
    @Args('input') deleteshopsinput: DeleteShopsInPut,
  ): Promise<DeleteShopsOutPut> {
    return this.shopsService.deleteShop(authUser, deleteshopsinput);
  }
}
