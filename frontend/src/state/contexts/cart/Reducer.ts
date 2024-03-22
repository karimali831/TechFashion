import { createReducer } from "@reduxjs/toolkit";
import {
    OpenCartAccountModalAction,
    OpenCartOverlayAction,
    SetGuestCheckoutAction,
} from "./Actions";
import { cartInitialState } from "./ICartState";

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
        });
});
