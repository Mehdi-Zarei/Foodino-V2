import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserAddressDto } from "./dto/user.dto";
import { UserAddressEntity } from "./entities/address.entity";
import { UpdateUserAddressDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(UserAddressEntity)
    private readonly addressRepository: Repository<UserAddressEntity>,
  ) {}

  async getAll(page: number, limit: number) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });

    if (total === 0) {
      throw new NotFoundException("کاربری یافت نشد.");
    }

    return {
      data: users,
      total,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("کاربری یافت نشد.");
    }

    return { user };
  }

  async toggleBanStatus(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("کاربر یافت نشد.");
    }

    user.isRestrict = !user.isRestrict;

    await this.userRepository.save(user);

    return {
      message: user.isRestrict ? " کاربر با موفقیت بن شد." : "بن کاربر با موفقیت برداشته شد. ",
    };
  }

  async addAddress(userAddressDto: UserAddressDto, userId: number) {
    const { title, city, province, physicalAddress } = userAddressDto;

    const isAddressExist = await this.addressRepository.findOneBy({ title });
    if (isAddressExist) {
      throw new ConflictException("آدرس تکراری می باشد.");
    }

    const newAddress = this.addressRepository.create({
      title,
      province,
      city,
      physicalAddress,
      user: { id: userId },
    });

    await this.addressRepository.save(newAddress);

    return { message: "آدرس شما با موفقیت ثبت شد." };
  }

  async getAddresses(userId: number) {
    const addresses = await this.addressRepository.find({ where: { user: { id: userId } } });
    if (!addresses.length) {
      throw new NotFoundException("آدرسی یافت نشد.");
    }

    return { addresses };
  }

  async removeAddress(addressId: number, userId: number) {
    const address = await this.addressRepository.delete({
      user: { id: userId },
      id: addressId,
    });

    if (!address.affected) {
      throw new NotFoundException("آدرسی یافت نشد.");
    }

    return { message: "آدرس شما با موفقیت حذف گردید." };
  }

  async updateAddress(addressId: number, userId: number, updateUserAddressDto: UpdateUserAddressDto) {
    const { title, city, province, physicalAddress } = updateUserAddressDto;

    const address = await this.addressRepository.findOne({
      where: {
        user: { id: userId },
        id: addressId,
      },
    });

    if (!address) {
      throw new NotFoundException("آدرسی یافت نشد.");
    }

    if (title) address.title = title;
    if (city) address.city = city;
    if (province) address.province = province;
    if (physicalAddress) address.physicalAddress = physicalAddress;

    await this.addressRepository.save(address);

    return { message: "آدرس شما با موفقیت ویرایش گردید." };
  }
}
