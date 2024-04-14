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
import { getUser, getVerificationEmail } from "../../contexts/user/Selectors";
import { PayloadAction } from "@reduxjs/toolkit";
import { getPage } from "src/state/contexts/app/Selectors";
import { AppRoutes } from "src/router/Routes";
import { IUser } from "src/data/IUser";
import { IRoute } from "src/router/Route";
import { getGuestCheckoutId } from "src/state/contexts/cart/Selectors";
import { IVerificationEmail } from "src/api/userApi";
import { IGuestCheckout } from "src/interface/IGuestCheckout";

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

            if (path.length == currentLocation.length) {
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
        const user: IUser | null = yield select(getUser);
        const guestCheckout: IGuestCheckout | null = yield select(
            getGuestCheckoutId
        );
        const verificationEmail: IVerificationEmail = yield select(
            getVerificationEmail
        );

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

        if (
            (user && !user.emailVerified) ||
            (!user &&
                guestCheckout?.email !== "" &&
                !verificationEmail.verified)
        ) {
            const verifyEmailPage = AppRoutes.filter(
                (x) => x.page === Page.VerifyEmail
            )[0].url;
            history.replace(verifyEmailPage);
            return;
        }

        if (newLocation.url === currentLocation) {
            window.scrollTo(0, 0);
            return;
        }

        if (!!primaryId) {
            history.push(newLocation.url + "/" + primaryId);
            return;
        }

        history.push(newLocation.url);
    } catch {
        toast.error("An erorr occurred");
    }
}

export function* navigatePreviousScreen() {
    history.back();
}
