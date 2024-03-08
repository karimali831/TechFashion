import { IProductCart } from "src/interface/IProductCart";

export interface ICartState {
    openOverlay: boolean;
    itemsInCart: IProductCart[];
}

export const cartInitialState: ICartState = {
    openOverlay: false,
    itemsInCart: [],
};
