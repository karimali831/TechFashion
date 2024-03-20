import { createReducer } from "@reduxjs/toolkit";
import { OpenCartOverlayAction } from "./Actions";
import { cartInitialState } from "./ICartState";

export const cartReducer = createReducer(cartInitialState, (builder) => {
    builder.addCase(OpenCartOverlayAction, (state, action) => {
        state.openOverlay = action.payload;
    });
    // .addCase(CreatePaymentIntentAction, (state) => {
    //     state.paymentIntentLoading = true;
    // })
    // .addCase(CreatePaymentIntentSuccessAction, (state, action) => {
    //     const { clientSecret, amount, discountedAmount, coupon } =
    //         action.payload;

    //     state.paymentIntentClientSecret = clientSecret;
    //     state.paymentAmount = amount;
    //     state.paymentDiscountedAmount = discountedAmount;
    //     state.coupon = coupon;
    //     state.paymentIntentLoading = false;

    //     if (state.paymentIntentErrorMsg) {
    //         state.paymentIntentErrorMsg = null;
    //     }
    // })
    // .addCase(CreatePaymentIntentFailureAction, (state, action) => {
    //     state.paymentIntentErrorMsg = action.payload;
    //     state.paymentIntentLoading = false;
    // });
});
