import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shops } from './entities/shops.entity';
import { MallTypeRepository } from './repositories/mallType.repository';
import { MallTypeResolver, ShopsResolver } from './shops.resolver';
import { ShopsService } from './shops.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shops, MallTypeRepository]),
    ConfigService,
  ],
  providers: [ShopsService, ShopsResolver, MallTypeResolver],
})
export class ShopsModule {}
