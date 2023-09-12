import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ICategory } from './interfaces/category.interface';
import { MultipleRoleGuard } from '../auth/guards/multiple-role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryController', () => {
  let controller: CategoryController;

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

  const mockCategoryService = {
    getAllCategories: jest.fn().mockReturnValue(mockCategoryObjArr),
    getSingleCategory: jest.fn().mockReturnValue(mockCategoryObj),
    createCategory: jest.fn().mockReturnValue(mockCategoryObj),
    updateCategory: jest.fn().mockReturnValue(mockCategoryObj),
    deleteCategory: jest
      .fn()
      .mockReturnValue({ message: 'Category deleted successfully' }),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  const mockMultipleRoleGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
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

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined CategoryController', async () => {
    expect(controller).toBeDefined();
  });

  /**
   * Get all categories
   * Authorized to - ADMIN, USER
   * Retrieves all categories from the category service.
   * @returns A Promise that resolves to an array of categories.
   */
  describe('getAllCategories', () => {
    it('should be defined getAllCategories', () => {
      expect(controller.getAllCategories).toBeDefined();
    });
    it('should call the getAllCategories method of the CategoryController & return the ICategory[]', async () => {
      const actualResponse = await controller.getAllCategories();
      expect(actualResponse).toEqual(mockCategoryObjArr);
      expect(mockCategoryService.getAllCategories).toHaveBeenCalledWith();
    });
  });

  /**
   * Get single category
   * Authorized to - ADMIN, USER
   * Retrieves a single category with the given ID.
   * @param id The ID of the category to retrieve.
   * @returns A Promise that resolves to the retrieve category.
   */
  describe('getSingleCategory', () => {
    it('should be defined getSingleCategory', () => {
      expect(controller.getSingleCategory).toBeDefined();
    });
    it('should call the getSingleCategory method of the CategoryController with category ID', async () => {
      const id = expect.any(String);
      const actualResponse = await controller.getSingleCategory(id);
      expect(actualResponse).toEqual(mockCategoryObj);
      expect(mockCategoryService.getSingleCategory).toHaveBeenCalledWith(id);
    });
  });

  /**
   * Create a category
   * Authorized to - ADMIN
   * Creates a new category with the given data.
   * @param createCategoryDto The DTO containing the data for the new category.
   * @returns A Promise that resolves to the created category.
   */
  describe('createCategory', () => {
    it('should be defined createCategory', () => {
      expect(controller.createCategory).toBeDefined();
    });
    it('should call the createCategory method of the CategoryController with the correct DTO', async () => {
      const actualResponse = await controller.createCategory(createCategoryDto);
      expect(actualResponse).toEqual(mockCategoryObj);
      expect(mockCategoryService.createCategory).toHaveBeenCalledWith(
        createCategoryDto,
      );
    });
  });

  /**
   * Update a category
   * Authorized to - ADMIN
   * Updates an existing category with the given data.
   * @param id The ID of the category to update.
   * @param updateCategoryDto The DTO containing the data to update the category.
   * @returns A Promise that resolves to the updated category.
   */
  describe('updateCategory', () => {
    it('should be defined updateCategory', () => {
      expect(controller.updateCategory).toBeDefined();
    });
    it('should call the updateCategory method of the CategoryController with the correct correct ID & DTO', async () => {
      const id = expect.any(String);
      const actualResponse = await controller.updateCategory(
        id,
        updateCategoryDto,
      );
      expect(actualResponse).toEqual(mockCategoryObj);
      expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(
        id,
        updateCategoryDto,
      );
    });
  });

  /**
   * Delete a category
   * Authorized to - ADMIN
   * Deletes a category with the given ID.
   * @param id The ID of the category to delete.
   * @returns A Promise that resolves to the result of the delete operation.
   */
  describe('deleteCategory', () => {
    it('should be defined deleteCategory', () => {
      expect(controller.deleteCategory).toBeDefined();
    });
    it('should call the deleteCategory method of the CategoryController with the correct category ID', async () => {
      const id = expect.any(String);
      const actualResponse = await controller.deleteCategory(id);
      const expectedResponse = { message: 'Category deleted successfully' };
      expect(actualResponse).toEqual(expectedResponse);
      expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith(id);
    });
  });
});
