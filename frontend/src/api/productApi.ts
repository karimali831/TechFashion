import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApiUrl } from "./baseApi";

export const productApi = createApi({
    reducerPath: "productApi",
    tagTypes: ["Activity"],
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl,
        // headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    }),
    endpoints: (builder) => ({
        getProduct: builder.query<ITest, number>({
            query: (period) => `Dashboard/GetWidgets/${period}`,
        }),
    }),
});

export const { useGetProductQuery } = productApi;

export interface ITest {}
