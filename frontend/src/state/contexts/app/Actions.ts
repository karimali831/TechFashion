import { createAction } from "@reduxjs/toolkit";
import { Page } from "../../../enum/Page";

// ACTION CREATORS
const LocationChangeAction = createAction("@@App/LocationChange");
const ShowPageAction = createAction<Page>("@@App/ShowPage");
const GoBackAction = createAction("@@App/Goback");

export { ShowPageAction, GoBackAction, LocationChangeAction };
