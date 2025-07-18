import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserAddressEntity } from "./address.entity";
import { CartEntity } from "src/cart/entities/cart.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ type: "enum", enum: ["ADMIN", "USER"], default: "USER" })
  role: string;

  @Column({ type: "boolean", default: false })
  isRestrict: boolean;

  @Column({ unique: true, nullable: true })
  inviteCode?: string;

  @Column({ nullable: true })
  referrerId?: string;

  @OneToMany(() => UserAddressEntity, (address) => address.user)
  addresses: UserAddressEntity;

  @OneToOne(() => CartEntity, (cart) => cart.user)
  cart: CartEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
