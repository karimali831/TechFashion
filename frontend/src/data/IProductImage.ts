import { IProduct } from "./IProduct";
import { IProductVariantOption } from "./IProductVariantOption";

export interface IProductImage {
    id: number;
    url: string;
    productId?: number;
    product?: IProduct;
    productVariantOptionId?: number;
    productVariantOption?: IProductVariantOption;
    main: boolean;
}
