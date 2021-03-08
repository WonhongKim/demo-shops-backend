import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/shops/entities/item.entity';
import { Shops } from 'src/shops/entities/shops.entity';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrdersResolver } from './order.resolver';
import { OrdersService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Shops, OrderItem, Item])],
  providers: [OrdersService, OrdersResolver],
})
export class OrdersModule {}
