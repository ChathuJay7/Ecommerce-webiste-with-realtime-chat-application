import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { ICategory } from '../interfaces/category.interface';

export class CategoryDto implements ICategory {
  /**
   * The ID of the category.
   */
  @ApiProperty({
    description: 'This is the category id',
    example: '1',
  })
  @IsString()
  id: string;

  /**
   * The name of the category.
   */
  @ApiProperty({
    description: 'This is the category name',
    example: 'Shorts',
  })
  @IsString()
  name: string;

  /**
   * The description of the category.
   */
  @ApiProperty({
    description: 'This is the category description',
    example: 'Shorts category tag description',
  })
  @IsString()
  description: string;
}
