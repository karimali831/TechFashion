import { IProductVariantObj } from "./IProductVariantObj";

export interface ICartProductDetail {
    id: number;
    productId: number;
    title: string;
    imageSrc?: string;
    quantity: number;
    variant?: string;
    unitPrice: number;
    unitTotal: number;
    unitPriceStr: string;
    unitTotalStr: string;
    variantList: IProductVariantObj[];
}
