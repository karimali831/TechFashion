import { ICartState, cartInitialState } from "./contexts/cart/ICartState";
import {
    IProductState,
    productInitialState,
} from "./contexts/product/IProductState";
import { IUserState, userInitialState } from "./contexts/user/IUserState";

export interface IStoreState {
    user: IUserState;
    cart: ICartState;
    product: IProductState;
}

export const StoreState: IStoreState = {
    user: userInitialState,
    cart: cartInitialState,
    product: productInitialState,
};
