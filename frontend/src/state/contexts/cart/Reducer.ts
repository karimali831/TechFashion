import { createReducer } from "@reduxjs/toolkit";
import { OpenCartOverlayAction, SetGuestCheckoutIdAction } from "./Actions";
import { cartInitialState } from "./ICartState";

export const cartReducer = createReducer(cartInitialState, (builder) => {
    builder
        .addCase(OpenCartOverlayAction, (state, action) => {
            state.openOverlay = action.payload;
        })
        .addCase(SetGuestCheckoutIdAction, (state, action) => {
            state.guestCheckoutId = action.payload;
        });
});
