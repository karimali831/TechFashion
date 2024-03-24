import { createReducer } from "@reduxjs/toolkit";
import {
    FirebaseAuthEmptyAction,
    LoginSuccessAction,
    SetFirebaseUidAction,
    SigninLoadingAction,
} from "./Actions";
import { userInitialState } from "./IUserState";
export const userReducer = createReducer(userInitialState, (builder) => {
    builder
        .addCase(SetFirebaseUidAction, (state, action) => {
            state.firebaseUid = action.payload;
        })
        .addCase(SigninLoadingAction, (state, action) => {
            state.signingIn = action.payload;
        })
        // .addCase(UpdateUserInfoSuccessAction, (state, action) => {
        //     state.user = Object.assign({}, state.user, {
        //         [action.payload.updatedKey]: action.payload.updatedValue
        //     })
        // })
        .addCase(FirebaseAuthEmptyAction, (state) => {
            state.user = null;
            state.authSuccess = false;
        })
        .addCase(LoginSuccessAction, (state, action) => {
            state.user = action.payload;
            state.signingIn = false;
            state.authSuccess = true;
        });
});
