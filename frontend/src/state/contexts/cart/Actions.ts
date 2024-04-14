import { createAction } from "@reduxjs/toolkit";
import { IGuestCheckout } from "src/interface/IGuestCheckout";

const OpenCartOverlayAction = createAction<boolean>("@@Cart/OpenCartOverlay");
const OpenCartAccountModalAction = createAction<boolean>(
    "@@Cart/OpenCartAccountModal"
);
const SetGuestCheckoutAction = createAction<IGuestCheckout | null>(
    "@@Cart/SetGuestCheckout"
);
const UpdatingProductIdAction = createAction<number | null>(
    "@@Cart/UpdatingProductId"
);
const OpenSelectAddressModalAction = createAction<boolean>(
    "@@Cart/OpenSelectAddressModal"
);
const ResetGuestCheckoutAction = createAction("@@Cart/ResetGuestCheckout");

const SetAddressIdAction = createAction<number>("@@Cart/SetAddressId");

export {
    OpenCartOverlayAction,
    OpenCartAccountModalAction,
    SetGuestCheckoutAction,
    ResetGuestCheckoutAction,
    UpdatingProductIdAction,
    OpenSelectAddressModalAction,
    SetAddressIdAction,
};
