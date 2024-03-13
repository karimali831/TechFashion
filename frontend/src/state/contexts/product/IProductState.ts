import { IProductDetail } from "src/interface/IProductDetail";

export interface IProductState {
    selectedProduct: IProductDetail[];
}

export const productInitialState: IProductState = {
    selectedProduct: [],
};
