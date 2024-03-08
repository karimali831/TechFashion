import { ICartState, cartInitialState } from "./contexts/cart/ICartState";

export interface IStoreState {
    cart: ICartState;
}

export const StoreState: IStoreState = {
    cart: cartInitialState,
};
