import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Get, Delete, Param, ParseIntPipe, Patch } from "@nestjs/common";
import { MenuItemService } from "./menu-item.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CustomAuthGuard } from "src/common/guards/customAuthGuard";
import { Roles } from "src/common/decorators/roles.decorator";
import { SwaggerConsumes } from "src/common/enums/swaggerConsumes.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";

@ApiTags("Menu Items")
@Controller("menu-item")
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @ApiConsumes(SwaggerConsumes.MULTIPART)
  @ApiOperation({ summary: "Admin Can Create Item Of Menu." })
  @UseInterceptors(FileInterceptor("image"))
  @Roles("ADMIN")
  @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto, @UploadedFile() image: Express.Multer.File) {
    return this.menuItemService.create(createMenuItemDto, image);
  }

  @ApiOperation({ summary: "Get All Items In Menu." })
  @Get()
  getAll() {
    return this.menuItemService.getAll();
  }

  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @ApiConsumes(SwaggerConsumes.MULTIPART)
  @ApiOperation({ summary: "Admin Can Remove Item Of Menu." })
  @Roles("ADMIN")
  @Delete("remove/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.menuItemService.remove(id);
  }

  @UseGuards(CustomAuthGuard)
  @ApiBearerAuth("accessToken")
  @ApiConsumes(SwaggerConsumes.MULTIPART)
  @ApiOperation({ summary: "Admin Can Update Item Of Menu." })
  @UseInterceptors(FileInterceptor("image"))
  @Roles("ADMIN")
  @Patch("update/:id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuItemDto,
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    return this.menuItemService.update(id, updateMenuDto, image);
  }
}
