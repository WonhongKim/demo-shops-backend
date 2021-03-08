import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Shops } from './entities/shops.entity';
import { MallTypeRepository } from './repositories/mallType.repository';
import {
  ItemResolver,
  MallTypeResolver,
  ShopsResolver,
} from './shops.resolver';
import { ShopsService } from './shops.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shops, MallTypeRepository, Item]),
    ConfigService,
  ],
  providers: [ShopsService, ShopsResolver, MallTypeResolver, ItemResolver],
})
export class ShopsModule {}
