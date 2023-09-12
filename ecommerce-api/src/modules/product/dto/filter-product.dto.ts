import { IsNumber, IsOptional, IsString } from "class-validator";

export class ProductFilterDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    color?: string;
  
    @IsOptional()
    @IsNumber()
    price?: number;
}