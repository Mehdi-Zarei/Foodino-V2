import { Controller, Get, Patch, Param, UseGuards, Query, DefaultValuePipe, ParseIntPipe, Req, Body, Post, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { CustomAuthGuard } from "src/common/guards/customAuthGuard";
import { Request } from "express";
import { UserAddressDto } from "./dto/user.dto";
import { SwaggerConsumes } from "src/common/enums/swaggerConsumes.enum";
import { UpdateUserAddressDto } from "./dto/update-user.dto";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Admin can get all users with pagination." })
  @ApiQuery({ name: "page", required: false, description: "صفحه مورد نظر" })
  @ApiQuery({ name: "limit", required: false, description: "تعداد آیتم‌ها در هر صفحه" })
  @Get("/")
  getAll(@Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number, @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    return this.userService.getAll(page, limit);
  }

  @ApiOperation({ summary: "User Get Their Profile." })
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Get("me")
  getMe(@Req() req: Request) {
    const user = req.user as {
      name: string;
      email?: string;
      phone: string;
      addresses: string;
    };

    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
    };
  }

  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Users can add address." })
  @ApiConsumes(SwaggerConsumes.FORM)
  @Post("/address")
  addAddress(@Req() req: Request, @Body() userAddressDto: UserAddressDto) {
    const userId = req.user.id;
    return this.userService.addAddress(userAddressDto, userId);
  }

  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Users can get addresses." })
  @Get("/address")
  getAddresses(@Req() req: Request) {
    const userId = req.user.id;
    return this.userService.getAddresses(userId);
  }

  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Users can Remove Their address." })
  @Delete("address/:id")
  removeAddress(@Req() req: Request, @Param("id", ParseIntPipe) addressId: number) {
    const userId = req.user.id;
    return this.userService.removeAddress(addressId, userId);
  }

  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Users can Update Their address." })
  @ApiConsumes(SwaggerConsumes.FORM)
  @Patch("address/:id")
  updateAddress(@Req() req: Request, @Param("id", ParseIntPipe) addressId: number, @Body() updateUserAddressDto: UpdateUserAddressDto) {
    const userId = req.user.id;
    return this.userService.updateAddress(addressId, userId, updateUserAddressDto);
  }

  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @ApiBearerAuth("accessToken")
  @ApiOperation({ summary: "Admin can get main user." })
  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number) {
    return this.userService.getOne(id);
  }

  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @ApiBearerAuth("accessToken")
  @Patch("toggle-ban/:id")
  @ApiOperation({ summary: "Admin can ban or lifting the ban users." })
  toggleBanStatus(@Param("id", ParseIntPipe) id: number) {
    return this.userService.toggleBanStatus(id);
  }
}
