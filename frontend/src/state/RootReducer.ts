import { combineReducers } from "@reduxjs/toolkit";
import { cartReducer } from "./contexts/cart/Reducer";
import { cartApi } from "src/api/cartApi";
import { productApi } from "src/api/productApi";
import { productReducer } from "./contexts/product/Reducer";
import { userReducer } from "./contexts/user/Reducer";
import { userApi } from "src/api/userApi";
import { appReducer } from "./contexts/app/Reducer";
import { orderApi } from "src/api/orderApi";

const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
    cart: cartReducer,
    product: productReducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
});

export default rootReducer;
