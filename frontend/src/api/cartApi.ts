import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import { baseApiUrl } from "./baseApi";
import { IGuestCheckout } from "src/interface/IGuestCheckout";

export const cartApi = createApi({
    reducerPath: "cartApi",
    tagTypes: ["Cart", "PaymentIntent"],
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl,
        // headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    }),
    endpoints: (builder) => ({
        getCart: builder.query<ICartResponse, ICartUserRequest>({
            query: (body) => ({
                url: "Cart/GetBasket",
                method: "POST",
                body,
            }),
            providesTags: ["Cart"],
        }),
        updateProductQuantity: builder.mutation<
            void,
            { id: number; quantity: number }
        >({
            query: ({ id, quantity }) => ({
                url: `Cart/UpdateProductQuantity/${id}/${quantity}`,
                method: "GET",
            }),
            invalidatesTags: ["Cart", "PaymentIntent"],
        }),
        addProductToCart: builder.mutation<void, IAddProductToCartRequest>({
            query: (body) => ({
                url: "Cart/AddProduct",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Cart", "PaymentIntent"],
        }),
        removeProductFromCart: builder.mutation<void, number>({
            query: (id) => ({
                url: `Cart/RemoveProduct/${id}`,
                method: "GET",
            }),
            invalidatesTags: ["Cart", "PaymentIntent"],
        }),
        createPaymentIntent: builder.query<
            IPaymentIntentResponse,
            IPaymentIntentRequest
        >({
            query: (body) => ({
                url: "Cart/CreatePaymentIntent",
                method: "POST",
                body,
            }),
            providesTags: ["PaymentIntent"],
        }),
    }),
});

export interface ICartUserRequest {
    firebaseUid?: string;
    guestCheckoutId?: string;
}

export interface ICartProductQuantityRequest {
    id: number;
    quantity: number;
}

export interface ICartResponse {
    id: number;
    products: ICartProductDetail[];
    total: number;
    totalStr: string;
}

export interface IAddProductToCartRequest {
    cartUser: ICartUserRequest;
    quantity: number;
    productId: number;
    variantId?: number;
}

export interface IPaymentIntentRequest {
    cartId: number;
    addressId?: number;
    firebaseUid?: string;
    guestUser?: IGuestCheckout;
    promoCode?: string;
}

export interface IPaymentIntentResponse {
    clientSecret: string | null;
    errorMsg: string | null;
    coupon: string | null;
    discountedAmount: string | null;
    amount: string | null;
}

export const {
    useGetCartQuery,
    useUpdateProductQuantityMutation,
    useAddProductToCartMutation,
    useRemoveProductFromCartMutation,
    useCreatePaymentIntentQuery,
} = cartApi;
