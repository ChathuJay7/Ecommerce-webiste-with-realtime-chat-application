import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { MultipleRoleGuard } from '../auth/guards/multiple-role.guard';
import { Roles } from '../auth/decorators/multiple-role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ICategory } from './interfaces/category.interface';
import { UserRole } from 'src/core/enums/user-roles';
import { CategoryFilterDto } from './dto/category-filter.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  /**
   * Get all categories
   * Authorized to - ADMIN, CUSTOMER
   * Retrieves all categories from the category service.
   * @param name is Optional query parameter to filter categories by name.
   * @returns A Promise that resolves to an array of Category objects matching the specified name, or all Category objects if no name is provided.
   */
  @Get()
  @UseGuards(JwtAuthGuard, MultipleRoleGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @ApiQuery({ name: 'name', required: false })
  @ApiOkResponse({
    description: 'Retrieve all categories successfully',
    type: [CategoryDto],
  })
  @ApiBadRequestResponse({
    description: 'Categories cannot retrieve. Please try again',
  })
  async getAllCategories(
    @Query() categoryFilterDto?: CategoryFilterDto,
  ): Promise<ICategory[]> {
    return this.categoryService.getAllCategories(categoryFilterDto);
  }

  /**
   * Get single category
   * Authorized to - ADMIN, CUSTOMER
   * Retrieves a single category with the given ID.
   * @param id The ID of the category to retrieve.
   * @returns A Promise that resolves to the retrieve category.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, MultipleRoleGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @ApiOkResponse({
    description: 'Retrieve category successfully',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  async getSingleCategory(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ICategory> {
    return this.categoryService.getSingleCategory(id);
  }

  /**
   * Create a category
   * Authorized to - ADMIN
   * Creates a new category with the given data.
   * @param createCategoryDto The DTO containing the data for the new category.
   * @returns A Promise that resolves to the created category.
   */
  @Post()
  @UseGuards(JwtAuthGuard, MultipleRoleGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiCreatedResponse({
    description: 'Parent category created successfully',
    type: CreateCategoryDto,
  })
  @ApiBadRequestResponse({
    description: 'Parent category cannot create. Please try again',
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ICategory> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  /**
   * Update a category
   * Authorized to - ADMIN
   * Updates an existing category with the given data.
   * @param id The ID of the category to update.
   * @param updateCategoryDto The DTO containing the data to update the category.
   * @returns A Promise that resolves to the updated category.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, MultipleRoleGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Category updated Successfully',
    type: UpdateCategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ICategory> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  /**
   * Delete a category
   * Authorized to - ADMIN
   * Deletes a category with the given ID.
   * @param id The ID of the category to delete.
   * @returns A Promise that resolves to the result of the delete operation.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, MultipleRoleGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Category deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
