import { Middleware } from "@reduxjs/toolkit";
import { IStoreState } from "../IStoreState";

export const actionToPlainObject: Middleware<IStoreState, any> =
    () => (next) => (action) => {
        if (!action) {
            return;
        }

        return next({ ...action });
    };
