export interface IProductDetail {
    id: number;
    title: string;
    description: string;
    slug: string;
    price: number;
    stock?: number;
    sku: string;
    variant?: string;
    variantValue?: string;
    imageSrc?: string;
    imageMain?: boolean;
}
