import { createAction } from "@reduxjs/toolkit";
import {
    DashboardDirection,
    DashboardLayout,
    IDateRangeFilter,
    INotification,
    SideNavColor,
} from "./IDashboardState";
import { RecentType } from "src/enum/RecentType";
import { ChartPeriod } from "src/enum/ChartPeriod";

const SetMiniSideNavActionAction = createAction<boolean>(
    "@@Dashboard/SetMiniSideNav"
);

const SetTransparentSideNavAction = createAction<boolean>(
    "@@Dashboard/SettransparentSideNav"
);
const SetWhiteSideNavAction = createAction<boolean>(
    "@@Dashboard/SetWhiteSideNav"
);
const SetSideNavColorAction = createAction<SideNavColor>(
    "@@Dashboard/SetSideNavColor"
);
const SetTransparentNavbarAction = createAction<boolean>(
    "@@Dashboard/SetTransparentNavbar"
);
const SetFixedNavbarAction = createAction<boolean>(
    "@@Dashboard/SetFixedNavbarAction"
);
const SetOpenConfiguratorAction = createAction<boolean>(
    "@@Dashboard/SetOpenConfigurator"
);
const SetOpenAddItemAction = createAction<boolean>(
    "@@Dashboard/SetOpenAddItem"
);
const SetDirectionAction = createAction<DashboardDirection>(
    "@@Dashboard/SetDirection"
);
const SetLayoutAction = createAction<DashboardLayout>("@@Dashboard/SetLayout");
const SetDarkModeAction = createAction<boolean>(
    "@@Dashboard/SetDarkModeAction"
);
const SetNotificationAction = createAction<INotification>(
    "@@Dashboard/SetNotification"
);
const SetRecentTypeAction = createAction<RecentType>(
    "@@Dashboard/SetRecentType"
);
const SetPeriodAction = createAction<number>("@@Dashboard/SetPeriod");
const SetChartPeriodAction = createAction<ChartPeriod>(
    "@@Dashboard/SetchartPeriod"
);
const SetDateRangeFilterAction = createAction<IDateRangeFilter | null>(
    "@@Dashboard/SetDateRangeFilter"
);
const ShowCalendarAction = createAction<boolean>("@@Dashboard/ShowCalendar");

export {
    SetMiniSideNavActionAction,
    SetTransparentSideNavAction,
    SetWhiteSideNavAction,
    SetSideNavColorAction,
    SetTransparentNavbarAction,
    SetFixedNavbarAction,
    SetOpenConfiguratorAction,
    SetDirectionAction,
    SetLayoutAction,
    SetDarkModeAction,
    SetOpenAddItemAction,
    SetNotificationAction,
    SetRecentTypeAction,
    SetPeriodAction,
    SetChartPeriodAction,
    ShowCalendarAction,
    SetDateRangeFilterAction,
};
