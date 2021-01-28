import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MallType } from './entities/mallType.entity';
import { Shops } from './entities/shops.entity';
import { ShopsResolver } from './shops.resolver';
import { ShopsService } from './shops.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shops, MallType]), ConfigService],
  providers: [ShopsService, ShopsResolver],
})
export class ShopsModule {}
