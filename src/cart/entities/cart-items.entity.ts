import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartEntity } from "./cart.entity";
import { MenuItemEntity } from "src/menu-item/entities/menu-item.entity";

@Entity("cart_items")
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "numeric" })
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  cart: CartEntity;

  @ManyToOne(() => MenuItemEntity, (product) => product.cartItems, { onDelete: "CASCADE" })
  product: MenuItemEntity;
}
