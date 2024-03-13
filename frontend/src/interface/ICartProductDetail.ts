import { IProductVariantObj } from "./IProductVariantObj";

export interface ICartProductDetail {
    id: number;
    productId: number;
    productVariantId?: number;
    title: string;
    imageSrc: string;
    quantity: number;
    variations?: string;
    unitPrice: number;
    unitTotal: number;
    unitPriceStr: string;
    unitTotalStr: string;
    variationsList: IProductVariantObj[];
}
