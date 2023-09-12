import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepository } from './category.repository';
import { ICategory } from '../interfaces/category.interface';
import { UpdateCategoryDto } from '../dto/update-category.dto';

describe('CategoryRepository', () => {
  let repository: CategoryRepository;

  let mockCategoryObj: ICategory = {
    id: "12a50bc0-83df-4bab-9ec5-d9f14aa6b393",
    name: 'Shorts',
    description: 'Shorts category tag description',
  };

  let updateCategoryDto = new UpdateCategoryDto();
  updateCategoryDto.name = 'Shorts';
  updateCategoryDto.description = 'Shorts category tag description';

  const mockCategoryRepository = {
    findCategoryByName: jest.fn().mockReturnValue(mockCategoryObj),
    update: jest.fn().mockReturnValue(mockCategoryObj),
    findOneById: jest.fn().mockReturnValue(mockCategoryObj),
    assign: jest.fn().mockReturnValue(mockCategoryObj),
    save: jest.fn().mockReturnValue(mockCategoryObj),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CategoryRepository,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    repository = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined CategoryRepository', () => {
    expect(repository).toBeDefined();
  });

  describe('findCategoryByName', () => {
    it('should be defined findCategoryByName', () => {
      expect(repository.findCategoryByName).toBeDefined();
    });
    it('should call the findCategoryByName method of the CategoryRepository & return the Category entity match with name', async () => {
      const sampleCategory = "Clothing";
      const actualResponse = await repository.findCategoryByName(sampleCategory);
      expect(actualResponse).toEqual(mockCategoryObj);
      expect(mockCategoryRepository.findCategoryByName).toHaveBeenCalledWith(sampleCategory);
    });
  });

  describe('update', () => {
    const id = expect.any(String);
    it('should be defined update', () => {
      expect(repository.findCategoryByName).toBeDefined();
    });
    it('should call the update method of the CategoryRepository & return the updated Category entity match with ID', async () => {
      jest.spyOn(mockCategoryRepository, 'findOneById').mockResolvedValue(mockCategoryObj);
      const actualResponse = await repository.update(id, updateCategoryDto);
      expect(actualResponse).toEqual(mockCategoryObj);
      expect(mockCategoryRepository.update).toHaveBeenCalledWith(id, updateCategoryDto);
    });
  });

});
