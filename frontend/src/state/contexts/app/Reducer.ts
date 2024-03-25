import { createReducer } from "@reduxjs/toolkit";

import { appInitialState } from "./IAppState";
import { ShowPageAction, ShowPageWithParamsAction } from "./Actions";

export const appReducer = createReducer(appInitialState, (builder) => {
    builder.addCase(ShowPageAction, (state, action) => {
        state.page = action.payload;
    });
    builder.addCase(ShowPageWithParamsAction, (state, action) => {
        state.page = action.payload.page;
    });
});
