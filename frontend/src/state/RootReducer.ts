import { combineReducers } from "@reduxjs/toolkit";
import { cartReducer } from "./contexts/cart/Reducer";
import { cartApi } from "src/api/cartApi";
import { productApi } from "src/api/productApi";
import { productReducer } from "./contexts/product/Reducer";

const rootReducer = combineReducers({
    cart: cartReducer,
    product: productReducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
});

export default rootReducer;
