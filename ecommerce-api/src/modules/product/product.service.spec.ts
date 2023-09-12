import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { IProduct } from './interfaces/product.interface';
import { ProductRepositoryInterface } from './interfaces/product-repository.interface';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-produuct.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Messages } from 'src/core/constants/messages';
import { Status_Code } from 'src/core/constants/status-codes';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductService', () => {
  let service: ProductService;

  const products: IProduct[] = [
    {
      id: "29a8a3b5-24dd-4d10-8638-2d5314b527c9",
      name: 'Product 1',
      color: 'Red',
      price: 100,
      image: 'product1.jpg',
      discount: 0,
      description: 'Product 1 description',
      quantity: 10,
    },
    {
      id: "6d5aefba-43a6-4aa9-88be-dab64d94cdc7",
      name: 'Product 2',
      color: 'Blue',
      price: 200,
      image: 'product2.jpg',
      discount: 10,
      description: 'Product 2 description',
      quantity: 5,
    },
  ];

  const product: IProduct = {
      id: "29a8a3b5-24dd-4d10-8638-2d5314b527c9",
      name: 'Product 1',
      color: 'Red',
      price: 100,
      image: 'product1.jpg',
      discount: 0,
      description: 'Product 1 description',
      quantity: 10,
  };


  let productDto = new ProductDto();
  productDto.id = "29a8a3b5-24dd-4d10-8638-2d5314b527c9"
  productDto.name = 'Samesung galaxy Note20'
  productDto.color = 'Silver'
  productDto.price = 355000
  productDto.image = 'https://fdn2.mobgsm.com/vv/bigpic/samsung-galaxy-note20-5g-r.jpg'
  productDto.discount = 10
  productDto.description = 'Manufactured in 2021'
  productDto.quantity = 20


  let createProductDto = new CreateProductDto();
  createProductDto.name = 'Samesung galaxy Note20'
  createProductDto.color = 'Silver'
  createProductDto.price = 355000
  createProductDto.image = 'https://fdn2.mobgsm.com/vv/bigpic/samsung-galaxy-note20-5g-r.jpg'
  createProductDto.discount = 10
  createProductDto.description = 'Manufactured in 2021'
  createProductDto.quantity = 20

  let updateProductDto = new UpdateProductDto();
  updateProductDto.name = 'Samesung galaxy Note20'
  updateProductDto.color = 'Silver'
  updateProductDto.price = 355000
  updateProductDto.image = 'https://fdn2.mobgsm.com/vv/bigpic/samsung-galaxy-note20-5g-r.jpg'
  updateProductDto.discount = 10
  updateProductDto.description = 'Manufactured in 2021'
  updateProductDto.quantity = 20


  const productMockRepository = {
    findAll: jest.fn().mockReturnValue(products),
    findOneById: jest.fn().mockReturnValue(product),
    findProductByName: jest.fn().mockReturnValue(product),
    create: jest.fn().mockReturnValue(product),
    update: jest.fn().mockReturnValue(product),
    delete: jest.fn().mockReturnValue({ message: 'Product deleted successfully' }),

    // findAll: jest.fn(() => {
    //   return products;
    // }),

    // findOneById: jest.fn((_id) => {
    //   return product;
    // }),

    // findProductByName: jest.fn(() => {
    //   return product;
    // }),

    // create: jest.fn((createProductDto) => {
    //   return product;
    // }),

    // update: jest.fn((updateProductDto) => {
    //   return product;
    // }),

    // delete: jest.fn((_id) => {
    //   return { message: 'Product deleted successfully' };
    // })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: `${ProductRepositoryInterface}`,
          useValue: productMockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProducts', () => {

    it('getAllProducts method should be defined', () => {
      expect(service.getAllProducts).toBeDefined();
    })

    it('should call the getAllProducts method of the ProductService & return the IProduct[]', async () => {
      const result = await service.getAllProducts();
      expect(result).toEqual(products);
      expect(productMockRepository.findAll).toHaveBeenCalledWith();
    });

    // susing spyOn method
    it('should return an array of products', async () => {
      
      jest.spyOn(productMockRepository, 'findAll').mockReturnValue(products);
      expect(await service.getAllProducts()).toBe(products);

    });

  })



  describe('getSingleProduct', () => {

    const id = "29a8a3b5-24dd-4d10-8638-2d5314b527c9";

    it('getSingleProduct method should be defined', () => {
      expect(service.getSingleProduct).toBeDefined();
    });

    it('should return a single product by ID', async () => {
      const result = await service.getSingleProduct(id);
      expect(result).toEqual(product);
      expect(productMockRepository.findOneById).toHaveBeenCalledWith(id);
    });

    // Using spyOn method
    it('should return a single product by ID', async () => {    
      jest.spyOn(productMockRepository, 'findOneById').mockReturnValue(product); 
      expect(await service.getSingleProduct(id)).toBe(product);
    });

    it('should throw a NotFoundException if product not found', async () => {
      jest.spyOn(productMockRepository, 'findOneById').mockReturnValue(null);
      await expect(service.getSingleProduct(id)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.PRODUCT_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });

  })

  describe('createProduct', () => {

    it('createProduct method should be defined', () => {
      expect(service.createProduct).toBeDefined();
    });

    it('should create a product successfully', async () => {
      jest.spyOn(productMockRepository, 'findProductByName').mockReturnValue(null);
      const result = await service.createProduct(createProductDto);
      expect(result).toEqual(product);
    });

    // Using spyOn method
    it('should create a product successfully', async () => {
      jest.spyOn(productMockRepository, 'findProductByName').mockReturnValue(null);
      jest.spyOn(productMockRepository, 'create').mockReturnValue(product);
      expect(await service.createProduct(createProductDto)).toEqual(product);
    });

    it('should throw ConflictException when product already exists', async () => {
      jest.spyOn(productMockRepository, 'findProductByName').mockReturnValue(product);
      await expect(service.createProduct(createProductDto)).rejects.toThrow(
        new ConflictException({
          message: Messages.ERROR.PRODUCT_ALREADY_EXISTS,
          status_code: Status_Code.ERROR_CODE.ALREADY_EXISTS,
        }),
      );
    });

  })

  describe('updateProduct', () => {

    const id = "29a8a3b5-24dd-4d10-8638-2d5314b527c9";

    it('updateProduct method should be defined', () => {
      expect(service.updateProduct).toBeDefined();
    })

    it('should update product successfully', async () => {
      jest.spyOn(productMockRepository, 'findOneById').mockReturnValue(product);
      const result = await service.updateProduct(id,updateProductDto);
      expect(result).toEqual(product);
      expect(productMockRepository.update).toHaveBeenCalledWith(id,updateProductDto);
    });

    // Using spyOn method
    it('should update product successfully', async () => {
      jest.spyOn(productMockRepository, 'findOneById').mockReturnValue(product);
      jest.spyOn(productMockRepository, 'update').mockReturnValue(product);
      expect(await service.updateProduct(id, updateProductDto)).toEqual(product);
    });

    it('should throw a NotFoundException if product not found', async () => {
      jest.spyOn(productMockRepository, 'findOneById').mockReturnValue(null);
      await expect(service.updateProduct(id, updateProductDto)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.PRODUCT_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });

  })



  describe('deleteProduct', () => {

    const id = "29a8a3b5-24dd-4d10-8638-2d5314b527c9";

    it('deleteProduct method should be defined', () => {
      expect(service.deleteProduct).toBeDefined();
    })

    it('should call the deleteProduct method of the ProductService & return the message', async () => {
      jest.spyOn(productMockRepository, 'findOneById').mockReturnValue(product);
      const result = await service.deleteProduct(id);
      expect(result).toEqual({ message: 'Product deleted successfully' });
      expect(productMockRepository.delete).toHaveBeenCalledWith(id);
    });

    // Using spyOn method
    it('should call the deleteProduct method of the ProductService & return the message', async () => {
      jest.spyOn(productMockRepository, 'findOneById').mockReturnValue(product);
      jest.spyOn(productMockRepository, 'delete').mockReturnValue({ message: 'Product deleted successfully' });
      expect(await service.deleteProduct(id)).toEqual({ message: 'Product deleted successfully' });
    });

    it('should throw a NotFoundException if product not found', async () => {
      jest.spyOn(productMockRepository, 'findOneById').mockReturnValue(null);
      await expect(service.getSingleProduct(id)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.PRODUCT_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });

  })

});
