import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApiUrl } from "./baseApi";
import { IProductDetail } from "src/interface/IProductDetail";
import { IProductCatalogue } from "src/interface/IProductCatalogue";

export const productApi = createApi({
    reducerPath: "productApi",
    tagTypes: ["Activity"],
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl,
        // headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    }),
    endpoints: (builder) => ({
        getProduct: builder.query<IProductResponse, void>({
            query: () => "Product",
        }),
    }),
});

export const { useGetProductQuery } = productApi;

export interface IProductResponse {
    catalogue: IProductCatalogue[];
    details: IProductDetail[];
}
