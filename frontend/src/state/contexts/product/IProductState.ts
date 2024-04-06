import { IProductDetail } from "src/interface/IProductDetail";

export interface IProductState {
    selectedProduct: IProductDetail[];
    stock: number | null;
}

export const productInitialState: IProductState = {
    selectedProduct: [],
    stock: 0,
};
