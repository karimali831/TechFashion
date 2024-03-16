import { IProductVariantObj } from "./IProductVariantObj";

export interface ICartProductDetail {
    id: number;
    productId: number;
    variantId?: number;
    title: string;
    quantity: number;
    variant?: string;
    unitPrice: number;
    unitTotal: number;
    unitPriceStr: string;
    unitTotalStr: string;
    variantList: IProductVariantObj[];
}
