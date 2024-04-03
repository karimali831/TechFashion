import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApiUrl } from "./baseApi";
import { IOrderHistory } from "src/data/IOrderHistory";

export const orderApi = createApi({
    reducerPath: "orderApi",
    tagTypes: [""],
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl + "Order/",
    }),
    endpoints: (builder) => ({
        getOrder: builder.query<IOrderHistory, string>({
            query: (paymentIntentId) => ({
                url: `Get/${paymentIntentId}`,
                method: "GET",
            }),
        }),
        getOrderedItems: builder.query<IOrderHistory[], number>({
            query: (orderRef) => ({
                url: `GetOrderedItems/${orderRef}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetOrderQuery, useGetOrderedItemsQuery } = orderApi;
