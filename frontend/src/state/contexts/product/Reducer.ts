import { createReducer } from "@reduxjs/toolkit";
import { productInitialState } from "./IProductState";
import { SelectedProductAction, SetStockAction } from "./Actions";

export const productReducer = createReducer(productInitialState, (builder) => {
    builder
        .addCase(SelectedProductAction, (state, action) => {
            state.selectedProduct = action.payload;
        })
        .addCase(SetStockAction, (state, action) => {
            state.stock = action.payload;
        });
});
