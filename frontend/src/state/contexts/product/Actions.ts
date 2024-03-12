import { createAction } from "@reduxjs/toolkit";
import { IProductCatalogue } from "src/interface/IProductCatalogue";

const SelectedProductAction = createAction<IProductCatalogue | null>(
    "@@Product/SelectedProduct"
);

export { SelectedProductAction };
