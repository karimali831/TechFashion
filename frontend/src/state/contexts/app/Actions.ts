import { createAction } from "@reduxjs/toolkit";
import { Page } from "../../../enum/Page";
import { IWelcome } from "./IAppState";

export interface IPageParam {
    page: Page;
    primaryId: string;
    secondaryId?: string;
}

// ACTION CREATORS
const LocationChangeAction = createAction("@@App/LocationChange");
const ShowPageAction = createAction<Page>("@@App/ShowPage");
const ShowPageWithParamsAction = createAction<IPageParam>(
    "@@App/ShowPageWithParams"
);
const GoBackAction = createAction("@@App/Goback");
const SetWelcomeTextAction = createAction<IWelcome>("@@App/SetWelcomeText");

export {
    ShowPageAction,
    GoBackAction,
    LocationChangeAction,
    ShowPageWithParamsAction,
    SetWelcomeTextAction,
};
