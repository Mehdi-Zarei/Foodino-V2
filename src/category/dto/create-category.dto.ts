import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsNumberString, Matches } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z ]+$/, { message: "فیلد slug فقط باید شامل حروف انگلیسی بدون خط تیره باشد" })
  slug: string;

  @ApiProperty({ format: "binary" })
  image: string;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  parentId?: number;
}
