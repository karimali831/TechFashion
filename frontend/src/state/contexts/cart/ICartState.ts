import { ICartProduct } from "src/data/ICartProduct";

export interface ICartState {
    openOverlay: boolean;
    itemsInCart: ICartProduct[];
}

export const cartInitialState: ICartState = {
    openOverlay: false,
    itemsInCart: [],
};
