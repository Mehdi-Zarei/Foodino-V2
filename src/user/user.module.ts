import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { UserAddressEntity } from "./entities/address.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserAddressEntity])],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
