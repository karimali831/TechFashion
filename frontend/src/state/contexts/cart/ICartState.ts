import { IGuestCheckout } from "src/interface/IGuestCheckout";

export interface ICartState {
    openOverlay: boolean;
    openAccountModal: boolean;
    guestCheckout: IGuestCheckout | null;
}

export const cartInitialState: ICartState = {
    openOverlay: false,
    openAccountModal: false,
    guestCheckout: {
        id: window.crypto.randomUUID(),
        name: "",
        email: "",
    },
};
