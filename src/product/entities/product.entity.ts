import { OrderProduct } from "../../order-product/entities/order-product.entity";
import { CartProduct } from "../../cart-product/entities/cart-product.entity";
import { Category } from "../../category/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { FavoriteProduct } from "../../favorite-product/entities/favorite-product.entity";

@Entity({name: 'product'})
export class Product {
    @PrimaryGeneratedColumn('rowid')
    id: number;
    
    @Column({name: 'name', nullable: false})
    name: string;
    
    @Column({name: 'category_id', nullable: false})
    categoryId: number;

    @Column({name: 'price', type: 'decimal', precision: 10, scale: 2,  nullable: false})
    price: number;

    @Column({name: 'image', nullable: false})
    image: string; 

    @CreateDateColumn({name: 'created_at'})    
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date; 

    @ManyToOne(() => Category, (category: Category)=> category.products)
    @JoinColumn({name: 'category_id', referencedColumnName: 'id'})
    category?: Category;

    @OneToMany(() => CartProduct, (cartProduct: CartProduct)=> cartProduct.product)
    @JoinColumn({name: 'id', referencedColumnName: 'productId'})
    cartProduct?: CartProduct[]

    @OneToMany(() => OrderProduct, (orderProduct: OrderProduct)=> orderProduct.product)
    @JoinColumn({name: 'id', referencedColumnName: 'productId'})
    orderProducts?: OrderProduct[];

    @ManyToOne(() => FavoriteProduct, (favoriteProduct: FavoriteProduct)=> favoriteProduct.product)
    @JoinColumn({name: 'id', referencedColumnName: 'productId'})
    favoriteProducts?: FavoriteProduct[];
}
