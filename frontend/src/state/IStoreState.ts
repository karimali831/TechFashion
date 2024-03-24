import { IAppState, appInitialState } from "./contexts/app/IAppState";
import { ICartState, cartInitialState } from "./contexts/cart/ICartState";
import {
    IProductState,
    productInitialState,
} from "./contexts/product/IProductState";
import { IUserState, userInitialState } from "./contexts/user/IUserState";

export interface IStoreState {
    app: IAppState;
    user: IUserState;
    cart: ICartState;
    product: IProductState;
}

export const StoreState: IStoreState = {
    app: appInitialState,
    user: userInitialState,
    cart: cartInitialState,
    product: productInitialState,
};
