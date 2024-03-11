import { ICart } from "./ICart";
import { IProduct } from "./IProduct";
import { IProductVariantOption } from "./IProductVariantOption";

export interface ICartProduct {
    id: number;
    cartId: number;
    cart: ICart;
    quantity: number;
    productId?: number;
    product?: IProduct;
    productVariantOptionId?: number;
    productVariantOption?: IProductVariantOption;
    total: number;
}
