export interface IProduct {
    id: number;
    slug: string;
    sku?: string;
    title: string;
    description: string;
    price: number;
    stock?: number;
    active: boolean;
}
