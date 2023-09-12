import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryRepositoryInterface } from './interfaces/category-repository.interface';
import { ICategory } from './interfaces/category.interface';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Messages } from 'src/core/constants/messages';
import { Status_Code } from 'src/core/constants/status-codes';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;

  let mockCategoryObj: ICategory = {
    id: '12a50bc0-83df-4bab-9ec5-d9f14aa6b393',
    name: 'Shorts',
    description: 'Shorts category tag description',
  };

  let mockCategoryObjArr: ICategory[] = [
    {
      id: '12a50bc0-83df-4bab-9ec5-d9f14aa6b393',
      name: 'Shorts',
      description: 'Shorts category tag description',
    },
  ];

  let createCategoryDto = new CreateCategoryDto();
  createCategoryDto.name = 'Shorts';
  createCategoryDto.description = 'Shorts category tag description';

  let updateCategoryDto = new UpdateCategoryDto();
  updateCategoryDto.name = 'Shorts';
  updateCategoryDto.description = 'Shorts category tag description';

  const mockCategoryRepository = {
    findAll: jest.fn().mockReturnValue(mockCategoryObjArr),
    findOneById: jest.fn().mockReturnValue(mockCategoryObj),
    findCategoryByName: jest.fn().mockReturnValue(mockCategoryObj),
    create: jest.fn().mockReturnValue(mockCategoryObj),
    update: jest.fn().mockReturnValue(mockCategoryObj),
    delete: jest
      .fn()
      .mockReturnValue({ message: 'Category deleted successfully' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: `${CategoryRepositoryInterface}`,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined CategoryService', () => {
    expect(service).toBeDefined();
  });

  /**
   * Get all categories
   * Retrieves all categories from the category service.
   * @returns A Promise that resolves to an array of categories.
   */
  describe('getAllCategories', () => {
    it('should be defined getAllCategories', () => {
      expect(service.getAllCategories).toBeDefined();
    });
    it('should call the getAllCategories method of the CategoryService & return the ICategory[]', async () => {
      const actualResponse = await service.getAllCategories();
      expect(actualResponse).toEqual(mockCategoryObjArr);
      expect(mockCategoryRepository.findAll).toHaveBeenCalledWith();
    });
  });

  /**
   * Get single category
   * Retrieves a single category with the given ID.
   * @param id The ID of the category to retrieve.
   * @returns A Promise that resolves to the retrieve category.
   * @throws NotFoundException If no category is found with the given ID.
   */
  describe('getSingleCategory', () => {
    const id = expect.any(String);
    it('should be defined getSingleCategory', () => {
      expect(service.getSingleCategory).toBeDefined();
    });
    it('should call the getSingleCategory method of the CategoryService & return the ICategory', async () => {
      const actualResponse = await service.getSingleCategory(id);
      expect(actualResponse).toEqual(mockCategoryObj);
      expect(mockCategoryRepository.findOneById).toHaveBeenCalledWith(id);
    });
    it('should throw a NotFoundException if category not found', async () => {
      jest.spyOn(mockCategoryRepository, 'findOneById').mockResolvedValue(null);
      await expect(service.getSingleCategory(id)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.CATEGORY_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });
  });

  /**
   * Create a category
   * Creates a new category with the given data.
   * @param createCategoryDto The DTO containing the data for the new category.
   * @returns A Promise that resolves to the created category.
   * @throws ConflictException If the category is existing.
   */
  describe('createCategory', () => {
    it('should be defined createCategory', () => {
      expect(service.createCategory).toBeDefined();
    });
    it('should call the createCategory method of the CategoryService with the correct DTO', async () => {
      jest
        .spyOn(mockCategoryRepository, 'findCategoryByName')
        .mockResolvedValue(null);
      const actualResponse = await service.createCategory(createCategoryDto);
      expect(actualResponse).toEqual(mockCategoryObj);
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(
        createCategoryDto,
      );
    });
    it('should throw ConflictException when category already exists', async () => {
      jest
        .spyOn(mockCategoryRepository, 'findCategoryByName')
        .mockResolvedValue(mockCategoryObj);
      await expect(service.createCategory(createCategoryDto)).rejects.toThrow(
        new ConflictException({
          message: Messages.ERROR.CATEGORY_ALREADY_EXISTS,
          status_code: Status_Code.ERROR_CODE.ALREADY_EXISTS,
        }),
      );
    });
  });

  /**
   * Update a category
   * Updates an existing category with the given data.
   * @param id The ID of the category to update.
   * @param updateCategoryDto The DTO containing the data to update the category.
   * @returns A Promise that resolves to the updated category.
   * @throws NotFoundException If the specified category is not found.
   */
  describe('updateCategory', () => {
    const id = expect.any(String);
    it('should be defined updateCategory', () => {
      expect(service.updateCategory).toBeDefined();
    });
    it('should call the updateCategory method of the CategoryController with the correct DTO', async () => {
      jest
        .spyOn(mockCategoryRepository, 'findOneById')
        .mockResolvedValue(mockCategoryObj);
      const actualResponse = await service.updateCategory(
        id,
        updateCategoryDto,
      );
      expect(actualResponse).toEqual(mockCategoryObj);
      expect(mockCategoryRepository.update).toHaveBeenCalledWith(
        id,
        updateCategoryDto,
      );
    });
    it('should throw a NotFoundException if category not found', async () => {
      jest.spyOn(mockCategoryRepository, 'findOneById').mockResolvedValue(null);
      await expect(
        service.updateCategory(id, updateCategoryDto),
      ).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.CATEGORY_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });
  });

  /**
   * Delete a category
   * Deletes a category with the given ID.
   * @param id The ID of the category to delete.
   * @returns A Promise that resolves to the result of the delete operation.
   * @throws NotFoundException If no category is found with the given ID.
   */
  describe('deleteCategory', () => {
    const id = expect.any(String);
    it('should be defined deleteCategory', () => {
      expect(service.deleteCategory).toBeDefined();
    });
    it('should call the deleteCategory method of the CategoryService & return the message', async () => {
      jest.spyOn(mockCategoryRepository, 'findOneById').mockResolvedValue(id);
      const expectedResponse = { message: 'Category deleted successfully' };
      const actualResponse = await service.deleteCategory(id);
      expect(actualResponse).toEqual(expectedResponse);
      expect(mockCategoryRepository.findOneById).toHaveBeenCalledWith(id);
      expect(mockCategoryRepository.delete).toHaveBeenCalledWith(id);
    });
    it('should throw a NotFoundException if category not found', async () => {
      jest.spyOn(mockCategoryRepository, 'findOneById').mockResolvedValue(null);
      await expect(service.getSingleCategory(id)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.CATEGORY_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });
  });
});
