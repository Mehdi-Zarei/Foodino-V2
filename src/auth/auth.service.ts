import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { SendOtpDto, VerifyOtpDto } from "./dto/create-auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { RedisService } from "src/redis/redis.service";
import { randomInt } from "crypto";
import { SmsService } from "src/sms/sms.service";
import { TokenService } from "./token.service";
import { HashService } from "./bcrypt.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly redisService: RedisService,

    private readonly smsService: SmsService,

    private readonly tokenService: TokenService,

    private readonly hashService: HashService,
  ) {}

  async send(sendOtpDto: SendOtpDto) {
    const { phone } = sendOtpDto;

    const user = await this.userRepository.findOneBy({ phone });

    if (user && user.isRestrict) {
      throw new BadRequestException("این حساب کاربری توسط مدیر مسدود شده است.");
    }

    const storedOtp = await this.redisService.getKey(`otp:${phone}`);
    if (storedOtp) {
      throw new BadRequestException("کد یکبارمصرف قبلا برای شما ارسال گردیده است.");
    }

    const code = randomInt(10000, 99999);

    await this.redisService.setKey(`otp:${phone}`, code, 120);

    const sms = await this.smsService.sendSms(phone, code);
    if (sms.success) {
      return { message: "کد یکبار مصرف برای شما ارسال گردید." };
    } else {
      throw new InternalServerErrorException("خطا در ارسال کد یکبار مصرف!لطفا بعدا تلاش فرمائید.");
    }
  }

  async verify(verifyOtpDto: VerifyOtpDto) {
    const { phone, code } = verifyOtpDto;

    const storedCode = await this.redisService.getKey(`otp:${phone}`);
    if (!storedCode || storedCode !== code) {
      throw new UnauthorizedException("کد وارد شده صحیح نبوده و یا منقضی شده است.");
    }

    const isUserExist = await this.userRepository.findOneBy({ phone });
    if (isUserExist) {
      const accessToken = this.tokenService.createAccessToken({ id: isUserExist.id, role: isUserExist.role });

      const refreshToken = this.tokenService.createRefreshToken({ id: isUserExist.id, role: isUserExist.role });

      const hashedRefreshToken = await this.hashService.hashData(refreshToken);

      await this.redisService.removeKey(`otp:${phone}`);
      await this.redisService.setKey(`refreshToken:${isUserExist.id}`, hashedRefreshToken, 2592000);

      return {
        message: "شما با موفقیت وارد حساب کاربری خود شدید.",
        accessToken,
        refreshToken,
      };
    } else {
      await this.redisService.removeKey(`otp:${phone}`);
      return {
        status: "NOT_REGISTERED",
        redirect: "/auth/register",
        message: "کاربر حسابی ندارد. به صفحه ثبت‌نام منتقل شود.",
      };
    }
  }
}
