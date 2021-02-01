import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserRole } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { AllMallTypeOutPut } from './dtos/all-mallType.dto';
import { CreateShopsInPut, CreateShopsOutPut } from './dtos/create-shop.dto';
import { DeleteShopsInPut, DeleteShopsOutPut } from './dtos/delete-shop.dto';
import { EditShopsInPut, EditShopsOutPut } from './dtos/edit-shop.dto';
import { mallTypeInput, mallTypeOutPut } from './dtos/mallType.dto';
import { MallType } from './entities/mallType.entity';
import { Shops } from './entities/shops.entity';
import { ShopsService } from './shops.service';
import { ShopsInput, ShopsOutput } from './dtos/shops.dto';
import { SearchShopsInput, SearchShopsOutput } from './dtos/search-shops.dto';

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

  @Query(() => ShopsOutput)
  allShops(@Args('input') shopsinput: ShopsInput): Promise<ShopsOutput> {
    return this.shopsService.allShops(shopsinput);
  }

  @Query(() => SearchShopsOutput)
  searchRestaurant(
    @Args('input') searchshopsinput: SearchShopsInput,
  ): Promise<SearchShopsOutput> {
    return this.shopsService.searchShopsByName(searchshopsinput);
  }
}

@Resolver(() => MallType)
export class MallTypeResolver {
  constructor(private readonly shopsService: ShopsService) {}

  @ResolveField(() => Int)
  restaurantCount(@Parent() malltype: MallType): Promise<number> {
    return this.shopsService.countShops(malltype);
  }

  @Query(() => AllMallTypeOutPut)
  allMallTypes(): Promise<AllMallTypeOutPut> {
    return this.shopsService.allMallType();
  }

  @Query(() => mallTypeOutPut)
  mallType(
    @Args('input') malltypeinput: mallTypeInput,
  ): Promise<mallTypeOutPut> {
    return this.shopsService.findMallTypeBySlug(malltypeinput);
  }
}
