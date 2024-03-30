import { createReducer } from "@reduxjs/toolkit";
import {
    OpenCartAccountModalAction,
    OpenCartOverlayAction,
    OpenVerifyEmailModalAction,
    ResetGuestCheckoutAction,
    SetGuestCheckoutAction,
    UpdatingProductIdAction,
} from "./Actions";
import { cartInitialState, initialiseGuestCheckout } from "./ICartState";

export const cartReducer = createReducer(cartInitialState, (builder) => {
    builder
        .addCase(OpenCartOverlayAction, (state, action) => {
            state.openOverlay = action.payload;
        })
        .addCase(OpenCartAccountModalAction, (state, action) => {
            state.openAccountModal = action.payload;
        })
        .addCase(SetGuestCheckoutAction, (state, action) => {
            state.guestCheckout = action.payload;
        })
        .addCase(ResetGuestCheckoutAction, (state) => {
            state.guestCheckout = initialiseGuestCheckout;
        })
        .addCase(UpdatingProductIdAction, (state, action) => {
            state.updatingProductId = action.payload;
        })
        .addCase(OpenVerifyEmailModalAction, (state, action) => {
            state.openVerifyEmailModal = action.payload;
        });
});
