import { IProductVariantObj } from "./IProductVariantObj";

export interface ICartProductDetail {
    id: number;
    productId: number;
    variantId?: number;
    title: string;
    quantity: number;
    stock?: number;
    variant?: string;
    unitPrice: number;
    unitTotal: number;
    // not mapped
    unitPriceStr: string;
    unitTotalStr: string;
    variantList: IProductVariantObj[];
}
