import { createAction } from "@reduxjs/toolkit";
import { IPaymentIntentResponse } from "src/api/orderApi";

const OpenCartOverlayAction = createAction<boolean>("@@Cart/OpenCartOverlay");

// const CreatePaymentIntentAction = createAction<string | undefined>(
//     "@@Cart/CreatePaymentIntent"
// );
// const CreatePaymentIntentSuccessAction = createAction<IPaymentIntentResponse>(
//     "@@Cart/CreatePaymentIntentSuccess"
// );
// const CreatePaymentIntentFailureAction = createAction<string>(
//     "@@Cart/CreatePaymentIntentFailureAction"
// );

export {
    OpenCartOverlayAction,
    // CreatePaymentIntentAction,
    // CreatePaymentIntentSuccessAction,
    // CreatePaymentIntentFailureAction,
};
