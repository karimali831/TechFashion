export interface ICartState {
    openOverlay: boolean;
    // paymentIntentLoading: boolean;
    // paymentIntentErrorMsg: string | null;
    // paymentIntentClientSecret: string | undefined;
    // paymentAmount: string | undefined;
    // paymentDiscountedAmount: string | undefined;
    // coupon: string | undefined;
}

export const cartInitialState: ICartState = {
    openOverlay: false,
    // paymentIntentLoading: false,
    // paymentIntentErrorMsg: null,
    // paymentIntentClientSecret: undefined,
    // paymentAmount: undefined,
    // paymentDiscountedAmount: undefined,
    // coupon: undefined,
};
