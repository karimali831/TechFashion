import { createReducer } from "@reduxjs/toolkit";
import {
    SetDarkModeAction,
    SetDirectionAction,
    SetFixedNavbarAction,
    SetLayoutAction,
    SetMiniSideNavActionAction,
    SetNotificationAction,
    SetOpenAddItemAction,
    SetOpenConfiguratorAction,
    SetPeriodAction,
    SetRecentTypeAction,
    SetSideNavColorAction,
    SetChartPeriodAction,
    SetTransparentNavbarAction,
    SetTransparentSideNavAction,
    SetWhiteSideNavAction,
    ShowCalendarAction,
    SetDateRangeFilterAction,
} from "./Actions";
import { dashboardInitialState } from "./IDashboardState";
import { ChartPeriod } from "src/enum/ChartPeriod";

export const dashboardReducer = createReducer(
    dashboardInitialState,
    (builder) => {
        builder.addCase(SetMiniSideNavActionAction, (state, action) => {
            state.miniSideNav = action.payload;
        });
        builder.addCase(SetTransparentSideNavAction, (state, action) => {
            state.transparentSideNav = action.payload;
        });
        builder.addCase(SetWhiteSideNavAction, (state, action) => {
            state.whiteSideNav = action.payload;
        });
        builder.addCase(SetSideNavColorAction, (state, action) => {
            state.sideNavColor = action.payload;
        });
        builder.addCase(SetTransparentNavbarAction, (state, action) => {
            state.transparentNavbar = action.payload;
        });
        builder.addCase(SetFixedNavbarAction, (state, action) => {
            state.fixedNavbar = action.payload;
        });
        builder.addCase(SetOpenConfiguratorAction, (state, action) => {
            state.openConfigurator = action.payload;
        });
        builder.addCase(SetOpenAddItemAction, (state, action) => {
            state.openAddItem = action.payload;
        });
        builder.addCase(SetDirectionAction, (state, action) => {
            state.direction = action.payload;
        });
        builder.addCase(SetLayoutAction, (state, action) => {
            state.layout = action.payload;
        });
        builder.addCase(SetDarkModeAction, (state, action) => {
            state.darkMode = action.payload;
        });
        builder.addCase(SetNotificationAction, (state, action) => {
            state.notification = action.payload;
        });
        builder.addCase(SetRecentTypeAction, (state, action) => {
            state.recentType = action.payload;
        });
        builder.addCase(SetPeriodAction, (state, action) => {
            state.period = action.payload;
        });
        builder.addCase(SetDateRangeFilterAction, (state, action) => {
            state.dateRangeFilter = action.payload;

            if (!!action.payload) {
                state.chartPeriod = ChartPeriod.DateRange;
            }
        });
        builder.addCase(SetChartPeriodAction, (state, action) => {
            state.chartPeriod = action.payload;
        });
        builder.addCase(ShowCalendarAction, (state, action) => {
            state.showCalendar = action.payload;
        });
    }
);
