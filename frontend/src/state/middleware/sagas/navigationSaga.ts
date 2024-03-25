import { call, put, select, takeLatest } from "redux-saga/effects";
import { Page } from "../../../enum/Page";
import { toast } from "react-hot-toast";
import { history } from "../../../state/InitialiseStore";
import {
    GoBackAction,
    IPageParam,
    LocationChangeAction,
    ShowPageAction,
    ShowPageWithParamsAction,
} from "../../contexts/app/Actions";
import { getUserAuth } from "../../contexts/user/Selectors";
import { PayloadAction } from "@reduxjs/toolkit";
import { getPage } from "src/state/contexts/app/Selectors";
import { AppRoutes } from "src/router/Routes";

export default function* navigationSaga() {
    yield takeLatest(ShowPageAction.type, navigateToScreen);
    yield takeLatest(ShowPageWithParamsAction, navigateToScreenWithParams);
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

export function* navigateToScreenWithParams(route: PayloadAction<IPageParam>) {
    try {
        yield call(
            navigateToScreen,
            {
                payload: route.payload.page,
                type: route.type,
            },
            route.payload.primaryId,
            route.payload.secondaryId
        );
    } catch {
        toast.error("An erorr occurred");
    }
}

export function* navigateToScreen(
    route: PayloadAction<Page>,
    primaryId?: string,
    secondaryId?: string
) {
    try {
        const auth: boolean = yield select(getUserAuth);
        const newLocation = AppRoutes.filter(
            (x) => x.page === route.payload
        )[0];
        const currentLocation = history.location.pathname;

        if (newLocation.memberOnly && !auth) {
            const defaultLocationUrl = AppRoutes.filter(
                (x) => x.page === Page.Login
            )[0].url;

            history.replace(defaultLocationUrl);
            return;
        }

        if (newLocation.url === currentLocation) {
            window.scrollTo(0, 0);
            return;
        }

        const splitUrl = newLocation.url.split("/");

        if (!!primaryId) {
            if (splitUrl.length === 2) {
                newLocation.url += "/" + primaryId;
            }

            if (!!secondaryId && splitUrl.length === 3) {
                newLocation.url += "/" + secondaryId;
            }
        }

        history.push(newLocation.url);
    } catch {
        toast.error("An erorr occurred");
    }
}

export function* navigatePreviousScreen() {
    // yield put(goBack());
}
