import { Page } from "src/enum/Page";
import { IStoreState } from "src/state/IStoreState";

export const getAppState = (state: IStoreState) => state.app;
export const getPage = (state: IStoreState): Page => state.app.page;
