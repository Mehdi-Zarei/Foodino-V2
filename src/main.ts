import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { swaggerConfigInit } from "./configs/swagger.config";
import { ValidationPipe } from "@nestjs/common";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const { PORT } = process.env;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  swaggerConfigInit(app);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useStaticAssets(join(__dirname, "..", "public"));

  await app.listen(PORT ?? 4000, () => {
    console.log(`🚀 Server is up and running at localhost:${PORT ?? 4000}`);
    console.log(`🚀 Swagger Documents: http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
