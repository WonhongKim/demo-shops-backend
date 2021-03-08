import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'dns';
import { User } from 'src/users/entities/user.entity';
import { Raw, Repository } from 'typeorm';
import { AllMallTypeOutPut } from './dtos/all-mallType.dto';
import { CreateItemInput, CreateItemOutput } from './dtos/create-item.dto';
import { CreateShopsInPut, CreateShopsOutPut } from './dtos/create-shop.dto';
import { DeleteItemInput, DeleteItemOutput } from './dtos/delete-item.dto';
import { DeleteShopsInPut, DeleteShopsOutPut } from './dtos/delete-shop.dto';
import { EditItemInput, EditItemOutput } from './dtos/edit-item.dto';
import { EditShopsInPut, EditShopsOutPut } from './dtos/edit-shop.dto';
import { mallTypeInput, mallTypeOutPut } from './dtos/mallType.dto';
import { MyShopInPut, MyShopOutPut } from './dtos/my-shop.dto';
import { MyShopsOutPut } from './dtos/my-shops.dto';
import { SearchShopsInput, SearchShopsOutput } from './dtos/search-shops.dto';
import { ShopInput, ShopOutput } from './dtos/shop.dto';
import { ShopsInput, ShopsOutput } from './dtos/shops.dto';
import { Item } from './entities/item.entity';
import { MallType } from './entities/mallType.entity';
import { Shops } from './entities/shops.entity';
import { MallTypeRepository } from './repositories/mallType.repository';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shops)
    private readonly shops: Repository<Shops>,
    private readonly mallType: MallTypeRepository,
    @InjectRepository(Item)
    private readonly items: Repository<Item>,
  ) {}

  async createShop(
    owner: User,
    createShopsInPut: CreateShopsInPut,
  ): Promise<CreateShopsOutPut> {
    try {
      const newshop = this.shops.create(createShopsInPut);
      newshop.owner = owner;
      const mallType = await this.mallType.getOrCreate(
        createShopsInPut.mallTypeName,
      );
      newshop.malltype = mallType;
      await this.shops.save(newshop);
      return {
        result: true,
      };
    } catch {
      return {
        result: false,
        error: 'Could not create shops',
      };
    }
  }

  async editShop(
    owner: User,
    editshopinput: EditShopsInPut,
  ): Promise<EditShopsOutPut> {
    const shop = await this.shops.findOne(editshopinput.shopId);
    try {
      if (!shop) {
        return {
          result: false,
          error: 'There is no shop',
        };
      }
      if (owner.id !== shop.ownerId) {
        return {
          result: false,
          error: 'You cannot edit shop information',
        };
      }
      let malltype: MallType = null;
      if (editshopinput.mallTypeName) {
        malltype = await this.mallType.getOrCreate(editshopinput.mallTypeName);
      }
      await this.shops.save([
        {
          id: editshopinput.shopId,
          ...editshopinput,
          ...(malltype && { malltype }),
        },
      ]);
      return {
        result: true,
      };
    } catch (e) {
      return {
        result: false,
        error: 'error',
      };
    }
  }

  async deleteShop(
    owner: User,
    { shopId }: DeleteShopsInPut,
  ): Promise<DeleteShopsOutPut> {
    try {
      const shop = await this.shops.findOne(shopId);
      if (!shop) {
        return {
          result: false,
          error: 'shop not found',
        };
      }
      if (owner.id !== shop.ownerId) {
        return {
          result: false,
          error: "You can't delete a Shop that you don't own",
        };
      }
      await this.shops.delete(shopId);
      return {
        result: true,
      };
    } catch {
      return {
        result: false,
        error: 'Could not delete Shop.',
      };
    }
  }

  countShops(malltype: MallType) {
    return this.shops.count({ malltype });
  }

  async allShops({ page }: ShopsInput): Promise<ShopsOutput> {
    try {
      const [shops, totalResults] = await this.shops.findAndCount({
        skip: (page - 1) * 6,
        take: 6,
      });
      return {
        result: true,
        ShopList: shops,
        totalPages: Math.ceil(totalResults / 6),
        totalResults,
      };
    } catch {
      return {
        result: false,
        error: 'Could not load shops',
      };
    }
  }

  async findShopById({ shopId }: ShopInput): Promise<ShopOutput> {
    try {
      const shop = await this.shops.findOne(shopId, { relations: ['items'] });
      if (!shop) {
        return {
          result: false,
          error: 'Restaurant not found',
        };
      }
      return {
        result: true,
        shop,
      };
    } catch {
      return {
        result: false,
        error: 'Could not find restaurant',
      };
    }
  }

  async searchShopsByName({
    query,
    page,
  }: SearchShopsInput): Promise<SearchShopsOutput> {
    try {
      const [shops, totalResults] = await this.shops.findAndCount({
        where: {
          name: Raw(name => `${name} ILIKE '%${query}%'`),
        },
        skip: (page - 1) * 6,
        take: 6,
      });
      return {
        result: true,
        shops,
        totalResults,
        totalPages: Math.ceil(totalResults / 6),
      };
    } catch {
      return { result: false, error: 'Could not search for shop' };
    }
  }

  async myShops(owner: User): Promise<MyShopsOutPut> {
    try {
      const myShops = await this.shops.find({ owner });
      if (myShops) {
        return {
          result: true,
          myShops,
        };
      }
    } catch {
      return {
        result: false,
        error: 'Fail to load my shop list',
      };
    }
  }

  async myShop(owner: User, { id }: MyShopInPut): Promise<MyShopOutPut> {
    try {
      const myShop = await this.shops.findOne(
        { owner, id },
        { relations: ['items', 'orders'] },
      );
      if (myShop) {
        return {
          myShop,
          result: true,
        };
      }
    } catch {
      return {
        result: false,
        error: 'Fail to load my shop',
      };
    }
  }

  // Mall Type Start

  async allMallType(): Promise<AllMallTypeOutPut> {
    try {
      const mallTypes = await this.mallType.find();
      return {
        result: true,
        mallTypes,
      };
    } catch {
      return {
        result: false,
        error: 'Could not load MallTypes',
      };
    }
  }

  async findMallTypeBySlug({
    slug,
    page,
  }: mallTypeInput): Promise<mallTypeOutPut> {
    try {
      const mallType = await this.mallType.findOne({ slug });
      if (!mallType) {
        return {
          result: false,
          error: 'malltype not found',
        };
      }
      const shops = await this.shops.find({
        where: { malltype: mallType },
        take: 6,
        skip: (page - 1) * 6,
      });
      const totalResults = await this.countShops(mallType);
      return {
        result: true,
        mallType,
        shops,
        totalPages: Math.ceil(totalResults / 6),
      };
    } catch {
      return {
        result: false,
        error: 'Cannot load malltype',
      };
    }
  }

  async createItem(
    owner: User,
    createIteminput: CreateItemInput,
  ): Promise<CreateItemOutput> {
    try {
      const shop = await this.shops.findOne(createIteminput.shopId);
      if (!shop) {
        return {
          result: false,
          error: 'Restaurant not found',
        };
      }
      if (owner.id !== shop.ownerId) {
        return {
          result: false,
          error: "You can't do that.",
        };
      }
      await this.items.save(this.items.create({ ...createIteminput, shop }));
      return {
        result: true,
      };
    } catch (error) {
      return {
        result: false,
        error: 'Could not create Item',
      };
    }
  }

  async editItem(
    owner: User,
    edititeminput: EditItemInput,
  ): Promise<EditItemOutput> {
    try {
      const item = await this.items.findOne(edititeminput.itemId, {
        relations: ['shop'],
      });
      if (!item) {
        return {
          result: false,
          error: 'Item not found',
        };
      }
      if (item.shop.ownerId !== owner.id) {
        return {
          result: false,
          error: "You can't do that.",
        };
      }
      await this.items.save([
        {
          id: edititeminput.itemId,
          ...edititeminput,
        },
      ]);
      return {
        result: true,
      };
    } catch {
      return {
        result: false,
        error: 'Could not delete item',
      };
    }
  }

  async deleteItem(
    owner: User,
    { itemId }: DeleteItemInput,
  ): Promise<DeleteItemOutput> {
    try {
      const item = await this.items.findOne(itemId, {
        relations: ['shop'],
      });
      if (!item) {
        return {
          result: false,
          error: 'Item not found',
        };
      }
      if (item.shop.ownerId !== owner.id) {
        return {
          result: false,
          error: "You can't do that.",
        };
      }
      await this.items.delete(itemId);
      return {
        result: true,
      };
    } catch {
      return {
        result: false,
        error: 'Could not delete Item',
      };
    }
  }
}
