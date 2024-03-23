import { combineReducers } from "@reduxjs/toolkit";
import { cartReducer } from "./contexts/cart/Reducer";
import { cartApi } from "src/api/cartApi";
import { productApi } from "src/api/productApi";
import { productReducer } from "./contexts/product/Reducer";
import { userReducer } from "./contexts/user/Reducer";
import { userApi } from "src/api/userApi.ts";

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    product: productReducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
});

export default rootReducer;
