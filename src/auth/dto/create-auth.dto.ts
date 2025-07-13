import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsPhoneNumber, IsString } from "class-validator";

export class SendOtpDto {
  @IsPhoneNumber("IR", { message: "شماره تلفن باید 11 رقم داشته باشد و با 09 شروع شود." })
  @IsNotEmpty({ message: "شماره موبایل نمیتواند خالی باشد." })
  @ApiProperty({ example: "09123456789" })
  phone: string;
}

export class VerifyOtpDto {
  @IsPhoneNumber("IR", { message: "شماره تلفن باید 11 رقم داشته باشد و با 09 شروع شود." })
  @IsNotEmpty({ message: "شماره موبایل نمیتواند خالی باشد." })
  @ApiProperty({ example: "09123456789" })
  phone: string;

  @IsNumberString()
  @IsNotEmpty({ message: "کد یکبارمصرف نمیخواتد خالی باشد." })
  @ApiProperty({ example: "12345" })
  code: string;
}
