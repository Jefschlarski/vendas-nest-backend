import { Order } from "../../order/entities/order.entity";
import { Address } from "../../address/entities/address.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FavoriteProduct } from "../../favorite-product/entities/favorite-product.entity";

@Entity({name: 'user'})
export class User{

    @PrimaryGeneratedColumn('rowid')
    id: number;

    @Column({name: 'name', nullable: false})
    name: string;

    @Column({name: 'email', nullable: false})
    email: string;
    
    @Column({name: 'phone'})
    phone: string
    
    @Column({name: 'cpf', nullable: false})
    cpf: string;
     
    @Column({name: 'type_user', nullable: false})
    typeUser: number;

    @Column({name: 'password', nullable: false})
    password: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt:Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt:Date;

    @OneToMany(() => Address, (address) => address.user)
    addresses?:Address[];

    @OneToMany(() => Order, (order) => order.address)
    orders?:Order[];

    @OneToMany(() => FavoriteProduct, (favoriteProduct) => favoriteProduct.user)
    favoriteProducts?:FavoriteProduct[];
}