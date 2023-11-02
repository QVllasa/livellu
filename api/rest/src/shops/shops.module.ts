import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import {
  ApproveShopController,
  DisapproveShopController,
  ShopsController,
  StaffsController,
  NearByShopController,
} from './shops.controller';

@Module({
  controllers: [
    ShopsController,
    StaffsController,
    DisapproveShopController,
    ApproveShopController,
    NearByShopController,
  ],
  providers: [ShopsService],
})
export class ShopsModule {}
