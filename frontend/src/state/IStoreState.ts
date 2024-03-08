import { ICartState, cartInitialState } from "./contexts/cart/ICartState";
import {
    IProductState,
    productInitialState,
} from "./contexts/product/IProductState";

export interface IStoreState {
    cart: ICartState;
    product: IProductState;
}

export const StoreState: IStoreState = {
    cart: cartInitialState,
    product: productInitialState,
};
