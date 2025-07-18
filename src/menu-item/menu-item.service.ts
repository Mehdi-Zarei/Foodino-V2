import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MenuItemEntity } from "./entities/menu-item.entity";
import { EntityNotFoundError, IsNull, Not, Repository } from "typeorm";
import { CategoryEntity } from "src/category/entities/category.entity";
import { NotFoundError } from "rxjs";
import { S3Service } from "src/s3/s3.service";
import slugify from "slugify";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";

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

  async getAll() {
    const items = await this.menuRepository.find();
    if (!items.length) {
      throw new NotFoundException("هیچ آیتمی یافت نشد.");
    }

    return items;
  }

  async remove(id: number) {
    const remove = await this.menuRepository.delete(id);
    if (remove.affected === 0) {
      throw new NotFoundException("آیتمی یافت نشد");
    }

    return { message: "آیتم مورد نظر با موفقیت حذف گردید." };
  }

  async update(id: number, updateMenuDto: UpdateMenuItemDto, image: Express.Multer.File) {
    const { title, description, slug, price, subCategory } = updateMenuDto;

    const item = await this.menuRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException("آیتمی یافت نشد.");
    }

    if (title) item.title = title;
    if (description) item.description = description;
    if (slug) item.slug = slugify(slug);
    if (price) item.price = price;
    if (subCategory) {
      const isSubCategoryExist = await this.categoryRepository.findOne({
        where: {
          parent: Not(IsNull()),
          id: subCategory,
        },
      });

      if (!isSubCategoryExist) {
        throw new NotFoundException("دسته بندی یافت نشد.");
      }

      item.subCategory = isSubCategoryExist;
    }

    if (image) {
      await this.s3Service.deleteFile(item.image);
      const { Location } = await this.s3Service.uploadFile(image, "item-menu-images");
      item.image = Location;
    }

    await this.menuRepository.save(item);

    return { message: "عملیات با موفقیت انجام شد." };
  }
}
