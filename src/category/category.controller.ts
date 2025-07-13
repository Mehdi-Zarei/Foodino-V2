import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swaggerConsumes.enum";
import { CustomAuthGuard } from "src/common/guards/customAuthGuard";
import { Roles } from "src/common/decorators/roles.decorator";

@ApiTags("Category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiConsumes(SwaggerConsumes.MULTIPART)
  @ApiOperation({ summary: "Admin Can Create Category." })
  @UseInterceptors(FileInterceptor("image"))
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() image: Express.Multer.File) {
    return this.categoryService.create(createCategoryDto, image);
  }

  @ApiOperation({ summary: "Get All Categories." })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: "Get One Category With SubCategories By Slug." })
  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.categoryService.findOne(slug);
  }

  @ApiConsumes(SwaggerConsumes.MULTIPART)
  @ApiOperation({ summary: "Update Category Info." })
  @ApiBearerAuth("accessToken")
  @UseInterceptors(FileInterceptor("image"))
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto, @UploadedFile() image: Express.Multer.File) {
    return this.categoryService.update(id, updateCategoryDto, image);
  }

  @ApiOperation({ summary: "Remove Category with ID." })
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
