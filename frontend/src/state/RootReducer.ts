import { combineReducers } from "@reduxjs/toolkit";
import { cartReducer } from "./contexts/cart/Reducer";
import { cartApi } from "src/api/cartApi";

const rootReducer = combineReducers({
    cart: cartReducer,
    [cartApi.reducerPath]: cartApi.reducer,
});

export default rootReducer;
