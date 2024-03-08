import { createAction } from "@reduxjs/toolkit";
import { IProductCart } from "src/interface/IProductCart";

const OpenCartOverlayAction = createAction<boolean>("@@Cart/OpenCartOverlay");
const AddToCartAction = createAction<IProductCart>("@@Cart/AddToCart");
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
