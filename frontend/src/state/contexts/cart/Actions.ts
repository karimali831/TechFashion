import { createAction } from "@reduxjs/toolkit";

const OpenCartOverlayAction = createAction<boolean>("@@Cart/OpenCartOverlay");
const OpenCartAccountModalAction = createAction<boolean>(
    "@@Cart/OpenCartAccountModal"
);
const SetGuestCheckoutIdAction = createAction<string | null>(
    "@@Cart/SetGuestCheckoutId"
);

const SetGuestCheckoutEmailAction = createAction<string | null>(
    "@@Cart/SetGuestCheckoutEmail"
);

export {
    OpenCartOverlayAction,
    SetGuestCheckoutIdAction,
    OpenCartAccountModalAction,
    SetGuestCheckoutEmailAction,
};
