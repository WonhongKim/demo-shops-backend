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
import { Item } from './entities/item.entity';
import { CreateItemInput, CreateItemOutput } from './dtos/create-item.dto';
import { ShopInput, ShopOutput } from './dtos/shop.dto';
import { EditItemInput, EditItemOutput } from './dtos/edit-item.dto';
import { DeleteItemInput, DeleteItemOutput } from './dtos/delete-item.dto';

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
  async eidtShop(
    @AuthUser() authUser: User,
    @Args('input') editshopinput: EditShopsInPut,
  ): Promise<EditShopsOutPut> {
    return this.shopsService.editShop(authUser, editshopinput);
  }

  @Mutation(() => DeleteShopsOutPut)
  @UserRole(['Owner'])
  async deleteShop(
    @AuthUser() authUser: User,
    @Args('input') deleteshopsinput: DeleteShopsInPut,
  ): Promise<DeleteShopsOutPut> {
    return this.shopsService.deleteShop(authUser, deleteshopsinput);
  }

  @Query(() => ShopsOutput)
  allShops(@Args('input') shopsinput: ShopsInput): Promise<ShopsOutput> {
    return this.shopsService.allShops(shopsinput);
  }

  @Query(() => ShopOutput)
  shopbyid(@Args('input') shopinput: ShopInput): Promise<ShopOutput> {
    return this.shopsService.findShopById(shopinput);
  }

  @Query(() => SearchShopsOutput)
  searchShops(
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

@Resolver(() => Item)
export class ItemResolver {
  constructor(private readonly shopsService: ShopsService) {}

  @Mutation(() => CreateItemOutput)
  @UserRole(['Owner'])
  createItem(
    @AuthUser() owner: User,
    @Args('input') createiteminput: CreateItemInput,
  ) {
    return this.shopsService.createItem(owner, createiteminput);
  }

  @Mutation(() => EditItemOutput)
  @UserRole(['Owner'])
  editItem(
    @AuthUser() owner: User,
    @Args('input') edititeminput: EditItemInput,
  ): Promise<EditItemOutput> {
    return this.shopsService.editItem(owner, edititeminput);
  }

  @Mutation(() => DeleteItemOutput)
  @UserRole(['Owner'])
  deleteItem(
    @AuthUser() owner: User,
    @Args('input') deleteiteminput: DeleteItemInput,
  ): Promise<DeleteItemOutput> {
    return this.shopsService.deleteItem(owner, deleteiteminput);
  }
}
