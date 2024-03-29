import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProduct } from './entities/cart-product.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CartDto } from '../cart/dto/cart.dto';
import { Cart } from '../cart/entities/cart.entity';
import { ProductService } from '../product/product.service';
import { UpdateProductDto } from '../product/dto/update.product.dto';

@Injectable()
export class CartProductService {
    constructor(
        @InjectRepository(CartProduct)
        private readonly cartProductRepository: Repository<CartProduct>,
        private readonly productService: ProductService,
    ){}

    /**
     * Asynchronously verifies the cart product.
     *
     * @param {number} cartId - The ID of the cart
     * @param {number} productId - The ID of the product
     * @return {Promise<CartProduct>} The cart product
     */
    async verifyCartProduct(cartId: number, productId: number): Promise<CartProduct> {
        const product = await this.cartProductRepository.findOne({where: {cartId, productId}});

        if(!product){
            throw new NotFoundException('Cart product not found');
        }

        return product;
    }

    /**
     * Create a new cart product.
     *
     * @param {CartDto} cartDto - the cart data transfer object
     * @param {number} cartId - the ID of the cart
     * @return {Promise<CartProduct>} the saved cart product
     */
    async create(cartDto: CartDto, cartId: number): Promise<CartProduct> {
        return await this.cartProductRepository.save({...cartDto, cartId});
    }
    
    /**
     * Insert a cart product into the database.
     *
     * @param {Cart} cart - the cart object
     * @param {CartDto} cartDto - the cart DTO object
     * @return {Promise<CartProduct>} the inserted cart product
     */
    async insert(cart: Cart, cartDto: CartDto): Promise<CartProduct> {
        await this.productService.findById(cartDto.productId);
        
        const cartProduct = await this.verifyCartProduct(cart.id, cartDto.productId).catch(() => undefined);

        if(cartProduct){
            return await this.cartProductRepository.save({...cartProduct, amount: cartProduct.amount + cartDto.amount}); 
        }

        return this.verifyCartProduct(cart.id, cartDto.productId).catch( async () => {
            return this.create(cartDto, cart.id)
        })
    }

    /**
     *  Updates the cart with the specified ID using the provided cart data transfer object.
     *
     * @param {number} cartId - The ID of the cart to update
     * @param {CartDto} cartDto - The data transfer object containing the updated cart information
     * @return {Promise<UpdateResult>} A promise that resolves to the update result
     */
    async update(cartId: number, cartDto: CartDto): Promise<UpdateResult>{
        const product = await this.verifyCartProduct(cartId, cartDto.productId).catch(() => undefined);
        if(!product){
            throw new NotFoundException('Cart product not found');
        }
        return await this.cartProductRepository.update(product.id, cartDto);
    }

    /**
     * Asynchronously deletes a cart item.
     *
     * @param {number} cartId - The ID of the cart
     * @param {CartDto} cartDto - The data transfer object for the cart
     * @return {Promise<DeleteResult>} A promise that resolves to the delete result
     */
    async delete(cartId : number, cartDto: CartDto): Promise<DeleteResult> {
        const product = await this.verifyCartProduct(cartId, cartDto.productId).catch(() => undefined);
        if(!product){
            throw new NotFoundException('Cart product not found');
        }
        return await this.cartProductRepository.delete(product.id);
    }
}
