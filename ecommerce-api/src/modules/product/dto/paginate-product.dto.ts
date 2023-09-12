import { IsOptional, IsString } from "class-validator";

export class ProductPaginateDto {

    /**
     * The limit param for the limit per page.
     */
    @IsOptional()
    @IsString()
    limit?: string;
    // limit?: string = '10';

    /**
     * The page param for the product pagination.
     */
    @IsOptional()
    @IsString()
    page?: string;
    // page?: string = '1';
}