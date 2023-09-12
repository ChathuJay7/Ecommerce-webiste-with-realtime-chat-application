import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoryFilterDto {
  /**
   * The name of the category.
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * The level of the category.
   */
  @IsOptional()
  @IsString()
  level?: string;

  /**
   * The description of the category.
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * The sort column param of the category.
   */
  @IsOptional()
  @IsString()
  sortColumn?: string;

  /**
   * The sort type param of the category.
   */
  @IsOptional()
  @IsString()
  sortType?: string;

  /**
   * The page param for the category pagination.
   */
  @IsOptional()
  @IsString()
  page?: string;
}
