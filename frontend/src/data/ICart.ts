import { IProduct } from "src/data/IProduct";
import { IProductVariant } from "./IProductVariant";

export interface ICart {
    id: number;
    quantity: number;
    productId?: number;
    product?: IProduct;
    productVariantId?: number;
    productVariant?: IProductVariant;
    total: number;
}
