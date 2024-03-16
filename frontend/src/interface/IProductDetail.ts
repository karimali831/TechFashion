import { IProductVariantObj } from "./IProductVariantObj";

export interface IProductDetail {
    id: number;
    variantId?: number;
    title: string;
    description: string;
    slug: string;
    price: number;
    stock?: number;
    sku: string;
    active: boolean;
    variant?: string;
    imageSrc?: string;
    priceStr: string;
    variantList: IProductVariantObj[];
}
