import { createAction } from "@reduxjs/toolkit";
import { ICart } from "src/data/ICart";

const OpenCartOverlayAction = createAction<boolean>("@@Cart/OpenCartOverlay");
const AddToCartAction = createAction<ICart>("@@Cart/AddToCart");
const RemoveFromCartAction = createAction<string>("@@Cart/RemoveFromCart");
const UpdateProductCartQuantityAction = createAction<{
    id: string;
    quantity: number;
    price: string;
}>("@@Cart/UpdateProductCartQuantity");

export {
    OpenCartOverlayAction,
    AddToCartAction,
    RemoveFromCartAction,
    UpdateProductCartQuantityAction,
};
