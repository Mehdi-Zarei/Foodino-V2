import { UserEntity } from "src/user/entities/user.entity";
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItemEntity } from "./cart-items.entity";

@Entity("cart")
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, (user) => user.cart, { onDelete: "CASCADE" })
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => CartItemEntity, (items) => items.cart, { onDelete: "CASCADE" })
  items: CartItemEntity[];
}
