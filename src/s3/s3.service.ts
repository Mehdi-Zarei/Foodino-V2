import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { extname } from "path";

@Injectable()
export class S3Service {
  private readonly s3: S3;
  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      endpoint: process.env.LIARA_ENDPOINT!,
      region: process.env.AWS_REGION,
      s3ForcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File, folderName: string) {
    const ext = extname(file.originalname);
    return await this.s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: `${folderName}/${Date.now()}${ext}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();
  }

  async deleteFile(fileUrl: string) {
    try {
      const url = new URL(fileUrl);
      const pathname = decodeURI(url.pathname);
      const key = pathname.startsWith("/") ? pathname.slice(9) : pathname;

      return await this.s3
        .deleteObject({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: key,
        })
        .promise();
    } catch (error) {
      console.error("❌ Error deleting file:", error);
      throw new Error("خطا در حذف فایل");
    }
  }
}
