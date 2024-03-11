import { IProduct } from "./IProduct";
import { IProductVariant } from "./IProductVariant";

export interface IProductImage {
    id: number;
    url: string;
    productId?: number;
    product?: IProduct;
    productVariantId?: number;
    productVariant?: IProductVariant;
    main: boolean;
}
