import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entity/category.entity';
import { CategoryDto } from './dto/category.dto';
import {
  CategoryRepositoryInterface,
  ICategoryRepository,
} from './interfaces/category-repository.interface';
import { Messages } from 'src/core/constants/messages';
import { Status_Code } from 'src/core/constants/status-codes';
import { ICategory } from './interfaces/category.interface';
import { ResponseSingleMsg } from 'src/core/interfaces/response-msg.interface';
import { CategoryFilterDto } from './dto/category-filter.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(`${CategoryRepositoryInterface}`)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  /**
   * Get all categories
   * Retrieves all categories from the category service.
   * @param name is Optional query parameter to filter categories by name.
   * @returns A Promise that resolves to an array of Category objects matching the specified name, or all Category objects if no name is provided.
   */
  async getAllCategories(
    categoryFilterDto?: CategoryFilterDto,
  ): Promise<ICategory[]> {
    if (categoryFilterDto) {
      return await this.categoryRepository.filterCategories(categoryFilterDto);
    } else {
      return await this.categoryRepository.findAll();
    }
  }

  /**
   * Get single category
   * Retrieves a single category with the given ID.
   * @param id The ID of the category to retrieve.
   * @returns A Promise that resolves to the retrieve category.
   * @throws NotFoundException If no category is found with the given ID.
   */
  async getSingleCategory(id: string): Promise<ICategory> {
    const category = await this.categoryRepository.findOneById(id);
    if (!category) {
      throw new NotFoundException({
        message: Messages.ERROR.CATEGORY_NOT_FOUND,
        status_code: Status_Code.ERROR_CODE.NOT_FOUND,
      });
    }
    return category;
  }

  /**
   * Create a category
   * Creates a new category with the given data.
   * @param createCategoryDto The DTO containing the data for the new category.
   * @returns A Promise that resolves to the created category.
   * @throws ConflictException If the category is existing.
   */
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ICategory> {
    const existingCategory = await this.categoryRepository.findCategoryByName(
      createCategoryDto.name,
      createCategoryDto.level,
    );

    if (existingCategory) {
      throw new ConflictException({
        message: Messages.ERROR.CATEGORY_ALREADY_EXISTS,
        status_code: Status_Code.ERROR_CODE.ALREADY_EXISTS,
      });
    }

    const category = await this.categoryRepository.findOneById(
      createCategoryDto.parentId,
    );

    const newCategory = new Category();
    newCategory.name = createCategoryDto.name;
    newCategory.description = createCategoryDto.description;
    newCategory.level = createCategoryDto.level;
    newCategory.parent = category || null;
    const createdNewCategory = await this.categoryRepository.create(
      newCategory,
    );
    return createdNewCategory;
  }

  /**
   * Update a category
   * Updates an existing category with the given data.
   * @param id The ID of the category to update.
   * @param updateCategoryDto The DTO containing the data to update the category.
   * @returns A Promise that resolves to the updated category.
   * @throws NotFoundException If the specified category is not found.
   */
  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ICategory> {
    const category = await this.categoryRepository.findOneById(id);
    if (!category) {
      throw new NotFoundException({
        message: Messages.ERROR.CATEGORY_NOT_FOUND,
        status_code: Status_Code.ERROR_CODE.NOT_FOUND,
      });
    }
    const updatedUser = await this.categoryRepository.update(
      id,
      updateCategoryDto,
    );
    return updatedUser;
  }

  /**
   * Delete a category
   * Deletes a category with the given ID.
   * @param id The ID of the category to delete.
   * @returns A Promise that resolves to the result of the delete operation.
   * @throws NotFoundException If no category is found with the given ID.
   */
  async deleteCategory(id: string): Promise<ResponseSingleMsg> {
    const category = await this.categoryRepository.findOneById(id);
    if (!category) {
      throw new NotFoundException({
        message: Messages.ERROR.CATEGORY_NOT_FOUND,
        status_code: Status_Code.ERROR_CODE.NOT_FOUND,
      });
    }
    await this.categoryRepository.delete(id);
    return { message: Messages.SUCCESS.CATEGORY_DELETED };
  }
}
