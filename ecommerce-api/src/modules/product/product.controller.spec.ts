import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dto/create-produuct.dto';
import { ProductDto } from './dto/product.dto';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { IProduct } from './interfaces/product.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MultipleRoleGuard } from '../auth/guards/multiple-role.guard';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

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



  const productMockService = {
    getAllProducts:  jest.fn().mockReturnValue(products),
    getSingleProduct: jest.fn().mockReturnValue(product),
    createProduct: jest.fn().mockReturnValue(product),
    updateProduct: jest.fn().mockReturnValue(product),
    deleteProduct: jest.fn().mockReturnValue({ message: 'Product deleted successfully' }),
  }

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  const mockMultipleRoleGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: productMockService,
        },
        {
          provide: JwtAuthGuard,
          useValue: mockJwtAuthGuard,
        },
        {
          provide: MultipleRoleGuard,
          useValue: mockMultipleRoleGuard,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(MultipleRoleGuard)
      .useValue(mockMultipleRoleGuard)
      .compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });





  describe('getAllProducts', () => {

    it('getAllProducts method should be defined', () => {
      expect(controller.getAllProducts).toBeDefined();
    })

    it('should call productService.getAllProducts with the correct arguments', () => {
      controller.getAllProducts();
      expect(productMockService.getAllProducts).toHaveBeenCalledWith();
    });

    it('should return an array of products', async () => {

      const result = await controller.getAllProducts();
      expect(result).toEqual(products);
    });

    // Using spyOn method
    it('should return an array of products', async () => {
      
      jest.spyOn(productMockService, 'getAllProducts').mockReturnValue(products);
      expect(await controller.getAllProducts()).toBe(products);

    });

  })





  describe('getSingleProduct', () => {

    const id = "29a8a3b5-24dd-4d10-8638-2d5314b527c9";

    it('getSingleProduct method should be defined', () => {
      expect(controller.getSingleProduct).toBeDefined();
    })

    it('should call productService.getSingleProduct with the correct arguments', () => {
      controller.getSingleProduct(id);
      expect(productMockService.getSingleProduct).toHaveBeenCalledWith(id);
    });

    it('should call the getSingleProduct method of the ProductService with product ID', () => {
      const result = controller.getSingleProduct(id);
      expect(result).toEqual(product);
      expect(productMockService.getSingleProduct).toHaveBeenCalledWith(id);
    });


    // Using spyOn method
    it('should return a single product by ID', async () => {
      
      jest.spyOn(productMockService, 'getSingleProduct').mockReturnValue(product); 
      expect(await controller.getSingleProduct(product.id)).toBe(product);

    });

  })





  describe('createProduct', () => {
    
    it('createProduct method should be defined', () => {
      expect(controller.createProduct).toBeDefined();
    })

    it('should call productService.createProduct with the correct arguments', () => {
      controller.createProduct(createProductDto);
      expect(productMockService.createProduct).toHaveBeenCalledWith(createProductDto);
    });

    it('should call the createProduct method of the ProductService with the correct DTO', () => {
      const result = controller.createProduct(createProductDto);
      expect(result).toEqual(product);
      expect(productMockService.createProduct).toHaveBeenCalledWith(
        createProductDto
      );
    });


    // Using spyOn method
    it('should create a product successfully', async () => {
    
      jest.spyOn(productMockService, 'createProduct').mockReturnValue(product);
      expect(await controller.createProduct(createProductDto)).toEqual(product);

    });
    

  })





  describe('updateProduct', () => {

    const id = "29a8a3b5-24dd-4d10-8638-2d5314b527c9";

    it('updateProduct method should be defined', () => {
      expect(controller.updateProduct).toBeDefined();
    })

    it('should call productService.updateProduct with the correct arguments', () => {
      
      controller.updateProduct(id, updateProductDto);
      expect(productMockService.updateProduct).toHaveBeenCalledWith(id,updateProductDto);
    });

    it('should call the updateProduct method of the ProductService with the correct correct ID & DTO', () => {
      const result = controller.updateProduct(id ,updateProductDto);
      expect(result).toEqual(product);
      expect(productMockService.updateProduct).toHaveBeenCalledWith(
        id,
        updateProductDto
      );
    });
    
    // Using spyOn method
    it('should update a product and return the updated product', async () => {

      jest.spyOn(productMockService, 'updateProduct').mockReturnValue(product);
      expect(await controller.updateProduct(id, updateProductDto)).toBe(product);

    });

  })




  describe('deleteProduct', () => {

    const id = "29a8a3b5-24dd-4d10-8638-2d5314b527c9";

    it('deleteProduct method should be defined', () => {
      expect(controller.deleteProduct).toBeDefined();
    })

    it('should call productService.deleteProduct with the correct arguments', () => {
      
      controller.deleteProduct(id);
      expect(productMockService.deleteProduct).toHaveBeenCalledWith(id);
    });

    it('should return the result of productService.deleteProduct', async () => {
      
      const result = await controller.deleteProduct(id);
      expect(result).toEqual({ message: 'Product deleted successfully' });
    });

    // Using spyOn method
    it('should update a product and return the updated product', async () => {

      jest.spyOn(productMockService, 'deleteProduct').mockReturnValue({ message: 'Product deleted successfully' });
      expect(await controller.deleteProduct(id)).toEqual({ message: 'Product deleted successfully' });

    });

  })


});
