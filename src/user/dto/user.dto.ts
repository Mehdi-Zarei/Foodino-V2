import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class UserAddressDto {
  @ApiProperty({ example: "منزل", description: "عنوان آدرس" })
  @Length(3, 15)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: "تهران", description: "استان" })
  @Length(3, 15)
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({ example: "تهران", description: "شهر" })
  @Length(3, 15)
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: "تهران-میدان آزادی", description: "آدرس محل سکونت" })
  @Length(10, 100)
  @IsString()
  @IsNotEmpty()
  physicalAddress: string;
}
