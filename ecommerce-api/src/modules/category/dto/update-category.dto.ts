import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCategoryDto {
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
