import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "./entities/cart.entity";
import { Repository } from "typeorm";
import { MenuItemEntity } from "src/menu-item/entities/menu-item.entity";
import { CartItemEntity } from "./entities/cart-items.entity";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,

    @InjectRepository(MenuItemEntity)
    private readonly menuRepository: Repository<MenuItemEntity>,

    @InjectRepository(CartItemEntity)
    private readonly cartItemsRepository: Repository<CartItemEntity>,
  ) {}

  async getCart(userId: number) {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: { items: true },
    });

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId } });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(userId: number, productId: number) {
    const product = await this.menuRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException("محصولی با این شناسه یافت نشد.");
    }

    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: {
        items: {
          product: true,
        },
      },
    });

    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId } });
      await this.cartRepository.save(cart);
    }

    const existingItem = cart.items.find((item) => item.product.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
      await this.cartItemsRepository.save(existingItem);
    } else {
      const newItem = this.cartItemsRepository.create({
        cart,
        price: product.price,
        product: { id: product.id },
        quantity: 1,
      });

      await this.cartItemsRepository.save(newItem);
    }

    return { message: "محصول مورد نظر با موفقیت به سبد خرید شما اضافه شد." };
  }

  async removeFromCart(userId: number, productId: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: {
        items: {
          product: true,
        },
      },
    });

    if (!cart) {
      throw new NotFoundException("سبد خریدی یافت نشد.");
    }

    const existingItem = cart.items.find((item) => item.product.id === productId);

    let message: string = "";

    if (existingItem) {
      if (existingItem.quantity === 1) {
        await this.cartItemsRepository.delete(productId);
        message = "محصول مورد نظر با موفقیت از سبد خرید شما حذف شد.";
      } else {
        existingItem.quantity -= 1;
        await this.cartItemsRepository.save(existingItem);
        message = "تعداد 1 عدد از محصول مورد نظر از سبد خرید شما کم شد.";
      }
    } else {
      message = "محصول مورد نظر در سبد خرید شما وجود ندارد.";
    }

    return { message };
  }
}
