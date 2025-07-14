import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile } from "@nestjs/common";
import { MenuItemService } from "./menu-item.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CustomAuthGuard } from "src/common/guards/customAuthGuard";
import { Roles } from "src/common/decorators/roles.decorator";
import { SwaggerConsumes } from "src/common/enums/swaggerConsumes.enum";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Menu Items")
@Controller("menu-item")
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @ApiConsumes(SwaggerConsumes.MULTIPART)
  @UseInterceptors(FileInterceptor("image"))
  @Roles("ADMIN")
  @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto, @UploadedFile() image: Express.Multer.File) {
    return this.menuItemService.create(createMenuItemDto, image);
  }
}
