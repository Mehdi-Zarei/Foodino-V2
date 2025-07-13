import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { S3Service } from "src/s3/s3.service";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, UserEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, S3Service, JwtService],
})
export class CategoryModule {}
