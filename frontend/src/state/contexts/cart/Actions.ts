import { createAction } from "@reduxjs/toolkit";
import { ICartProduct } from "src/data/ICartProduct";

const OpenCartOverlayAction = createAction<boolean>("@@Cart/OpenCartOverlay");
const AddToCartAction = createAction<ICartProduct>("@@Cart/AddToCart");
const RemoveFromCartAction = createAction<number>("@@Cart/RemoveFromCart");
const UpdateProductCartQuantityAction = createAction<{
    id: number;
    quantity: number;
    price: string;
}>("@@Cart/UpdateProductCartQuantity");

export {
    OpenCartOverlayAction,
    AddToCartAction,
    RemoveFromCartAction,
    UpdateProductCartQuantityAction,
};
