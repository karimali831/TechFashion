export interface ICartProduct {
    id: number;
    cartId: number;
    productId?: number;
    variantId?: number;
    quantity: number;
}
