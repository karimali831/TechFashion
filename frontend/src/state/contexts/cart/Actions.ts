import { createAction } from "@reduxjs/toolkit";
import { IGuestCheckout } from "src/interface/IGuestCheckout";

const OpenCartOverlayAction = createAction<boolean>("@@Cart/OpenCartOverlay");
const OpenCartAccountModalAction = createAction<boolean>(
    "@@Cart/OpenCartAccountModal"
);
const SetGuestCheckoutAction = createAction<IGuestCheckout | null>(
    "@@Cart/SetGuestCheckout"
);

export {
    OpenCartOverlayAction,
    OpenCartAccountModalAction,
    SetGuestCheckoutAction,
};
