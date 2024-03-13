import { createReducer } from "@reduxjs/toolkit";
import { OpenCartOverlayAction } from "./Actions";
import { cartInitialState } from "./ICartState";

export const cartReducer = createReducer(cartInitialState, (builder) => {
    builder.addCase(OpenCartOverlayAction, (state, action) => {
        state.openOverlay = action.payload;
    });
});
