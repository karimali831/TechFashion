import { IProductVariantObj } from "src/interface/IProductVariantObj";

export interface IOrderItem {
    id: number;
    productId: number;
    product: string;
    productSlug: string;
    variant: string;
    quantity: number;
    price: number;
    total: number;
    //  non db props
    priceStr: string;
    totalStr: string;
    variantList: IProductVariantObj[];
}
