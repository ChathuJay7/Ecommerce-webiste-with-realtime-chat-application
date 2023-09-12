import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Messages } from 'src/core/constants/messages';
import { Status_Code } from 'src/core/constants/status-codes';
import { CreateProductDto } from './dto/create-produuct.dto';
import { ProductDto } from './dto/product.dto';
import {
  IProductRepository,
  ProductRepositoryInterface,
} from './interfaces/product-repository.interface';
import { IProduct } from './interfaces/product.interface';
import { ResponseSingleMsg } from 'src/core/interfaces/response-msg.interface';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entity/product.entity';
import {
  CategoryRepositoryInterface,
  ICategoryRepository,
} from '../category/interfaces/category-repository.interface';
import { ProductFilterDto } from './dto/filter-product.dto';
import { ProductPaginateDto } from './dto/paginate-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(`${ProductRepositoryInterface}`)
    private readonly productRepository: IProductRepository,
    @Inject(`${CategoryRepositoryInterface}`)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  //Get all products
  async getAllProducts(): Promise<IProduct[]> {
    return await this.productRepository.findAll({ relations: ['category', 'category.parent'] });
  }

  // //Get all products
    // async getAllProducts(): Promise<IProduct[]> {
    //     return await this.productRepository.findAll();
    // } 

    // filter
    //Get all products
    // async getAllProducts(productFilterDto?: ProductFilterDto): Promise<IProduct[]> {
    //     // const products = await this.productRepository.getProductsByNameAndColor(name, color);
    //     // return products;
    //     //return await this.productRepository.filter(productFilterDto);
    //     if (productFilterDto) {
    //         const entityName = 'product'
    //         return await this.productRepository.filter(entityName, productFilterDto);
    //     } else {
    //         return await this.productRepository.findAll();
    //     }
    // }


    // paginate
    //Get all products
    // async getAllProducts(productPaginateDto?: ProductPaginateDto): Promise<IProduct[]> {
    //   // if (productPaginateDto) {
    //   //     return (await this.productRepository.paginate(productPaginateDto));
    //   // } else {
    //   //     return await this.productRepository.findAll();
    //   //     //return await this.productRepository.paginate({});
    //   // }

    //   if (productPaginateDto.limit == undefined || productPaginateDto.page == undefined) {
    //       return await this.productRepository.findAll();
    //   } else {
    //       return (await this.productRepository.paginate(productPaginateDto));
    //   }
    // }

  //Get single product
  /**
   * Retrieves a single product by its ID.
   * @param {string} productId - The ID of the product to retrieve.
   * @returns {Promise<IProduct>} A Promise that resolves with the product object.
   * @throws {NotFoundException} If no product with the given ID is found.
   */
  async getSingleProduct(productId: string): Promise<IProduct> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['category', 'category.parent'],
    });
    //console.log(JSON.parse(product.image));
    console.log(product.image);

    if (!product) {
      throw new NotFoundException({
        message: Messages.ERROR.PRODUCT_NOT_FOUND,
        status_code: Status_Code.ERROR_CODE.NOT_FOUND,
      });
    }
    return product;
  }

  //Create new product
  /**
   * Create a new product
   * @param {CreateProductDto} createProductDto - The DTO containing the data for creating the product
   * @returns {Promise<IProduct>} - The newly created product
   * @throws {ConflictException} - If the product with the given name already exists
   */
  async createProduct(createProductDto: CreateProductDto): Promise<IProduct> {
    const existingProduct = await this.productRepository.findProductByName(
      createProductDto.name,
    );

    if (existingProduct) {
      throw new ConflictException({
        message: Messages.ERROR.PRODUCT_ALREADY_EXISTS,
        status_code: Status_Code.ERROR_CODE.ALREADY_EXISTS,
      });
    }

    const categoryId = createProductDto.categoryId;

    const category = await this.categoryRepository.findOneById(categoryId);
    if (!category) {
      throw new NotFoundException({
        message: Messages.ERROR.CATEGORY_NOT_FOUND,
        status_code: Status_Code.ERROR_CODE.NOT_FOUND,
      });
    }

      const product = new Product();
      product.name = createProductDto.name;
      product.color = createProductDto.color;
      product.price = createProductDto.price;
      product.image = createProductDto.image;
      //product.image = JSON.stringify(createProductDto.image);
      product.discount = createProductDto.discount;
      product.description = createProductDto.description;
      product.quantity = createProductDto.quantity;
      product.category = category;
      const createdProduct = await this.productRepository.create(product);
      return createdProduct;
    
  }

  //Update product
  /**
   * Updates an existing product by ID.
   * @param {string} productId - The ID of the product to update.
   * @param {UpdateProductDto} updateProductDto - The data used to update the product.
   * @returns {Promise<IProduct>} - The updated product.
   * @throws {NotFoundException} - If the product with the given ID is not found.
   */
  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<IProduct> {
    const product = await this.productRepository.findOneById(productId);
    if (!product) {
      throw new NotFoundException({
        message: Messages.ERROR.PRODUCT_NOT_FOUND,
        status_code: Status_Code.ERROR_CODE.NOT_FOUND,
      });
    }

    const updatedProduct = await this.productRepository.update(
      productId,
      updateProductDto,
    );

    return updatedProduct;
  }





  //Delete product
  /**
   * Deletes a product with the given ID.
   * @param {string} productId - The ID of the product to delete.
   * @returns {Promise<ResponseSingleMsg>} A Promise that resolves to an object with a success message.
   * @throws {NotFoundException} If the product with the given ID is not found.
   */
  async deleteProduct(productId: string): Promise<ResponseSingleMsg> {
        const product = await this.productRepository.findOneById(productId);
        if (!product) {
        throw new NotFoundException({message: Messages.ERROR.PRODUCT_NOT_FOUND, status_code: Status_Code.ERROR_CODE.NOT_FOUND});
        }
        await this.productRepository.delete(productId);
        return { message: Messages.SUCCESS.PRODUCT_DELETED };
    }
    
}
