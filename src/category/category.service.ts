import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Repository } from "typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { S3Service } from "src/s3/s3.service";
import slugify from "slugify";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    private readonly s3Service: S3Service,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, image: Express.Multer.File) {
    const { title, parentId, slug } = createCategoryDto;

    const isCategoryExist = await this.categoryRepository.findOneBy({ title });
    if (isCategoryExist) {
      throw new ConflictException("دسته بندی تکرای می باشد.");
    }

    let parent: CategoryEntity | undefined | null = undefined;

    if (parentId) {
      parent = await this.categoryRepository.findOneBy({ id: parentId });
      if (!parent) {
        throw new NotFoundException("دسته بندی اصلی یافت نشد.");
      }
    }

    const { Location } = await this.s3Service.uploadFile(image, "category-images");

    const newSlug = slugify(slug);

    const newCategory = this.categoryRepository.create({
      title,
      image: Location,
      parent,
      slug: newSlug,
    });

    await this.categoryRepository.save(newCategory);

    return { message: "دسته بندی با موفقیت ساخته شد." };
  }

  async findAll() {
    const categories = await this.categoryRepository.find({
      where: {},
      relations: {
        parent: true,
      },
      select: {
        parent: { title: true },
      },
    });
    if (!categories.length) {
      throw new NotFoundException("دسته بندی یافت نشد.");
    }

    return categories;
  }

  async findOne(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: {
        parent: true,
      },
      select: {
        parent: { title: true },
      },
    });
    if (!category) {
      throw new NotFoundException("دسته بندی یافت نشد.");
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, image: Express.Multer.File) {
    const { slug, title, parentId } = updateCategoryDto;

    const isCategoryExist = await this.categoryRepository.findOneBy({ id });
    if (!isCategoryExist) {
      throw new NotFoundException("دسته بندی یافت نشد.");
    }

    if (slug) {
      const newSlug = slugify(slug);
      isCategoryExist.slug = newSlug;
    }

    if (title) isCategoryExist.title = title;

    if (parentId) {
      const isExist = await this.categoryRepository.findOneBy({ id: parentId });
      if (!isExist) {
        throw new NotFoundException("دسته بندی اصلی یافت نشد.");
      }

      isCategoryExist.parent = isExist;
    }

    if (image) {
      console.log("image");
      await this.s3Service.deleteFile(isCategoryExist.image);

      const newImage = await this.s3Service.uploadFile(image, "category-image");
      isCategoryExist.image = newImage.Location;
    }

    await this.categoryRepository.save(isCategoryExist);

    return { message: "دسته بندی با موفقیت بروزرسانی گردید." };
  }

  async remove(id: number) {
    const removeCategory = await this.categoryRepository.findOneBy({ id });
    if (!removeCategory) {
      throw new NotFoundException("دسته بندی یافت نشد.");
    }

    await this.s3Service.deleteFile(removeCategory.image);
    await this.categoryRepository.delete(removeCategory.id);

    return { message: "دسته بندی با موفقیت حذف شد." };
  }
}
