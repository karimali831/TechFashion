import { IProduct } from "src/data/IProduct";

export interface IProductVariant {
    id: number;
    key: string;
    value: string;
    sku: string;
    stock?: number;
    price: number;
    productId?: number;
    product?: IProduct;
    active: boolean;
}
