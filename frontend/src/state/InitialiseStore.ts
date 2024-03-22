import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./RootReducer";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";

import { cartApi } from "src/api/cartApi";
import { productApi } from "src/api/productApi";
import storage from "redux-persist/lib/storage";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../config/firebase";
// import {
//     FirebaseAuthEmptyAction,
//     FirebaseAuthenticatedAction,
// } from "./contexts/user/Actions";

const persistConfig: any = {
    key: "root",
    whitelist: ["cart"],
    // blacklist: [],

    storage,
};

export const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    devTools: import.meta.env.NODE_ENV !== "production",
    // ? Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }).concat([cartApi.middleware, productApi.middleware]),
});

// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         store.dispatch(FirebaseAuthenticatedAction(user));
//     } else {
//         store.dispatch(FirebaseAuthEmptyAction);
//     }
// });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
