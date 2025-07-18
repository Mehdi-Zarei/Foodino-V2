import { Sse } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function TypeOrmConfig(): TypeOrmModuleOptions {
  const { DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME, DB_NAME } = process.env;

  return {
    type: "mysql",
    host: DB_HOST,
    database: DB_NAME,
    port: parseInt(DB_PORT!, 10),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    synchronize: false,
    autoLoadEntities: true,
    entities: [__dirname + "/../**/*.entity.{ts,js}"],
  };
}
