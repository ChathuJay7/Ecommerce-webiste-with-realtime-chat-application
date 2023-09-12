import { ApiProperty } from "@nestjs/swagger";
import { IOrder } from "../interfaces/order.interface";
import { OrderItems } from "../entity/order-item.entity";
import { CreateOrderItemDto } from "./create-order-item.dto";

export class OrderDto implements IOrder{

    @ApiProperty(
        {description: 'This is order id',
        example: '12a50bc0-83df-4bab-9ec5-d9f14aa6b393',
    }
    )
    id: string;

    @ApiProperty({
        description: 'This is order items',
        example: '',
    })
    subTotal: number;

    @ApiProperty({
        description: 'This is order status',
        example: 'Pending',
    }
    )
    status: string;

    @ApiProperty(
        {description: 'This is order date',
        example: '2021-08-01T00:00:00.000Z',
    }
    )
    orderDate: Date;


    @ApiProperty({
        description: 'This is order items',
        type: CreateOrderItemDto,
        isArray: true

    })
    orderItems: OrderItems[];
}