import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SendOtpDto, VerifyOtpDto } from "./dto/create-auth.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swaggerConsumes.enum";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiConsumes(SwaggerConsumes.FORM)
  @Post("/send")
  send(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.send(sendOtpDto);
  }

  @ApiConsumes(SwaggerConsumes.FORM)
  @Post("/verify")
  verify(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verify(verifyOtpDto);
  }
}
