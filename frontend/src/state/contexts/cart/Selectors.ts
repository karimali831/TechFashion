import { useGetCartQuery } from "src/api/cartApi";
import { IStoreState } from "../../IStoreState";
import { ICartProductDetail } from "src/interface/ICartProductDetail";

export const getCartState = (state: IStoreState) => state.cart;

export const getGuestCheckoutId = (state: IStoreState): string | null =>
    state.cart.guestCheckout?.id;

export const getCartItems = (state: IStoreState): ICartProductDetail[] => {
    const firebaseUid = state.user.firebaseUid;
    const guestCheckout = state.cart.guestCheckout;

    const { data } = useGetCartQuery({
        firebaseUid,
        guestCheckoutId: guestCheckout?.id,
    });

    return data?.products ?? [];
};
