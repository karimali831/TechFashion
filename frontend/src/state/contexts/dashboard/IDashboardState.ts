import { ChartPeriod } from "src/enum/ChartPeriod";
import { RecentType } from "src/enum/RecentType";
import { FormValueType } from "src/types/FormTypes";

export interface IDashboardState {
    miniSideNav: boolean;
    transparentSideNav: boolean;
    whiteSideNav: boolean;
    sideNavColor: SideNavColor;
    transparentNavbar: boolean;
    fixedNavbar: boolean;
    openConfigurator: boolean;
    openAddItem: boolean;
    direction: DashboardDirection;
    layout: DashboardLayout;
    darkMode: boolean;
    notification: INotification | null;
    recentType: RecentType;
    period: number;
    chartPeriod: ChartPeriod;
    dateRangeFilter: IDateRangeFilter | null;
    showCalendar: boolean;
}

export const dashboardInitialState: IDashboardState = {
    miniSideNav: false,
    transparentSideNav: false,
    whiteSideNav: false,
    sideNavColor: "info",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
    openAddItem: false,
    direction: "ltr",
    layout: "dashboard",
    darkMode: false,
    notification: null,
    recentType: RecentType.Bills,
    period: 0,
    chartPeriod: ChartPeriod.Last3Months,
    showCalendar: false,
    dateRangeFilter: {
        fromDate: "",
        toDate: "",
    },
};

export interface IDateRangeFilter {
    fromDate: FormValueType;
    toDate: FormValueType;
}

export type DashboardDirection = "rtl" | "ltr";
export type DashboardLayout = "dashboard" | "vr" | "page";
export type SideNavColor =
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "light"
    | "dark";

export interface INotification {
    title: string;
    content: string;
    dateTime?: string;
    color?: SideNavColor | "info";
    icon?: string | "notifications";
    error?: boolean;
    success?: boolean;
}
