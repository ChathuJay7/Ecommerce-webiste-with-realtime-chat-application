import { BaseAbstractRepositoryImpl } from '../../../core/repositories/base/base-abstract.repository';
import { Category } from '../entity/category.entity';
import { ICategoryRepository } from '../interfaces/category-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryFilterDto } from '../dto/category-filter.dto';

export class CategoryRepository
  extends BaseAbstractRepositoryImpl<Category>
  implements ICategoryRepository
{
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }

  /**
   * Finds a category by its name.
   * @param name The name of the category to find.
   * @returns A Promise that resolves with the category if found, otherwise it rejects with an error.
   */
  async findCategoryByName(name: string, level: number): Promise<Category> {
    return await this.categoryRepository.findOne({
      where: {
        name: name,
        level: level,
      },
    });
  }

  /**
   * Updates a category.
   * @param id The ID of the category to update.
   * @param updateCategoryDto An object representing the category properties to update.
   * @returns A Promise that resolves with the updated category, otherwise it rejects with an error.
   */
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const entityToUpdate = await this.findOneById(id);
    if (!entityToUpdate) {
      return null;
    }
    Object.assign(entityToUpdate, updateCategoryDto);
    return await this.categoryRepository.save(entityToUpdate);
  }

  /**
   * Retrieves all categories matching with the specified query param.
   * @param param Optional dynamic parameter to filter categories by param.
   * @returns A Promise that resolves to an array of Category objects matching the specified param.
   */
  async filterCategories(
    categoryFilterDto?: CategoryFilterDto,
  ): Promise<Category[]> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    // Category filtering using query parameters
    if (categoryFilterDto) {
      Object.entries(categoryFilterDto).forEach(([key, value]) => {
        console.log('KEY :', key);
        console.log('VALUE :', value);
        if (key && key !== 'sortType' && key !== 'sortColumn' && key !== 'page') {
          const param = `${key}`;
          const column = `category.${param}`;
          const condition = `${column} LIKE :${param}`;
          queryBuilder.andWhere(condition, { [param]: `%${value}%` });
        }
      });
    }

    // Category sorting using query parameter called sortColumn & sortType
    const { sortType, sortColumn } = categoryFilterDto;
    if (sortType && sortColumn) {
      const column = `category.${sortColumn}`;
      const sortTypeStr: any = sortType.toUpperCase();
      queryBuilder.orderBy(column, sortTypeStr);
    }

    // Category pagination using query parameter called page
    const { page } = categoryFilterDto;
    if (page) {
      const page: number = parseInt(categoryFilterDto.page) || 1;
      const perPage = 2;
      const total = await queryBuilder.getCount();
      const lastPage = Math.ceil(total / perPage);
      queryBuilder.offset((page - 1) * perPage).limit(perPage);

      console.log('TOTAL : ', total);
      console.log('PAGE : ', page);
      console.log('LAST PAGE : ', lastPage);
    }

    return await queryBuilder.getMany();
  }
}
