import { createReducer } from "@reduxjs/toolkit";

import { appInitialState } from "./IAppState";
import {
    SetWelcomeTextAction,
    ShowPageAction,
    ShowPageWithParamsAction,
} from "./Actions";

export const appReducer = createReducer(appInitialState, (builder) => {
    builder
        .addCase(ShowPageAction, (state, action) => {
            state.page = action.payload;
        })
        .addCase(ShowPageWithParamsAction, (state, action) => {
            state.page = action.payload.page;
        })
        .addCase(SetWelcomeTextAction, (state, action) => {
            state.welcomeText = action.payload;
        });
});
