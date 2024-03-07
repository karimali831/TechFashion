// import { createReducer } from '@reduxjs/toolkit'
// import {
//     CamToggleAction,
//     DJReadyAction,
//     FirebaseAuthEmptyAction,
//     GetPaymentsAction,
//     GetPaymentsFailureAction,
//     GetPaymentsSuccessAction,
//     GetPromotionsAction,
//     GetPromotionsFailureAction,
//     GetPromotionsSuccessAction,
//     GetUserSuccessAction,
//     LoginSuccessAction,
//     SetFirebaseUidAction,
//     SigninLoadingAction,
//     UpdateUserInfoSuccessAction
// } from './Actions'
// import { userInitialState } from './IUserState'
// export const userReducer = createReducer(userInitialState, (builder) => {
//     builder
//         .addCase(SigninLoadingAction, (state, action) => {
//             state.signingIn = action.payload
//         })
//         .addCase(LoginSuccessAction, (state, action) => {
//             state.user = action.payload
//             state.signingIn = false
//             state.authSuccess = true
//         })
//         .addCase(GetUserSuccessAction, (state, action) => {
//             state.user = action.payload

//             // if (!!state.user) {
//             //     const user: IUser = {
//             //         ...state.user,
//             //         purchasedTokens: action.payload
//             //     }

//             //     state.user = user;
//             // }
//         })
//         .addCase(SetFirebaseUidAction, (state, action) => {
//             state.firebaseUid = action.payload
//         })
//         .addCase(UpdateUserInfoSuccessAction, (state, action) => {
//             state.user = Object.assign({}, state.user, {
//                 [action.payload.updatedKey]: action.payload.updatedValue
//             })
//         })
//         .addCase(FirebaseAuthEmptyAction, (state) => {
//             state.user = null
//             state.authSuccess = false
//         })
//         .addCase(CamToggleAction, (state) => {
//             state.camOn = !state.camOn
//         })
//         .addCase(DJReadyAction, (state, action) => {
//             state.djReady = action.payload
//         })
//         .addCase(GetPromotionsSuccessAction, (state, action) => {
//             state.promotions = action.payload
//             state.loadingPromoCodes = false
//         })
//         .addCase(GetPromotionsFailureAction, (state, action) => {
//             state.promotions = []
//             state.loadingPromoCodes = false
//             state.promotionsFailure = action.payload
//         })
//         .addCase(GetPromotionsAction, (state) => {
//             state.loadingPromoCodes = true
//         })
//         .addCase(GetPaymentsSuccessAction, (state, action) => {
//             state.payments = action.payload
//             state.loadingPayments = false
//             state.paymentsFailure = null
//         })
//         .addCase(GetPaymentsAction, (state) => {
//             state.loadingPayments = true
//         })
//         .addCase(GetPaymentsFailureAction, (state, action) => {
//             state.payments = []
//             state.loadingPayments = false
//             state.paymentsFailure = action.payload
//         })
// })
