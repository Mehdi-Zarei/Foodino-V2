import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";

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

export class RegisterDto {
  @IsNotEmpty({ message: "نام نمیتواند خالی باشد." })
  @Length(3, 20, { message: "نام شما باید حداقل 3 و حداکثر 20 کاراکتر طول داشته باشد." })
  @IsString({ message: "نام شما باید به حروف باشد." })
  @ApiProperty({ example: "Mehdi", description: "نام کاربر" })
  name: string;

  @IsEmail({}, { message: "لطفا یک ایمیل معتبر وارد کنید." })
  @IsOptional()
  @ApiPropertyOptional({ example: "user@example.com", description: "ایمیل معتبر کاربر" })
  email?: string;

  @IsPhoneNumber("IR", { message: "شماره تلفن باید 11 رقم داشته باشد و با 09 شروع شود." })
  @IsNotEmpty()
  @ApiProperty({ example: "09123456789", description: "شماره موبایل با کد ایران" })
  phone: string;

  @ApiPropertyOptional({ example: "12345", description: "کد معرف" })
  @IsNumberString()
  @IsOptional()
  @Length(5)
  inviteCode: string;
}
