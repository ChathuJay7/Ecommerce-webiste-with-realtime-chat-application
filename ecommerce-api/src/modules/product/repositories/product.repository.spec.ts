import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from './product.repository';
import { IProduct } from '../interfaces/product.interface';
import { ProductDto } from '../dto/product.dto';
import { CreateProductDto } from '../dto/create-produuct.dto';
import { UpdateProductDto } from '../dto/update-product.dto';


describe('CategoryRepository', () => {
    let repository: ProductRepository;

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


    let updateProductDto = new UpdateProductDto();
    updateProductDto.name = 'Samesung galaxy Note20'
    updateProductDto.color = 'Silver'
    updateProductDto.price = 355000
    updateProductDto.image = 'https://fdn2.mobgsm.com/vv/bigpic/samsung-galaxy-note20-5g-r.jpg'
    updateProductDto.discount = 10
    updateProductDto.description = 'Manufactured in 2021'
    updateProductDto.quantity = 20


    const productMockRepository = {

        findOneById: jest.fn((_id) => {
            return product;
        }),

        findProductByName: jest.fn(() => {
            return product;
        }),

        update: jest.fn((_id, updateProductDto) => {
            return product;
        }),

        assign: jest.fn(() => {
            return product;
        }),

        save: jest.fn(() => {
            return product;
        }),

    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            {
            provide: ProductRepository,
            useValue: productMockRepository
            },
        ],
        }).compile();

        repository = module.get<ProductRepository>(ProductRepository);
    });



    it('should be defined ProductRepository', () => {
        expect(repository).toBeDefined();
    });

    describe('findProductByName', () => {

        const productName = "Samesung galaxy Note20";

        it('should be defined findProductByName', () => {
            expect(repository.findProductByName).toBeDefined();
        });

        it('should call the findProductByName method of the ProductRepository & return the Product match with name', async () => {
            const result = await repository.findProductByName(productName);
            expect(result).toEqual(product);
            expect(productMockRepository.findProductByName).toHaveBeenCalledWith(productName);
        });

        //Using spyOn method
        it('should return a single product by Name', async () => {    
            jest.spyOn(productMockRepository, 'findProductByName').mockReturnValue(product); 
            expect(await repository.findProductByName(productName)).toBe(product);
        });

    });




    
    describe('update', () => {

        const id = "29a8a3b5-24dd-4d10-8638-2d5314b527c9";

        it('should be defined update', () => {
            expect(repository.update).toBeDefined();
        });

        it('should call the update method of the ProductRepository & return the updated Product match with ID', async () => {
            jest.spyOn(productMockRepository, 'findOneById').mockReturnValue(product);
            const result = await repository.update(id, updateProductDto);
            expect(result).toEqual(product);
            expect(productMockRepository.update).toHaveBeenCalledWith(id, updateProductDto);
        });

        // Using spyOn method
        it('should update product successfully', async () => {
            jest.spyOn(productMockRepository, 'findOneById').mockReturnValue(product);
            jest.spyOn(productMockRepository, 'update').mockReturnValue(product);
            expect(await repository.update(id, updateProductDto)).toEqual(product);
        });

    });

});