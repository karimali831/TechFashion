import { createAction } from "@reduxjs/toolkit";
import { IProductInfo } from "src/interface/IProductInfo";

const SelectedProductAction = createAction<IProductInfo | null>(
    "@@Product/SelectedProduct"
);

export { SelectedProductAction };
