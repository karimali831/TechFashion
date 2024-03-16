import { IProductVariantObj } from "src/interface/IProductVariantObj";

export interface IProductVariant {
    id: number;
    productId: number;
    variant?: string;
    sku: string;
    stock?: number;
    price: number;
    variantList: IProductVariantObj[];
}
