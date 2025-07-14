import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "./configs/typeorm.config";
import { UserModule } from "./user/user.module";
import { CategoryModule } from "./category/category.module";
import { AuthModule } from "./auth/auth.module";
import { RedisModule } from "./redis/redis.module";
import { JwtModule } from "@nestjs/jwt";
import { MenuItemModule } from './menu-item/menu-item.module';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig()), UserModule, CategoryModule, AuthModule, RedisModule, JwtModule, MenuItemModule],
  controllers: [],
  providers: [],
  exports: [JwtModule],
})
export class AppModule {}
