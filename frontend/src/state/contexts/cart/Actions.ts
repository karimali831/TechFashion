import { createAction } from "@reduxjs/toolkit";
import { IGuestCheckout } from "src/interface/IGuestCheckout";

const OpenCartOverlayAction = createAction<boolean>("@@Cart/OpenCartOverlay");
const OpenCartAccountModalAction = createAction<boolean>(
    "@@Cart/OpenCartAccountModal"
);
const OpenVerifyEmailModalAction = createAction<boolean>(
    "@@Cart/OpenVerifyEmailModal"
);
const SetGuestCheckoutAction = createAction<IGuestCheckout | null>(
    "@@Cart/SetGuestCheckout"
);
const UpdatingProductIdAction = createAction<number | null>(
    "@@Cart/UpdatingProductId"
);
const ResetGuestCheckoutAction = createAction("@@Cart/ResetGuestCheckout");

export {
    OpenCartOverlayAction,
    OpenCartAccountModalAction,
    SetGuestCheckoutAction,
    ResetGuestCheckoutAction,
    UpdatingProductIdAction,
    OpenVerifyEmailModalAction,
};
