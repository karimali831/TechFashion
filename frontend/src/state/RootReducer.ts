import { combineReducers } from "@reduxjs/toolkit";
import { cartReducer } from "./contexts/cart/Reducer";
import { cartApi } from "src/api/cartApi";
import { productApi } from "src/api/productApi";
import { productReducer } from "./contexts/product/Reducer";
import { orderApi } from "src/api/orderApi";

const rootReducer = combineReducers({
    cart: cartReducer,
    product: productReducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
});

export default rootReducer;
