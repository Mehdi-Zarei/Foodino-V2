import { Controller, Post, Body, HttpCode, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto, SendOtpDto, VerifyOtpDto } from "./dto/create-auth.dto";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swaggerConsumes.enum";
import { Request } from "express";
import { CustomAuthGuard } from "src/common/guards/customAuthGuard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiOperation({ summary: "Send OTP Code." })
  @Post("/send")
  @HttpCode(200)
  send(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.send(sendOtpDto);
  }

  @HttpCode(200)
  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiOperation({ summary: "Verify OTP Code." })
  @Post("/verify")
  verify(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verify(verifyOtpDto);
  }

  @ApiConsumes(SwaggerConsumes.FORM)
  @ApiOperation({ summary: "Register User." })
  @Post("/register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    summary: "Get New AccessToken",
    description:
      "In this route, the refresh token must be sent via cookies, not in the headers. The cookie named refreshToken is stored as HttpOnly in the browser and must be included with the request.",
  })
  @HttpCode(200)
  @Post("refresh-token")
  refreshToken(@Req() req: Request) {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new UnauthorizedException("لطفا واد حساب کاربری خود شوید.");
    }

    return this.authService.refreshToken(token);
  }

  @ApiOperation({ summary: "Logout" })
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @HttpCode(200)
  @Post("/logout")
  logout(@Req() req: Request) {
    const userId = req.user?.id;
    return this.authService.logout(userId!);
  }
}
