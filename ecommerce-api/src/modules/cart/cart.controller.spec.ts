import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ICart } from './interfaces/cart.interface';
import { CreateCartDto } from './dto/create-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { ICartItem } from './interfaces/cart-item.interface';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

describe('CartController', () => {
  let controller: CartController;

  const headers = { authorization: 'Bearer token' };

  const cart: ICart = {
    "id": "1",
    "createdAt": new Date(),
    "totalAmount": 325000
  }

  const cartItem: ICartItem = {
    "id": "1f3d165a-3f2e-4a20-b5a8-658ee27edb11",
    "quantity": 3,
    "price": 355000,
  }
  
  let createCartDto = new CreateCartDto();
  createCartDto = {
    "cartItems": [
      {
        "productId": "28dc4217-642f-4d6c-8d94-6ad50c005ef9",
        "quantity": 2
      },
      {
        "productId": "3efe3a4e-e401-4329-8adc-67bdff35ab7f",
        "quantity": 3
      }
    ]
  }

  let createCartItemDto = new CreateCartItemDto();
  createCartItemDto = {
    "quantity": 1,
    "productId": "3efe3a4e-e401-4329-8adc-67bdff35ab7f"
  }

  let updateCartItemDto = new UpdateCartItemDto();
  updateCartItemDto = {
    "quantity": 1,
  }

  const cartMockService = {
    getSingleCart: jest.fn().mockReturnValue(cart),
    createCart: jest.fn().mockReturnValue(cart),
    deleteCart: jest.fn().mockReturnValue({ message: 'Cart deleted successfully' }),

    getSingleCartItem: jest.fn().mockReturnValue(cartItem),
    createCartItem: jest.fn().mockReturnValue(cartItem),
    updateCartItem: jest.fn().mockReturnValue(cartItem),
    deleteCartItem: jest.fn().mockReturnValue({ message: 'Cart-item deleted successfully' }),
  }

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: cartMockService,
        },
      ]
    })
    .overrideGuard(JwtAuthGuard)
    .useValue(mockJwtAuthGuard)
    .compile();

    controller = module.get<CartController>(CartController);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  // get single cart
  describe('getSingleCart', () => {

    it('getSingleCart method should be defined', () => {
      expect(controller.getSingleCart).toBeDefined();
    })

    it('should return a single cart by ID', async () => {
      jest.spyOn(cartMockService, 'getSingleCart').mockReturnValue(cart); 
      expect(await controller.getSingleCart(cart.id)).toBe(cart);
    });

  })



  // create cart
  describe('createCart', () => {
    
    it('createProduct method should be defined', () => {
      expect(controller.createCart).toBeDefined();
    })

    it('should create a cart successfully', async () => {
      jest.spyOn(cartMockService, 'createCart').mockReturnValue(cart);
      expect(await controller.createCart(headers, createCartDto)).toEqual(cart);
    });

  })


  // delete cart
  describe('deleteCart', () => {

    it('deleteCart method should be defined', () => {
      expect(controller.deleteCart).toBeDefined();
    })

    it('should delete a cart and return the message', async () => {
      jest.spyOn(cartMockService, 'deleteCart').mockReturnValue({ message: 'Cart deleted successfully' });
      expect(await controller.deleteCart(cartItem.id)).toEqual({ message: 'Cart deleted successfully' });
    });

  })




  // get single cart-item
  describe('getSingleCart', () => {

    it('getSingleCartItem method should be defined', () => {
      expect(controller.getSingleCartItem).toBeDefined();
    })

    it('should return a single cart-item by ID', async () => {
      jest.spyOn(cartMockService, 'getSingleCartItem').mockReturnValue(cartItem); 
      expect(await controller.getSingleCartItem(cartItem.id)).toBe(cartItem);
    });

  })


  // create cart-item
  describe('createCartItem', () => {

    it('createCartItem method should be defined', () => {
      expect(controller.createCartItem).toBeDefined();
    })

    it('should create a cart-item successfully', async () => {
      jest.spyOn(cartMockService, 'createCartItem').mockReturnValue(cartItem);
      expect(await controller.createCartItem(cart.id, createCartItemDto)).toEqual(cartItem);
    });

  })


  // update cart-item
  describe('updateCartItem', () => {

    it('update CartItem method should be defined', () => {
      expect(controller.updateCartItem).toBeDefined();
    })

    it('should update cart-item successfully', async () => {
      jest.spyOn(cartMockService, 'updateCartItem').mockReturnValue(cartItem);
      expect(await controller.updateCartItem(cartItem.id, updateCartItemDto)).toEqual(cartItem);
    });

  })


  // delete cart-item
  describe('deleteCartItem', () => {

    it('deleteCartItem method should be defined', () => {
      expect(controller.deleteCartItem).toBeDefined();
    })

    it('should delete a cart-item and return the message', async () => {
      jest.spyOn(cartMockService, 'deleteCartItem').mockReturnValue({ message: 'Cart-item deleted successfully' });
      expect(await controller.deleteCartItem(cartItem.id)).toEqual({ message: 'Cart-item deleted successfully' });
    });

  })

});
