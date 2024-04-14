import { IGuestCheckout } from "src/interface/IGuestCheckout";

export interface ICartState {
    openOverlay: boolean;
    guestCheckout: IGuestCheckout | null;
    updatingProductId: number | null;
    openSelectAddressModal: boolean;
    addressId: number;
}

export const initialiseGuestCheckout: IGuestCheckout = {
    id: window.crypto.randomUUID(),
    email: "",
};

export const cartInitialState: ICartState = {
    openOverlay: false,
    guestCheckout: initialiseGuestCheckout,
    updatingProductId: null,
    openSelectAddressModal: false,
    addressId: 0,
};
