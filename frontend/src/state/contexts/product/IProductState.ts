import { products } from "src/assets/data/productInfo";
import { IProductInfo } from "src/interface/IProductInfo";

export interface IProductState {
    products: IProductInfo[];
    selectedProduct: IProductInfo | null;
}

export const productInitialState: IProductState = {
    products,
    selectedProduct: null,
};
