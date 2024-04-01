import { IGuestCheckout } from "src/interface/IGuestCheckout";

export interface ICartState {
    openOverlay: boolean;
    openAccountModal: boolean;
    guestCheckout: IGuestCheckout | null;
    updatingProductId: number | null;
    openVerifyEmailModal: boolean;
    openSelectAddressModal: boolean;
    addressId: number;
}

export const initialiseGuestCheckout: IGuestCheckout = {
    id: window.crypto.randomUUID(),
    email: "",
};

export const cartInitialState: ICartState = {
    openOverlay: false,
    openAccountModal: false,
    guestCheckout: initialiseGuestCheckout,
    updatingProductId: null,
    openVerifyEmailModal: false,
    openSelectAddressModal: false,
    addressId: 0,
};
