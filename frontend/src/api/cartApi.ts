import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import { IGuestCheckout } from "src/interface/IGuestCheckout";
import { IApiResponse, baseApiUrl } from "./baseApi";

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
            IApiResponse<number>,
            { id: number; quantity: number; replinish: boolean }
        >({
            query: ({ id, quantity, replinish }) => ({
                url: `Cart/UpdateProductQuantity/${id}/${quantity}/${replinish}`,
                method: "GET",
            }),
            invalidatesTags: ["Cart", "PaymentIntent"],
        }),
        addProductToCart: builder.mutation<
            IApiResponse<number>,
            IAddProductToCartRequest
        >({
            query: (body) => ({
                url: "Cart/AddProduct",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Cart", "PaymentIntent"],
        }),
        removeProductFromCart: builder.mutation<IApiResponse<number>, number>({
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
    showGuestCheckout: boolean;
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
    orderId: number;
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
