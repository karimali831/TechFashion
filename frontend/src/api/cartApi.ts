import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApiUrl } from "./baseApi";
import { ICartProduct } from "src/data/ICartProduct";
import { ICartProductDetail } from "src/interface/ICartProductDetail";

export const cartApi = createApi({
    reducerPath: "cartApi",
    tagTypes: ["Activity", "BillsAndTransactions", "Charts", "UserInfo"],
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl,
        // headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    }),
    endpoints: (builder) => ({
        getCart: builder.query<ICartResponse, void>({
            query: () => "Cart",
        }),
        updateProductQuantity: builder.mutation<
            void,
            { id: number; quantity: number }
        >({
            query: ({ id, quantity }) => ({
                url: `Cart/UpdateProductQuantity/${id}/${quantity}`,
                method: "GET",
            }),
        }),
        addProductToCart: builder.mutation<void, ICartProduct>({
            query: (body) => ({
                url: "Cart/AddProduct",
                method: "POST",
                body,
            }),
        }),
        removeProductFromCart: builder.mutation<void, number>({
            query: (id) => ({
                url: `Cart/RemoveProduct/${id}`,
                method: "GET",
            }),
        }),
    }),
});

export interface ICartProductQuantityRequest {
    id: number;
    quantity: number;
}

export interface ICartResponse {
    products: ICartProductDetail[];
    totalStr: string;
}

export const {
    useGetCartQuery,
    useUpdateProductQuantityMutation,
    useAddProductToCartMutation,
    useRemoveProductFromCartMutation,
} = cartApi;
