import { ICart } from "src/data/ICart";

export interface ICartState {
    openOverlay: boolean;
    itemsInCart: ICart[];
}

export const cartInitialState: ICartState = {
    openOverlay: false,
    itemsInCart: [],
};
