import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "./configs/typeorm.config";
import { UserModule } from "./user/user.module";
import { CategoryModule } from "./category/category.module";
import { AuthModule } from "./auth/auth.module";
import { RedisModule } from "./redis/redis.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig()), UserModule, CategoryModule, AuthModule, RedisModule, JwtModule],
  controllers: [],
  providers: [],
  exports: [JwtModule],
})
export class AppModule {}
