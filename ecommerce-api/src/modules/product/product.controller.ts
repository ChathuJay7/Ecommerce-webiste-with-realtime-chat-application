import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-produuct.dto';
import { ProductDto } from './dto/product.dto';
import { IProduct } from './interfaces/product.interface';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MultipleRoleGuard } from '../auth/guards/multiple-role.guard';
import { UserRole } from 'src/core/enums/user-roles';
import { Roles } from '../auth/decorators/multiple-role.decorator';
import { ResponseSingleMsg } from 'src/core/interfaces/response-msg.interface';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/filter-product.dto';
import { ProductPaginateDto } from './dto/paginate-product.dto';


@ApiTags('Products')
@Controller('product')
export class ProductController {
    
    constructor(private productService: ProductService){

    }

    //Get all products
    // @Get()
    // @ApiOkResponse({
    //     status: 200, 
    //     description: 'Retrieve all products successfully',
    //     type: ProductDto,
    // })
    // @ApiBadRequestResponse({
    //     status: 400,
    //     description: 'Products cannot retrieve. Please try again',
    // })
    // @ApiInternalServerErrorResponse({ 
    //     status: 500, 
    //     description: 'Internal server error' 
    // })
    // getAllProducts(): Promise<IProduct[]>{
    //     return this.productService.getAllProducts();
    // }

    /**
     * Get all products
     * Authorized to - ADMIN, CUSTOMER
     * Retrieves all products from the product service.
     * @param productFilterDto is an optional query parameter to filter products by various criteria.
     * @returns A Promise that resolves to an array of Product objects matching the specified criteria, or all Product objects if no criteria is provided.
     */
    @Get()
    @ApiOkResponse({
        status: 200, 
        description: 'Retrieve all products successfully',
        type: ProductDto,
    })
    @ApiBadRequestResponse({
        status: 400,
        description: 'Products cannot retrieve. Please try again',
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    getAllProducts(): Promise<IProduct[]>{
        return this.productService.getAllProducts();
    }
    // async getAllProducts(@Query() productFilterDto?: ProductFilterDto): Promise<IProduct[]> {
    //     return this.productService.getAllProducts(productFilterDto);
    // }
    // async getAllProducts(@Query() productPaginateDto?: ProductPaginateDto): Promise<IProduct[]> {
    //     return this.productService.getAllProducts(productPaginateDto);
    // }




    /**
     * Get a single product by ID
     * Authorized to - ADMIN, CUSTOMER
     * Retrieves a product with the specified ID from the product service.
     * @param id The ID of the product to retrieve.
     * @returns A Promise that resolves to a Product object matching the specified ID, or null if no product is found.
     */
    @Get(':id')
    @ApiOkResponse({
        status: 200,
        description: 'Retrieve product successfully',
        type: ProductDto,
    })
    @ApiBadRequestResponse({
        status: 400, 
        description: "Password cannot update. Please try again"
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Product not found',
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    getSingleProduct(@Param('id', ParseUUIDPipe) id: string,): Promise<IProduct> {
        return this.productService.getSingleProduct(id);
    }


    
    /**
     * Create a new product
     * Authorized to - ADMIN
     * Creates a new product using the provided product data and saves it to the database.
     * @param createProductDto Data Transfer Object containing the data necessary to create a new product.
     * @returns A Promise that resolves to the created Product object.
     */
    @Post()
    @UseGuards(JwtAuthGuard, MultipleRoleGuard)
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @ApiCreatedResponse({
        status: 201,
        description: 'Product created successfully',
        type: CreateProductDto,
    })
    @ApiBadRequestResponse({
        status: 400, 
        description: 'Product cannot create. Please try again',
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    createProduct(@Body() createProductDto: CreateProductDto): Promise<IProduct>{
        return this.productService.createProduct(createProductDto);
    }



    /**
     * Update product details
     * Authorized to - ADMIN
     * Updates an existing product with the specified details.
     * @param id The ID of the product to update.
     * @param updateProductDto The details to update the product with.
     * @returns A Promise that resolves to the updated Product object.
     */
    @Put(':id')
    @UseGuards(JwtAuthGuard, MultipleRoleGuard)
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({
        status: 200,
        description: 'Product updated Successfully',
        type: UpdateProductDto,
    })
    @ApiBadRequestResponse({
        status: 400, 
        description: 'Product cannot create. Please try again',
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Product not found',
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    updateProduct(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto):Promise<IProduct>{
        return this.productService.updateProduct(id, updateProductDto);
    }



    /**
    * Delete a Product
    * Authorized to - ADMIN
    * Deletes a product with the given ID.
    * @param id The ID of the product to be deleted
    * @returns A Promise that resolves to the result of the delete operation.
    */
    @Delete(':id')
    @UseGuards(JwtAuthGuard, MultipleRoleGuard)
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({
        status: 200,
        description: 'Product deleted successfully',
    })
    @ApiBadRequestResponse({
        status: 400, 
        description: 'Product cannot create. Please try again',
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Product not found',
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    deleteProduct(@Param('id', ParseUUIDPipe) id: string,): Promise<ResponseSingleMsg>{
        return this.productService.deleteProduct(id);
    }

}


