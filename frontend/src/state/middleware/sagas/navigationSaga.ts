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
import { getUserState } from "../../contexts/user/Selectors";
import { PayloadAction } from "@reduxjs/toolkit";
import { getPage } from "src/state/contexts/app/Selectors";
import { AppRoutes } from "src/router/Routes";
import { IRoute } from "src/router/Route";
import { IUserState } from "src/state/contexts/user/IUserState";

export default function* navigationSaga() {
    yield takeLatest(ShowPageAction.type, navigateToScreen);
    yield takeLatest(ShowPageWithParamsAction, navigateToScreenWithParams);
    yield takeLatest(GoBackAction.type, navigatePreviousScreen);
    yield takeLatest(LocationChangeAction.type, locationChange);
}

export function* locationChange() {
    const statePage: Page = yield select(getPage);
    const currentLocation = history.location.pathname.split("/");

    const newPage = currentLocation[1].toLowerCase();
    const primaryId = currentLocation.length > 1 ? currentLocation[2] : null;

    let currentRoute: IRoute = null;

    AppRoutes.map((route) => {
        if (!route.path) {
            if ("/" + newPage == route.url) {
                return (currentRoute = route);
            }
        } else {
            var path = route.path.split("/");

            if (
                path[1] == currentLocation[1] &&
                path.length == currentLocation.length
            ) {
                return (currentRoute = route);
            }
        }
    });

    // user accessing app from non default screen for first time
    if (currentRoute != null && statePage !== currentRoute.page) {
        if (!!primaryId) {
            yield put(
                ShowPageWithParamsAction({
                    page: currentRoute.page,
                    primaryId: primaryId,
                })
            );
        } else {
            yield put(ShowPageAction(currentRoute.page));
        }
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
        const userState: IUserState = yield select(getUserState);
        const user = userState.user;

        const newLocation = AppRoutes.filter(
            (x) => x.page === route.payload
        )[0];

        const currentLocation = history.location.pathname.toLowerCase();

        if (newLocation.memberOnly && !user) {
            const defaultLocationUrl = AppRoutes.filter(
                (x) => x.page === Page.Login
            )[0].url;

            history.replace(defaultLocationUrl);
            return;
        }

        if (user?.firebaseUid && !userState.verificationEmail.verified) {
            const verifyEmailPage = AppRoutes.filter(
                (x) => x.page === Page.VerifyEmail
            )[0].url;
            history.replace(verifyEmailPage);
            return;
        }

        if (newLocation.url === currentLocation) {
            return;
        }

        if (!!primaryId) {
            history.push(newLocation.url + "/" + primaryId);
            return;
        }

        history.push(newLocation.url);
    } catch {
        toast.error("An erorr occurred");
    } finally {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }
}

export function* navigatePreviousScreen() {
    history.back();
}
