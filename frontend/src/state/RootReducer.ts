import { combineReducers } from "@reduxjs/toolkit";
import { dashboardReducer } from "./contexts/dashboard/Reducer";
import { dashboardApi } from "../api/dashboardApi";

const rootReducer = combineReducers({
    dashboard: dashboardReducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
});

export default rootReducer;
