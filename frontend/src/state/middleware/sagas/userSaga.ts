import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
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
import { ShowPageAction } from "src/state/contexts/app/Actions";
import { Page } from "src/enum/Page";
import { auth } from "src/config/firebase";
import { IAxiosResponse, baseApiUrl } from "src/api/baseApi";

export default function* userApiSaga() {
    yield takeLatest(FirebaseAuthenticatedAction.type, firebaseAuthenticated);
    yield takeLatest(FirebaseAuthEmptyAction.type, userLoggedOut);
    yield takeLatest(SignOutAction.type, signOut);
}

export function* userLoggedOut() {
    yield put(ShowPageAction(Page.Login));
}

export function* firebaseAuthenticated(action: PayloadAction<string>) {
    try {
        const response: IAxiosResponse<IUser> = yield call(
            axios.get,
            baseApiUrl + `User/Get/${action.payload}`
        );

        yield put(SetFirebaseUidAction(action.payload));
        yield put(LoginSuccessAction(response.data));
    } catch (e) {
        toast.error("An error occurred");
    }
}

export function* signOut() {
    try {
        auth.signOut();
    } catch (e: any) {
        // yield put(AxiosErrorAlertAction(e as IAxiosError))
    }
}
