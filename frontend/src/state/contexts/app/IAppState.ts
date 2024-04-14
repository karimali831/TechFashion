import { Page } from "src/enum/Page";

export interface IWelcome {
    variant: "success" | "default" | "promotion";
    text: string;
}

export interface IAppState {
    page: Page;
    welcomeText: IWelcome;
}

export const appInitialState: IAppState = {
    page: Page.Home,
    welcomeText: {
        variant: "promotion",
        text: "FREE SHIPPING FOR ORDERS OVER £39",
    },
};
