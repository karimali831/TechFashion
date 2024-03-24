import { put, select, takeLatest } from "redux-saga/effects";
import { Page } from "../../../enum/Page";
import { toast } from "react-hot-toast";
import { history } from "../../../state/InitialiseStore";
import {
    GoBackAction,
    LocationChangeAction,
    ShowPageAction,
} from "../../contexts/app/Actions";
import { getUserAuth } from "../../contexts/user/Selectors";
import { PayloadAction } from "@reduxjs/toolkit";
import { getPage } from "src/state/contexts/app/Selectors";
import { AppRoutes } from "src/router/Routes";

export default function* navigationSaga() {
    yield takeLatest(ShowPageAction.type, navigateToScreen);
    yield takeLatest(GoBackAction.type, navigatePreviousScreen);
    yield takeLatest(LocationChangeAction.type, locationChange);
}

export function* locationChange() {
    const page: Page = yield select(getPage);
    const currentLocation = history.location.pathname;
    const currentRoute = AppRoutes.filter(
        (x) => x.url === currentLocation.toLowerCase()
    )[0];

    // user accessing app from non default screen for first time
    if (currentRoute != null && page !== currentRoute.page) {
        yield put(ShowPageAction(currentRoute.page));
    }
}

export function* navigateToScreen(route: PayloadAction<Page>) {
    try {
        const auth: boolean = yield select(getUserAuth);
        const newLocation = AppRoutes.filter(
            (x) => x.page === route.payload
        )[0];
        const currentLocation = history.location.pathname;

        if (newLocation.url === currentLocation) {
            window.scrollTo(0, 0);
            return;
        }

        if (newLocation.memberOnly && !auth) {
            const defaultLocationUrl = AppRoutes.filter(
                (x) => x.page === Page.Home
            )[0].url;

            history.replace(defaultLocationUrl);
        }

        history.push(newLocation.url);

        // if (replace) {
        //     history.replace(newLocation.url)
        // } else {
        //     history.push(newLocation.url)
        // }
    } catch {
        toast.error("Error navigating you");
    }
}

export function* navigatePreviousScreen() {
    // yield put(goBack());
}
