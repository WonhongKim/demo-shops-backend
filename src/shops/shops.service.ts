import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateShopsInPut, CreateShopsOutPut } from './dtos/create-shop.dto';
import { MallType } from './entities/mallType.entity';
import { Shops } from './entities/shops.entity';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shops)
    private readonly shops: Repository<Shops>,
    @InjectRepository(MallType)
    private readonly mallType: Repository<MallType>,
  ) {}

  async createShop(
    owner: User,
    createShopsInPut: CreateShopsInPut,
  ): Promise<CreateShopsOutPut> {
    try {
      const newshop = this.shops.create(createShopsInPut);
      newshop.owner = owner;
      const mallTypeName = createShopsInPut.mallTypeName.trim().toLowerCase();
      const mallTypeNameSlug = mallTypeName.replace(/ /g, '-');
      let mallType = await this.mallType.findOne({ name: mallTypeNameSlug });
      if (!mallType) {
        mallType = await this.mallType.save(
          this.mallType.create({ name: mallTypeNameSlug }),
        );
      }
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
}
