import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MenuItemEntity } from "./entities/menu-item.entity";
import { EntityNotFoundError, IsNull, Not, Repository } from "typeorm";
import { CategoryEntity } from "src/category/entities/category.entity";
import { NotFoundError } from "rxjs";
import { S3Service } from "src/s3/s3.service";
import slugify from "slugify";

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItemEntity)
    private readonly menuRepository: Repository<MenuItemEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    private readonly s3Service: S3Service,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto, image: Express.Multer.File) {
    const { title, description, slug, price, subCategory } = createMenuItemDto;

    const isItemExist = await this.menuRepository.findOneBy({ title });
    if (isItemExist) {
      throw new ConflictException("این آیتم قبلا اضافه شده است.");
    }

    const isSubCategoryExist = await this.categoryRepository.findOne({
      where: {
        parent: Not(IsNull()),
        id: subCategory,
      },
    });

    if (!isSubCategoryExist) {
      throw new NotFoundException("دسته بندی یافت نشد.");
    }

    const { Location } = await this.s3Service.uploadFile(image, "item-menu-images");

    const newSlug = slugify(slug);

    const newItem = this.menuRepository.create({
      title,
      description,
      image: Location,
      price,
      slug: newSlug,
      subCategory: { id: isSubCategoryExist.id },
    });

    await this.menuRepository.save(newItem);

    return { message: "آیتم جدید منو با موفقیت ساخته شد." };
  }
}
