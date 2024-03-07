import {
    IDashboardState,
    dashboardInitialState,
} from "./contexts/dashboard/IDashboardState";

export interface IStoreState {
    dashboard: IDashboardState;
}

export const StoreState: IStoreState = {
    dashboard: dashboardInitialState,
};
