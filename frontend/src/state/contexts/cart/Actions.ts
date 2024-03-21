import { createAction } from "@reduxjs/toolkit";

const OpenCartOverlayAction = createAction<boolean>("@@Cart/OpenCartOverlay");

const SetGuestCheckoutIdAction = createAction<string | null>(
    "@@Cart/SetGuestCheckoutId"
);

export { OpenCartOverlayAction, SetGuestCheckoutIdAction };
