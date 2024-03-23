import { createAction } from "@reduxjs/toolkit";
import { IFirebaseUser } from "./IUserState";
import { IUser } from "src/data/IUser";

const FirebaseAuthEmptyAction = createAction("@@User/FirebaseAuthEmptyAction");
const FirebaseAuthenticatedAction = createAction<IFirebaseUser>(
    "@@User/FirebaseAuthenticated"
);
const SigninLoadingAction = createAction<boolean>("@@User/SigninLoading");
const LoginSuccessAction = createAction<IUser>("@@User/LoginSuccess");
const SetFirebaseUidAction = createAction<string>("@@User/SetFirebaseUid");
const SignOutAction = createAction("@@User/SignOutAction");

export {
    FirebaseAuthEmptyAction,
    FirebaseAuthenticatedAction,
    LoginSuccessAction,
    SigninLoadingAction,
    SignOutAction,
    SetFirebaseUidAction,
};
