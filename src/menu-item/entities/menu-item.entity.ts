import { CartItemEntity } from "src/cart/entities/cart-items.entity";
import { CategoryEntity } from "src/category/entities/category.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("menu_item")
export class MenuItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "numeric" })
  price: number;

  @Column()
  image: string;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => CategoryEntity, (category) => category.menuItems, {
    onDelete: "SET NULL",
    nullable: true,
  })
  subCategory: CategoryEntity;

  @OneToMany(() => CartItemEntity, (item) => item.product)
  cartItems: CartItemEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
