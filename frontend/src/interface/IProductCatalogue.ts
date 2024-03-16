export interface IProductCatalogue {
    id: number;
    title: string;
    slug: string;
    imageSrc?: string;
    price: number;
    variant: boolean;
    priceStr: string;
}
