import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./RootReducer";
import { cartApi } from "src/api/cartApi";
import { productApi } from "src/api/productApi";
import { orderApi } from "src/api/orderApi";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../config/firebase";
// import {
//     FirebaseAuthEmptyAction,
//     FirebaseAuthenticatedAction,
// } from "./contexts/user/Actions";

const store = configureStore({
    reducer: rootReducer,
    devTools: import.meta.env.NODE_ENV !== "production",
    // ? Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([
            cartApi.middleware,
            productApi.middleware,
            orderApi.middleware,
        ]),
});

// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         store.dispatch(FirebaseAuthenticatedAction(user));
//     } else {
//         store.dispatch(FirebaseAuthEmptyAction);
//     }
// });

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;
