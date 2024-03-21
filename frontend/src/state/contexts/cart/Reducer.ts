import { createReducer } from "@reduxjs/toolkit";
import {
    OpenCartAccountModalAction,
    OpenCartOverlayAction,
    SetGuestCheckoutEmailAction,
    SetGuestCheckoutIdAction,
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
        .addCase(SetGuestCheckoutIdAction, (state, action) => {
            state.guestCheckoutId = action.payload;
        })
        .addCase(SetGuestCheckoutEmailAction, (state, action) => {
            state.guestCheckoutEmail = action.payload;
        });
});
