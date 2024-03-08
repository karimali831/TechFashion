export interface ICartState {
    openOverlay: boolean;
    itemsInCart: number;
}

export const cartInitialState: ICartState = {
    openOverlay: false,
    itemsInCart: 0,
};
