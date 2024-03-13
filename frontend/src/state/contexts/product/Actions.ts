import { createAction } from "@reduxjs/toolkit";
import { IProductDetail } from "src/interface/IProductDetail";

const SelectedProductAction = createAction<IProductDetail[]>(
    "@@Product/SelectedProduct"
);

export { SelectedProductAction };
