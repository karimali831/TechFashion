export interface ICartState {
    openOverlay: boolean;
    openAccountModal: boolean;
    guestCheckoutId: string | null;
    guestCheckoutEmail: string;
}

export const cartInitialState: ICartState = {
    openOverlay: false,
    openAccountModal: false,
    guestCheckoutId: null,
    guestCheckoutEmail: "",
};
