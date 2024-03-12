import { IProductCatalogue } from "src/interface/IProductCatalogue";

export interface IProductState {
    selectedProduct: IProductCatalogue | null;
}

export const productInitialState: IProductState = {
    selectedProduct: null,
};
