export interface IProductImage {
    id: number;
    url: string;
    productId?: number;
    productVariantId?: number;
    main: boolean;
}
