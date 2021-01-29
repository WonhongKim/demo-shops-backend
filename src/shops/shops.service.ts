import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateShopsInPut, CreateShopsOutPut } from './dtos/create-shop.dto';
import { DeleteShopsInPut, DeleteShopsOutPut } from './dtos/delete-shop.dto';
import { EditShopsInPut, EditShopsOutPut } from './dtos/edit-shop.dto';
import { MallType } from './entities/mallType.entity';
import { Shops } from './entities/shops.entity';
import { MallTypeRepository } from './repositories/mallType.repository';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shops)
    private readonly shops: Repository<Shops>,
    private readonly mallType: MallTypeRepository,
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
          error: "You can't delete a restaurant that you don't own",
        };
      }
      await this.shops.delete(shopId);
      return {
        result: true,
      };
    } catch {
      return {
        result: false,
        error: 'Could not delete restaurant.',
      };
    }
  }
}
