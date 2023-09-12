import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { CartRepositoryInterface } from './interfaces/cart-repository.interface';
import { CartItemRepositoryInterface } from './interfaces/cart-item-repository.interface';
import { ProductRepositoryInterface } from '../product/interfaces/product-repository.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

describe('CartService', () => {
  let service: CartService;

  const cartMockRepository = {

  }

  const cartItemMockRepository = {

  }

  const productMockRepository = {

  }
  
  const jwtMockService = {

  }

  const userMockService = {
    
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: `${CartRepositoryInterface}`,
          useValue: cartMockRepository,
        },
        {
          provide: `${CartItemRepositoryInterface}`,
          useValue: cartItemMockRepository,
        },
        {
          provide: `${ProductRepositoryInterface}`,
          useValue: productMockRepository,
        },
        {
          provide: JwtService,
          useValue: jwtMockService
        },
        {
          provide: UserService,
          useValue: userMockService
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
