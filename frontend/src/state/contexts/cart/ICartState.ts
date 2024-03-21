export interface ICartState {
    openOverlay: boolean;
    guestCheckoutId: string;
}

export const cartInitialState: ICartState = {
    openOverlay: false,
    guestCheckoutId: window.crypto.randomUUID(),
};
