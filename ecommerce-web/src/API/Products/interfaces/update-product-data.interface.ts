export interface IUpdateProductData {
    id: string;
    name?: string;
    color?: string;
    price?: number;
    discount?: number;
    quantity?: number;
    description?: string;
    categoryId?: string;
    images?: string[];
}