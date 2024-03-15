import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import { baseApiUrl } from "./baseApi";
import { IProductVariantObj } from "src/interface/IProductVariantObj";

export const cartApi = createApi({
    reducerPath: "cartApi",
    tagTypes: ["Cart"],
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl,
        // headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    }),
    endpoints: (builder) => ({
        getCart: builder.query<ICartResponse, void>({
            query: () => "Cart",
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
            invalidatesTags: ["Cart"],
        }),
        addProductToCart: builder.mutation<void, IAddProductToCartRequest>({
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

export interface IAddProductToCartRequest {
    cartId: number;
    quantity: number;
    productId: number;
    variant?: IProductVariantObj[];
}

export const {
    useGetCartQuery,
    useUpdateProductQuantityMutation,
    useAddProductToCartMutation,
    useRemoveProductFromCartMutation,
} = cartApi;
