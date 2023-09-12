import { Category } from "src/modules/category/entity/category.entity";

export interface IProduct {

    id: string;
    name: string;
    color: string;
    price: number;
    image: string;
    discount: number;
    description: string;
    quantity: number;
    category: Category;
  }