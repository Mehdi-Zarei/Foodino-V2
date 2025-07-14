import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function swaggerConfigInit(app: INestApplication) {
  const document = new DocumentBuilder()
    .setVersion("2.0.0")
    .setTitle("A Foodino website's Back-End - V2 ")
    .setDescription("This is the backend API for a ...")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        in: "header",
      },
      "accessToken",
    )
    .build();

  const swaggerDocuments = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup("/swagger", app, swaggerDocuments);
}
