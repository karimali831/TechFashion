export interface IProductImage {
    id: number;
    productId: number;
    imageSrc: string;
    variantKey?: string;
    variantValue?: string;
    main: boolean;
}
