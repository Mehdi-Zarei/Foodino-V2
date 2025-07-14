import { Module } from "@nestjs/common";
import { MenuItemService } from "./menu-item.service";
import { MenuItemController } from "./menu-item.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuItemEntity } from "./entities/menu-item.entity";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/user/entities/user.entity";
import { CategoryEntity } from "src/category/entities/category.entity";
import { S3Service } from "src/s3/s3.service";

@Module({
  imports: [TypeOrmModule.forFeature([MenuItemEntity, UserEntity, CategoryEntity])],
  controllers: [MenuItemController],
  providers: [MenuItemService, JwtService, S3Service],
})
export class MenuItemModule {}
