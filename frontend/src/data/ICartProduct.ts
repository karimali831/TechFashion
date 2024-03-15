import { IProductVariantObj } from "src/interface/IProductVariantObj";

export interface ICartProduct {
    id: number;
    cartId: number;
    quantity: number;
    productId: number;
    variant?: string;
    variantList: IProductVariantObj[];
}
