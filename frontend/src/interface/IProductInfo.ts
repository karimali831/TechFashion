import { IProductImage } from "src/data/IProductImage";
import { IProductVariant } from "../data/IProductVariant";

export interface IProductInfo {
    id: number;
    sku: string;
    title: string;
    description: string;
    slug: string;
    price: number;
    priceStr: string;
    stock?: number;
    variants: IProductVariant[];
    images: IProductImage[];
}
