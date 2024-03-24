import { Page } from "src/enum/Page";

export interface IAppState {
    page: Page;
}

export const appInitialState: IAppState = {
    page: Page.Home,
};
