import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartRepositoryInterface, ICartRepository } from './interfaces/cart-repository.interface';
import { ICart } from './interfaces/cart.interface';
import { Messages } from 'src/core/constants/messages';
import { Status_Code } from 'src/core/constants/status-codes';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './entity/cart.entity';
import { ResponseSingleMsg } from 'src/core/interfaces/response-msg.interface';
import { CartItemRepositoryInterface, ICartItemRepository } from './interfaces/cart-item-repository.interface';
import { FindOneOptions } from 'typeorm';
import { IProductRepository, ProductRepositoryInterface } from '../product/interfaces/product-repository.interface';
import { CartItem } from './entity/cart-item.entity';
import { ICartItem } from './interfaces/cart-item.interface';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryInterface } from '../user/interface/user-repository.interface';

@Injectable()
export class CartService {
    constructor(
        @Inject(`${CartRepositoryInterface}`)
        private readonly cartRepository: ICartRepository,

        @Inject(`${CartItemRepositoryInterface}`)
        private readonly cartItemRepository: ICartItemRepository,

        @Inject(`${ProductRepositoryInterface}`)
        private readonly productRepository: IProductRepository,

        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    // Get single cart
    /**
     * Retrieves a single cart from the database by its ID, including its associated cart items and products.
     * @param {string} id - The ID of the cart to retrieve.
     * @throws {NotFoundException} If a cart with the given ID does not exist in the database.
     * @returns {Promise<ICart>} A promise that resolves to the retrieved cart object.
     */
    async getSingleCart(id: string): Promise<ICart> {

        // const cart = await this.cartRepository.findOne({
        //     where: { id: id },
        //     relations: ['cartItems','cartItems.product'],
        // });

        const cart = await this.cartRepository.getCartWithCartItems(id);
        
        if (!cart) {
            throw new NotFoundException({
                message: Messages.ERROR.CART_NOT_FOUND,
                status_code: Status_Code.ERROR_CODE.NOT_FOUND,
            });
        }
    
        return cart

    }



    //Create a cart
    /**
     * Creates a new cart with the provided cart items and associates it with the authenticated user.
     * @param {CreateCartDto} createCartDto - The DTO containing the cart items to add to the new cart.
     * @param {any} headers - The headers of the HTTP request containing the authorization token.
     * @throws {NotFoundException} If the authenticated user is not found or if a product referenced by a cart item is not found.
     * @throws {BadRequestException} If the cart items array is empty or not provided.
     * @returns {Promise<ICart>} The newly created cart with its associated cart items and total amount.
     */
    // async createCart(createCartDto: CreateCartDto, headers:any): Promise<ICart> {
    async createCart(createCartDto: CreateCartDto, user: any): Promise<ICart> {

        if (!user) {
            throw new NotFoundException({
                message: Messages.ERROR.USER_NOT_FOUND, 
                status_code: Status_Code.ERROR_CODE.NOT_FOUND
            });
        }

        // Check if the user is already assigned to a cart
        //const existingCart = await this.cartRepository.findOne({ where: { user: user.userId } });
        const existingCart = await this.cartRepository.findOneById(user.userId);

        if (existingCart) {
            throw new ConflictException({
            message: Messages.ERROR.USER_ALREADY_EXISTS,
            status_code: Status_Code.ERROR_CODE.ALREADY_EXISTS,
            });
        }

        console.log(user)

        if (!createCartDto.cartItems || createCartDto.cartItems.length === 0) {
            throw new BadRequestException({
                status_code: Status_Code.ERROR_CODE.BAD_REQUEST,
            });
        }

        const cart = new Cart();
        const createdCart = await this.cartRepository.create(cart);

        try{
            for (const item of createCartDto.cartItems) {
                const product = await this.productRepository.findOneById(item.productId);
    
                if (!product) {
                    throw new NotFoundException({
                        message: Messages.ERROR.PRODUCT_NOT_FOUND, 
                        status_code: Status_Code.ERROR_CODE.NOT_FOUND
                    })
                }
    
                const cartItem = new CartItem();
                cartItem.cart = cart;
                cartItem.product = product;
                cartItem.quantity = item.quantity;
                cartItem.price = product.price;
                //cartItem.price = product.price * cartItem.quantity;
                await this.cartItemRepository.create(cartItem);
    
            }
        } catch(error){
            await this.cartRepository.delete(cart.id);
            throw error;
        }

        const cartWithItems = await this.cartRepository.getCartWithCartItems(createdCart.id);

        const cartTotal = cartWithItems.cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    
        cartWithItems.totalAmount = cartTotal;
        //(await cartWithItems).user = user;
        cartWithItems.user = user.userId;
        await this.cartRepository.update(cart.id, cartWithItems);

        return cartWithItems

    }




    //Delete a cart
    /**
     * Deletes a cart by its ID.
     * @param {string} id - The ID of the cart to be deleted.
     * @returns {Promise<ResponseSingleMsg>} A Promise that resolves to an object with a success message.
     * @throws {NotFoundException} If the cart with the specified ID is not found.
     */
    async deleteCart(id: string): Promise<ResponseSingleMsg> {
        const cart = await this.cartRepository.findOneById(id);
        if (!cart) {
            throw new NotFoundException({
                message: Messages.ERROR.CART_NOT_FOUND,
                status_code: Status_Code.ERROR_CODE.NOT_FOUND,
            });
        }
        await this.cartRepository.delete(id);
        return { message: Messages.SUCCESS.CART_DELETED };
    }








    //Get sihgle cart item
    /**
     * Get a single cart item by its ID, including the associated product.
     * @param {string} cartItemId - The ID of the cart item to retrieve.
     * @returns {Promise<ICartItem>} The retrieved cart item with the associated product.
     * @throws {NotFoundException} If no cart item is found with the given ID.
     */
    async getSingleCartItem(cartItemId: string): Promise<ICartItem> {
        const cartIten = await this.cartItemRepository.findOneById(cartItemId);
        if (!cartIten) {
        throw new NotFoundException({
            message: Messages.ERROR.CART_ITEM_NOT_FOUND,
            status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        });
        }
        
        // const cartItemWithProduct = await this.cartItemRepository.findOne({
        //     where: { id: cartItemId },
        //     relations: ['product'],
        // });

        const cartItemWithProduct = this.cartItemRepository.getCartItemWithProductsAndCart(cartItemId);

        return cartItemWithProduct;
        
    }



    //create cart item
    /**
     * Creates a new cart item for a given cart
     * @param {string} cartId - The id of the cart to add the item to
     * @param {CreateCartItemDto} createCartItemDto - DTO for creating a cart item
     * @returns {Promise<ICartItem>} The newly created cart item
     * @throws {NotFoundException} If the cart or product is not found
     */
    async createCartItem(cartId: string, createCartItemDto: CreateCartItemDto): Promise<ICartItem> {
        // const cart = await this.cartRepository.findOne({
        //     where: { id: cartId },
        //     relations: ['cartItems','cartItems.product'],
        // });

        const cart = await this.cartRepository.getCartWithCartItems(cartId);

        if (!cart) {
            throw new NotFoundException({
                message: Messages.ERROR.CART_NOT_FOUND,
                status_code: Status_Code.ERROR_CODE.NOT_FOUND,
            });
        }

        const product = await this.productRepository.findOneById(createCartItemDto.productId);
        if (!product) {
            throw new NotFoundException({
            message: Messages.ERROR.PRODUCT_NOT_FOUND,
            status_code: Status_Code.ERROR_CODE.NOT_FOUND,
            });
        }

        const existingCartItem = (await cart).cartItems && (await cart).cartItems.find((cartItem) => cartItem.product.id === createCartItemDto.productId);

        if (existingCartItem) {

            const cartItemQuantity = existingCartItem.quantity += createCartItemDto.quantity;
            await this.cartItemRepository.update(existingCartItem.id, {...existingCartItem, quantity: cartItemQuantity}); 

            const cartTotal = (await cart).cartItems.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);

            await this.cartRepository.update(cartId, {
                totalAmount: cartTotal
            });

            return existingCartItem;
        }


        else {
            const cartItem = new CartItem();
            cartItem.quantity = createCartItemDto.quantity;
            cartItem.price = product.price;
            cartItem.cart= cart; 
            cartItem.product = product;
            const createdCartItem = await this.cartItemRepository.create(cartItem);

            //cart.cartItems.push(createdCartItem);
            // const updatedCart = await this.cartRepository.findOne({
            //     where: { id: cartId },
            //     relations: ['cartItems','cartItems.product'],
            // });
            const updatedCart = await this.cartRepository.getCartWithCartItems(cartId);
            
            const cartTotal = updatedCart.cartItems.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);

            await this.cartRepository.update(cartId, {
                totalAmount: cartTotal
            });

            return createdCartItem;
        }

    }



    // update a cart item
    /**
     * Updates a cart item by its id with the provided data
     * @param {string} cartItemId - The id of the cart item to update
     * @param {UpdateCartItemDto} updateCartItemDto - The data to update the cart item with
     * @returns {Promise<ICartItem>} The updated cart item
     * @throws {NotFoundException} If the cart item or its parent cart is not found
     */
    async updateCartItem (cartItemId: string, updateCartItemDto: UpdateCartItemDto): Promise<ICartItem> {
        
        // const cartItem = await this.cartItemRepository.findOne({
        //     where: { id: cartItemId },
        //     relations: ['product','cart']
        // });

        const cartItem = await this.cartItemRepository.getCartItemWithProductsAndCart(cartItemId);

        if (!cartItem) {
            throw new NotFoundException({
                message: Messages.ERROR.CART_ITEM_NOT_FOUND,
                status_code: Status_Code.ERROR_CODE.NOT_FOUND,
            });
        }

        console.log(cartItem)

        const cartItemQuantity = updateCartItemDto.quantity;

        await this.cartItemRepository.update(cartItemId, { quantity: cartItemQuantity}); 

        // const cart = await this.cartRepository.findOne({
        //     where: { id: cartItem.cart.id },
        //     relations: ['cartItems','cartItems.product'],
        // });
        const cart = await this.cartRepository.getCartWithCartItems(cartItem.cart.id);

        if (!cart) {
            throw new NotFoundException({
                message: Messages.ERROR.CART_NOT_FOUND,
                status_code: Status_Code.ERROR_CODE.NOT_FOUND,
            });
        }
        console.log(cart)

        const cartTotal = cart.cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        // await this.cartRepository.update(cart.id, {
        //     totalAmount: cartTotal
        // });

        await this.cartRepository.update(cartItem.cart.id, {totalAmount: cartTotal});

        return cartItem;

    }



    // delete a cart item
    /**
     * Deletes a cart item from the cart
     * @param {string} cartItemId - The ID of the cart item to be deleted
     * @returns {Promise<ResponseSingleMsg>} A response message indicating whether the cart item was deleted successfully
     * @throws {NotFoundException} If the specified cart item or cart is not found
     */
    async deleteCartItem(cartItemId: string): Promise<ResponseSingleMsg> {

        // const cartItem = await this.cartItemRepository.findOne({
        //     where: { id: cartItemId },
        //     relations: ['product','cart']
        // });

        const cartItem = await this.cartItemRepository.getCartItemWithProductsAndCart(cartItemId);

        if (!cartItem) {
            throw new NotFoundException({
                message: Messages.ERROR.CART_ITEM_NOT_FOUND,
                status_code: Status_Code.ERROR_CODE.NOT_FOUND,
            });
        }

        await this.cartItemRepository.delete(cartItemId);

        // const cart = await this.cartRepository.findOne({
        //     where: { id: cartItem.cart.id },
        //     relations: ['cartItems','cartItems.product'],
        // });

        const cart = await this.cartRepository.getCartWithCartItems(cartItem.cart.id);

        if (!cart) {
            throw new NotFoundException({
                message: Messages.ERROR.CART_NOT_FOUND,
                status_code: Status_Code.ERROR_CODE.NOT_FOUND,
            });
        }

        const cartTotal = cart.cartItems.reduce((total, item) => {
            if (item.id === cartItemId) {
                return total;
            } else {
                return total + (item.price * item.quantity);
            }
        }, 0);

        await this.cartRepository.update(cart.id, {
            totalAmount: cartTotal
        });

        if (cart.cartItems.length === 0) {
            await this.cartRepository.delete(cart.id);
        }

        return { message: Messages.SUCCESS.CART_ITEM_DELETED };
    }




}
