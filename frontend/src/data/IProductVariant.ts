export interface IProductVariant {
    id: number;
    productId: number;
    variations: string;
    sku: string;
    stock?: number;
    price: number;
}
