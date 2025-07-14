import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsString, Length, Matches } from "class-validator";

export class CreateMenuItemDto {
  @ApiProperty({ example: "قرمه سبزی", description: "عنوان آیتم منو" })
  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  title: string;

  @ApiProperty({ example: "قرمه سبزی یک غذای اصل و قدمی ایرانی است...", description: "توضیحات غذا" })
  @IsString()
  @IsNotEmpty()
  @Length(10, 300)
  description: string;

  @ApiProperty({ example: "150000", description: "قیمت غذا/نوشیدنی" })
  @IsNotEmpty()
  @IsNumberString()
  price: number;

  @ApiProperty({ description: "عکس محصول", format: "binary" })
  image: string;

  @ApiProperty({ example: "ghorme sabzi", description: "اسلاگ" })
  @Matches(/^[a-zA-Z ]+$/, { message: "فیلد slug فقط باید شامل حروف انگلیسی بدون خط تیره باشد" })
  slug: string;

  @ApiProperty({ example: "1", description: "آیدی زیر دسته بندی" })
  @IsNumberString()
  @IsNotEmpty()
  subCategory: number;
}
