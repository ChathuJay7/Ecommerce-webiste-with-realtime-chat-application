import { Body, Controller, Delete, Get, Headers, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { ICart } from './interfaces/cart.interface';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ICartItem } from './interfaces/cart-item.interface';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartDto } from './dto/cart.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('Cart')
@Controller('cart')
export class CartController {

    constructor(private cartService: CartService) {}

    /**
     * Get a single cart by ID
     * Authorized to - CUSTOMER
     * Retrieves a cart with the specified ID from the cart service.
     * @param id The ID of the cart to retrieve.
     * @returns A Promise that resolves to a Cart object matching the specified ID, or null if no cart is found.
     */
    @Get(':id')
    @ApiOkResponse({
        status: 200,
        description: 'Retrieve cart successfully',
        type: CartDto,
    })
    @ApiBadRequestResponse({
        status: 400, 
        description: "cart cannot retrieve"
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Cart not found',
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    async getSingleCart(@Param('id', ParseUUIDPipe) id: string): Promise<ICart> {
        return this.cartService.getSingleCart(id);
    }


    /**
     * Create a new cart
     * Authorized to - ADMIN, CUSTOMER
     * Creates a new cart with the given data.
     * @param headers The headers object containing the authorization token.
     * @param createCartDto The DTO containing the cart data to be created.
     * @returns A Promise that resolves to the newly created cart object.
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiCreatedResponse({
        status: 201,
        description: 'Cart created successfully',
        type: CreateCartDto,
    })
    @ApiBadRequestResponse({
        status: 400, 
        description: 'Cart cannot create. Please try again',
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    // async createCart(@Headers() headers: any, @Body() createCartDto: CreateCartDto): Promise<ICart> {
    //     return this.cartService.createCart(createCartDto, headers);
    // }
    // async createCart( @Body() createCartDto: CreateCartDto, @GetUser() users: any): Promise<ICart> {
    //     return this.cartService.createCart(createCartDto, users);
    // }
    async createCart(@GetUser() user: any, @Body() createCartDto: CreateCartDto): Promise<ICart> {
        return this.cartService.createCart(createCartDto, user);
    }


    /**
     * Delete cart
     * Authorized to - ADMIN, CUSTOMER
     * Deletes a cart with the given ID.
    @param id The ID of the cart to be deleted.
    @returns A Promise that resolves to the deleted cart object.
    */
    @Delete(':id')
    @ApiOkResponse({
        status: 200,
        description: 'cart deleted successfully',
    })
    @ApiBadRequestResponse({
        status: 400, 
        description: 'cart cannot delete. Please try again',
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'cart not found',
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    async deleteCart(@Param('id', ParseUUIDPipe) id: string) {
        return this.cartService.deleteCart(id);
    }






    /**
     * Get a single cart-item by ID
     * Authorized to - ADMIN, CUSTOMER
     * Retrieves a cart-item with the specified ID from the cart service.
     * @param id The ID of the cart-item to retrieve.
     * @returns A Promise that resolves to a CartItem object matching the specified ID, or null if no cart-item is found.
     */
    @Get('cart-items/:cartItemId')
    @ApiOkResponse({
        status: 200,
        description: 'Retrieve cart-item successfully',
        type: CartItemDto,
    })
    @ApiBadRequestResponse({
        status: 400, 
        description: "cart-item cannot retrieve"
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Cart-item not found',
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    async getSingleCartItem(@Param('cartItemId', ParseUUIDPipe) id: string): Promise<ICartItem> {
        return this.cartService.getSingleCartItem(id);
    }


    /**
     * Create a new cart-item
     * Authorized to - ADMIN, CUSTOMER
     * Creates a new cart-item with the given data.
     * @param createCartItemDto The DTO containing the cart-item data to be created.
     * @returns A Promise that resolves to the newly created cart-item object.
     */
    @Post(':cartId/cart-items')
    @ApiCreatedResponse({
        status: 201,
        description: 'Cart-item created successfully',
        type: CreateCartItemDto,
    })
    @ApiBadRequestResponse({
        status: 400, 
        description: 'Cart-item cannot create. Please try again',
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    async createCartItem(@Param('cartId') cartId: string, @Body() createCartItemDto: CreateCartItemDto): Promise<ICartItem> {
        return this.cartService.createCartItem(cartId, createCartItemDto);
    }


    /**
     * Update cart item details
     * Authorized to - ADMIN, CUSTOMER
     * Update the details of an existing cart item.
     * @param cartItemId The id of the cart item to be updated.
     * @param updateCartItemDto An object containing the updated details of the cart item.
     * @returns A Promise that resolves to the updated Cart Item object.
     */
    @Put('cart-items/:cartItemId')
    @ApiOkResponse({
        status: 200,
        description: 'Cart-item updated Successfully',
        type: UpdateCartItemDto,
    })
    @ApiBadRequestResponse({
        status: 400, 
        description: 'Cart-item cannot update. Please try again',
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Cart-item not found',
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    updateCartItem(@Param('cartItemId', ParseUUIDPipe) cartItemId: string, @Body() updateCartItemDto: UpdateCartItemDto):Promise<ICartItem>{
        return this.cartService.updateCartItem(cartItemId, updateCartItemDto);
    }


    /**
     * Delete cart-item
     * Authorized to - ADMIN, CUSTOMER
     * Deletes a cart-item with the given ID.
     * @param {string} cartItemId - The ID of the cart item to delete.
     * @returns {Promise<void>} A Promise that resolves when the cart item is successfully deleted.
     */
    @Delete('cart-items/:cartItemId')
    @ApiOkResponse({
        status: 200,
        description: 'Cart-item deleted successfully',
    })
    @ApiBadRequestResponse({
        status: 400, 
        description: 'Cart-item cannot delete. Please try again',
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Cart-item not found',
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    deleteCartItem(@Param('cartItemId', ParseUUIDPipe) cartItemId: string) {
        return this.cartService.deleteCartItem(cartItemId);
    }


}
