import { createAction } from "@reduxjs/toolkit";
import { Page } from "../../../enum/Page";

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

export {
    ShowPageAction,
    GoBackAction,
    LocationChangeAction,
    ShowPageWithParamsAction,
};
