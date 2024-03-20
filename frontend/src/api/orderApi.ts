import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApiUrl } from "./baseApi";

export const orderApi = createApi({
    reducerPath: "orderApi",
    tagTypes: [""],
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl,
    }),
    endpoints: (builder) => ({
        createPaymentIntent: builder.query<
            IPaymentIntentResponse,
            IPaymentIntentRequest
        >({
            query: (body) => ({
                url: "Order/CreatePaymentIntent",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useCreatePaymentIntentQuery } = orderApi;

export interface IPaymentIntentRequest {
    firebaseUid?: string;
    guestEmail?: string;
    promoCode?: string;
}

export interface IPaymentIntentResponse {
    clientSecret: string | null;
    errorMsg: string | null;
    coupon: string | null;
    discountedAmount: string | null;
    amount: string | null;
}
