import { IProduct } from "src/data/IProduct";
import { IProductVariantOption } from "./IProductVariantOption";

export interface IProductVariant {
    id: number;
    name: string;
    options: IProductVariantOption[];
    productId?: number;
    product?: IProduct;
    active: boolean;
}
