import { Category } from '../entity/category.entity';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { IBaseRepositoy } from 'src/core/repositories/base/base-interface.repository';
import { CategoryFilterDto } from '../dto/category-filter.dto';

export const CategoryRepositoryInterface = 'ICategoryRepository';
export interface ICategoryRepository extends IBaseRepositoy<Category> {
  /**
   * Finds a category by its name.
   * @param name The name of the category to find.
   * @returns A Promise that resolves with the category if found, otherwise it rejects with an error.
   */
  findCategoryByName(name: string, level: number): Promise<Category>;

  /**
   * Updates a category.
   * @param id The ID of the category to update.
   * @param updateCategoryDto An object representing the category properties to update.
   * @returns A Promise that resolves with the updated category, otherwise it rejects with an error.
   */
  update(
    id: string | number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category>;

  /**
   * Retrieves all categories matching the specified name, or all categories if no name is provided.
   * @param name Optional name parameter to filter categories by name.
   * @returns A Promise that resolves to an array of Category objects matching the specified name, or all Category objects if no name is provided.
   */
  filterCategories(categoryFilterDto?: CategoryFilterDto): Promise<Category[]>;
}
