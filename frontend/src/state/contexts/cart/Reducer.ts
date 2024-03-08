import { createReducer } from "@reduxjs/toolkit";
import {
    OpenCartOverlayAction,
    AddToCartAction,
    RemoveFromCartAction,
    UpdateProductCartQuantityAction,
} from "./Actions";
import { cartInitialState } from "./ICartState";

export const cartReducer = createReducer(cartInitialState, (builder) => {
    builder.addCase(OpenCartOverlayAction, (state, action) => {
        state.openOverlay = action.payload;
    });
    builder.addCase(AddToCartAction, (state, action) => {
        state.itemsInCart = [...state.itemsInCart, action.payload];
    });
    builder.addCase(RemoveFromCartAction, (state, action) => {
        state.itemsInCart = state.itemsInCart.filter(
            (x) => x.id !== action.payload
        );
    });
    builder.addCase(UpdateProductCartQuantityAction, (state, action) => {
        const { id, quantity, price } = action.payload;
        const copy = [...state.itemsInCart];

        state.itemsInCart = copy.map((x) => {
            if (x.id === id) {
                return { ...x, quantity, price };
            }

            return { ...x };
        });
    });
});
