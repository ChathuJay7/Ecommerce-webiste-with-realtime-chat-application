import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { IOrder } from './interfaces/order.interface';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ResponseSingleMsg } from '../../core/interfaces/response-msg.interface';
import { ApiBadRequestResponse, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { OrderDto } from './dto/order.dto';
import { IOrderItems } from './interfaces/order-items.interface';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
    constructor (private orderService: OrderService) {}

    // Get all Orders with OrderItems
    @Get()
    @ApiOkResponse({
        status: 200,
        description: 'Retrieve all orders successfully',
        type: OrderDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Order not found',
    })
    @ApiBadRequestResponse({
        status: 400,
        description: 'Orders cannot retrieve. Please try again',
    })
    @ApiInternalServerErrorResponse({
        status: 500,
        description: 'Internal server error',
    })
    getAllOrders() {
        return this.orderService.getAllOrders();
    }

    // Get only the OrderDetails related to the OrderId
    @Get(':id')
    @ApiOkResponse({
        status: 200,
        description: 'Retrieve order successfully',
        type: OrderDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Order not found',
    })
    @ApiBadRequestResponse({
        status: 400,
        description: 'Insufficient quantity on the product',
    })
    @ApiInternalServerErrorResponse({
        status: 500,
        description: 'Internal server error',
    })
    getSingleOrder(@Param('id', ParseUUIDPipe) id: string){
        return this.orderService.getSingleOrder(id);
    }


    // Create Order
    /**
     * 
     */
    @Post()
    createOrder(@Body() createOrderDto: CreateOrderDto): Promise<IOrder>{
        console.log(createOrderDto);
        return this.orderService.createOrder(createOrderDto);
    }



    // Delete Order
    @Delete(':id')
    @ApiOkResponse({
        status: 200,
        description: 'Delete order successfully',
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Order not found',
    })
    @ApiBadRequestResponse({
        status: 400,
        description: 'Order cannot delete. Please try again',
    })
    @ApiInternalServerErrorResponse({
        status: 500,
        description: 'Internal server error',
    })
    deleteOrder(@Param('id', ParseUUIDPipe) id: string,): Promise<ResponseSingleMsg>{
        return this.orderService.deleteOrder(id);
    }



}
