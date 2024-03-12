export interface IProductCatalogue {
    id: number;
    title: string;
    slug: string;
    price: number;
    imageSrc?: string;
    variant: boolean;
    priceStr: string;
}
