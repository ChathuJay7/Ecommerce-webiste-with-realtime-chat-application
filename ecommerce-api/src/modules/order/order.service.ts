import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './entity/order.entity';
import { IOrderRepository, OrderRepositoryInterface } from './interfaces/order-repository.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Messages } from '../../core/constants/messages';
import { Status_Code } from '../../core/constants/status-codes';
import { ResponseSingleMsg } from '../../core/interfaces/response-msg.interface';
import { IOrder } from './interfaces/order.interface';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { IOrderItems } from './interfaces/order-items.interface';
import { OrderItems } from './entity/order-item.entity';
import { IOrderItemsRepository, OrderItemsRepositoryInterface } from './interfaces/order-items-repository.interface';
import { IProductRepository, ProductRepositoryInterface } from '../product/interfaces/product-repository.interface';
import { CartRepositoryInterface, ICartRepository } from '../cart/interfaces/cart-repository.interface';
import { CartItemRepositoryInterface, ICartItemRepository } from '../cart/interfaces/cart-item-repository.interface';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/entity/cart-item.entity';
import { calculateSubTotal } from '../../core/utils/subtotal-calculation';

@Injectable()
export class OrderService {

    constructor(
        @Inject(`${OrderRepositoryInterface}`)
        private readonly orderRepository: IOrderRepository,

        @Inject(`${OrderItemsRepositoryInterface}`)
        private readonly orderItemRepository: IOrderItemsRepository,

        @Inject(`${ProductRepositoryInterface}`)
        private readonly productRepository: IProductRepository,

        @Inject(`${CartRepositoryInterface}`)
        private readonly cartRepository: ICartRepository,

        @Inject(`${CartItemRepositoryInterface}`)
        private readonly cartItemRepository: ICartItemRepository,

        private cartService: CartService
    ){}

    // Create Order Details
    /**
     * Get the Cart Details by CartId
     * Check if the CartItems are present
     * Calculate the SubTotal
     * Check if the CartAmount is equal to SubTotal
     * Create Order
     * Update the Product Quantity
     *  
     * @param createOrderDto - CartId
     * @returns {createdOrder} - Order Details
     */
    async createOrder(createOrderDto: CreateOrderDto): Promise<IOrder>{

        const cart = await this.cartRepository.getCartWithCartItems(createOrderDto.cartId);
        if (!cart) {
            throw new NotFoundException({message: Messages.ERROR.CART_NOT_FOUND, status_code: Status_Code.ERROR_CODE.NOT_FOUND});
        }
        console.log(cart);

        const cartItems = cart.cartItems;
        console.log(cartItems);

        if(!cartItems || cartItems.length === 0){
            throw new BadRequestException({message: Messages.ERROR.CART_ITEM_NOT_FOUND, status_code: Status_Code.ERROR_CODE.NOT_FOUND})
        }

        const order: Order = new Order();
        order.cart = cart;
        order.subTotal = await calculateSubTotal(cartItems);

        console.log('Total Price :',order.subTotal);

        for (const cartItem of cartItems){
            if(cartItem.product.quantity < cartItem.quantity){
                throw new BadRequestException({message: Messages.ERROR.INSUFFICIENT_QUANTITY, status_code: Status_Code.ERROR_CODE.INSUFFICIENT_QUANTITY});
            }
            const product = cartItem.product;
            product.quantity = product.quantity - cartItem.quantity;
            await this.productRepository.updates(product);
        }

        if(!(cart.totalAmount == order.subTotal)){
            console.log("Not Equal");
            throw new BadRequestException('Cart Amount is not equal to SubTotal');
           
        }

        // to check whether the order already exists related to cartId
        const exsistingOrder = await this.orderRepository.findOne(createOrderDto.cartId);
        if (exsistingOrder){
            throw new BadRequestException({message: Messages.ERROR.ORDER_ALREADY_EXISTS, status_code: Status_Code.ERROR_CODE.ORDER_ALREADY_EXISTS});
        }

        const createdOrder = await this.orderRepository.create(order);

        return createdOrder;
    }


    // Get all Orders with Cart , CartItems and Products
    /**
     * 
     * @returns {orders} - All Orders with Cart , CartItems and Products
     */
    async getAllOrders(): Promise<IOrder[]> {
        return await this.orderRepository.findAll({ relations: ['cart','cart.cartItems','cart.cartItems.product'] });
    }

    // Get only the OrderDetails related to the OrderId
    /**
     * 
     * @param {string} orderId - UUID of the realated Order
     * @throws {NotFoundException} - If the Order related to OrderId is not found
     * @returns {Promise<IOrder>} - A Promise of Order Details related to the OrderId
     */
    async getSingleOrder(orderId: string): Promise<IOrder>{
        console.log(orderId);
        const order = await this.orderRepository.getOrderWithProducts(orderId);
 
        console.log(order);
        if (!order) {
            throw new NotFoundException({message: Messages.ERROR.ORDER_NOT_FOUND, status_code: Status_Code.ERROR_CODE.ORDER_NOT_FOUND});
        }
        return order;
    }
    


    // Delete Order Details related to the OrderId
    async deleteOrder(orderId: string): Promise<ResponseSingleMsg> {
        const order = await this.orderRepository.findOneById(orderId);
        if(!order){
            throw new NotFoundException({message: Messages.ERROR.ORDER_NOT_FOUND, status_code: Status_Code.ERROR_CODE.ORDER_NOT_FOUND});
        }
        await this.orderRepository.delete(orderId);
        return {message: Messages.SUCCESS.ORDER_DELETED};
    }
   
}
