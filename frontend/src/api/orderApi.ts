import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApiUrl } from "./baseApi";
import { IOrderDetail } from "src/data/IOrderDetail";

export const orderApi = createApi({
    reducerPath: "orderApi",
    tagTypes: [""],
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl + "Order/",
    }),
    endpoints: (builder) => ({
        getOrder: builder.query<IOrderDetail, number>({
            query: (id) => ({
                url: `Get/${id}`,
                method: "GET",
            }),
        }),
        getOrderByRef: builder.query<IOrderDetail, string>({
            query: (ref) => ({
                url: `GetByRef/${ref}`,
                method: "GET",
            }),
        }),
        getOrderedItems: builder.query<IOrderDetail[], number>({
            query: (orderRef) => ({
                url: `GetOrderedItems/${orderRef}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetOrderQuery,
    useGetOrderByRefQuery,
    useGetOrderedItemsQuery,
} = orderApi;
