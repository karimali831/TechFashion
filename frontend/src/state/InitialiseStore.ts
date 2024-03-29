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
import { userApi } from "src/api/userApi";
import createSagaMiddleware from "redux-saga";
import { onAuthStateChanged } from "firebase/auth";
import {
    FirebaseAuthEmptyAction,
    FirebaseAuthenticatedAction,
} from "./contexts/user/Actions";
import { auth } from "src/config/firebase";
import { createBrowserHistory } from "history";
import { rootSaga } from "./middleware/sagas/rootSaga";
import { LocationChangeAction } from "./contexts/app/Actions";

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

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
        }).concat([
            // actionToPlainObject,
            sagaMiddleware,
            cartApi.middleware,
            productApi.middleware,
            userApi.middleware,
        ]),
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        store.dispatch(FirebaseAuthenticatedAction(user.uid));
    } else {
        store.dispatch(FirebaseAuthEmptyAction());
    }
});

sagaMiddleware.run(rootSaga);
store.dispatch(LocationChangeAction());

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
