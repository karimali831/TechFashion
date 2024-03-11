import { IProductVariant } from "./IProductVariant";

export interface IProductVariantOption {
    id: number;
    productVariantId?: number;
    productVariant?: IProductVariant;
    name: string;
    sku: string;
    stock?: number;
    price: number;
}
