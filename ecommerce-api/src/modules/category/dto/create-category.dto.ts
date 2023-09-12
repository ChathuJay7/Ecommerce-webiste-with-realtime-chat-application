import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  /**
   * The name of the parent category.
   */
  @ApiProperty({
    description: 'This is the parent category name',
    example: 'Shorts',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * The description of the parent category.
   */
  @ApiProperty({
    description: 'This is the parent category description',
    example: 'Parent category tag description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  /**
   * The level of the category.
   */
  @ApiProperty({
    description: 'This is the level of the category',
    example: '0',
  })
  @IsNumber()
  level: number;

  /**
   * The ID of the parent category.
   */
  @ApiProperty({
    description: 'This is the ID of the parent category',
    example: '03f79166-0eb9-4744-bbc0-fc918a96e232',
  })
  @IsString()
  parentId?: string;
}
