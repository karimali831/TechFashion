export interface IOrderItem {
    id: number;
    productId: number;
    product: string;
    productSlug: string;
    sku: string;
    quantity: number;
    price: number;
    total: number;
    priceStr: string;
    totalStr: string;
}
