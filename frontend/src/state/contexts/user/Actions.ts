import { createAction } from "@reduxjs/toolkit";
import { IVerificationEmail } from "src/api/userApi";
import { IUser } from "src/data/IUser";

const FirebaseAuthEmptyAction = createAction("@@User/FirebaseAuthEmptyAction");
const FirebaseAuthenticatedAction = createAction<string>(
    "@@User/FirebaseAuthenticated"
);
const SigninLoadingAction = createAction<boolean>("@@User/SigninLoading");
const LoginSuccessAction = createAction<IUser>("@@User/LoginSuccess");
const SetFirebaseUidAction = createAction<string>("@@User/SetFirebaseUid");
const SignOutAction = createAction("@@User/SignOut");
const SetEmailVerificationAction = createAction<IVerificationEmail>(
    "@@User/SetEmailVerification"
);

export {
    FirebaseAuthEmptyAction,
    FirebaseAuthenticatedAction,
    LoginSuccessAction,
    SigninLoadingAction,
    SignOutAction,
    SetFirebaseUidAction,
    SetEmailVerificationAction,
};
