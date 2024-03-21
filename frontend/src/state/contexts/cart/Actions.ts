import { createAction } from "@reduxjs/toolkit";

const OpenCartOverlayAction = createAction<boolean>("@@Cart/OpenCartOverlay");

export { OpenCartOverlayAction };
