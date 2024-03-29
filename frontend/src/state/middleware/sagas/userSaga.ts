import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
    FirebaseAuthEmptyAction,
    FirebaseAuthenticatedAction,
    LoginSuccessAction,
    SetFirebaseUidAction,
    SignOutAction,
} from "src/state/contexts/user/Actions";
import { IUser } from "src/data/IUser";
import { auth } from "src/config/firebase";
import { IAxiosResponse, baseApiUrl } from "src/api/baseApi";
import { ShowPageAction } from "src/state/contexts/app/Actions";
import { Page } from "src/enum/Page";
import { getGuestCheckoutId } from "src/state/contexts/cart/Selectors";
import { ResetGuestCheckoutAction } from "src/state/contexts/cart/Actions";
import { ICartUserRequest } from "src/api/cartApi";

export default function* userApiSaga() {
    yield takeLatest(FirebaseAuthenticatedAction.type, firebaseAuthenticated);
    yield takeLatest(FirebaseAuthEmptyAction.type, userLoggedOut);
    yield takeLatest(SignOutAction.type, signOut);
}

export function* userLoggedOut() {
    try {
        const guestCheckoutId: string | null = yield select(getGuestCheckoutId);

        if (!guestCheckoutId) {
            yield put(ResetGuestCheckoutAction());
        }

        yield put(SetFirebaseUidAction(null));
    } catch (error) {
        console.error(error);
        toast.error("An error occurred");
    }
}

export function* firebaseAuthenticated(action: PayloadAction<string>) {
    try {
        const guestCheckoutId: string | null = yield select(getGuestCheckoutId);

        const response: IAxiosResponse<IUser> = yield call(
            axios.post,
            baseApiUrl + "User/Get",
            {
                firebaseUid: action.payload,
                guestCheckoutId,
            } as ICartUserRequest
        );

        yield put(SetFirebaseUidAction(action.payload));

        if (response?.data) {
            yield put(LoginSuccessAction(response.data));
        }

        // persistor.purge();
    } catch (e) {
        toast.error("An error occurred");
    }
}

export function* signOut() {
    try {
        auth.signOut();
        yield put(ShowPageAction(Page.Home));
    } catch (e: any) {
        console.error(e);
    }
}
