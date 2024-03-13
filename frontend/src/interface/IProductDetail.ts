import { IProductVariantObj } from "./IProductVariantObj";

export interface IProductDetail {
    id: number;
    productVariantId?: number;
    title: string;
    description: string;
    slug: string;
    price: number;
    stock?: number;
    sku: string;
    active: boolean;
    variations?: string;
    imageSrc?: string;
    imageMain?: boolean;
    variationsList: IProductVariantObj[];
}
