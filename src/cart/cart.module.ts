import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartEntity } from "./entities/cart.entity";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/user/entities/user.entity";
import { MenuItemEntity } from "src/menu-item/entities/menu-item.entity";
import { CartItemEntity } from "./entities/cart-items.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, UserEntity, MenuItemEntity, CartItemEntity])],
  controllers: [CartController],
  providers: [CartService, JwtService],
})
export class CartModule {}
