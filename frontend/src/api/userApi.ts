import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IApiResponse, baseApiUrl } from "./baseApi";
import { IUser } from "src/data/IUser";
import { ICustomerAddress } from "src/data/ICustomerAddress";
import { IAccount } from "src/interface/IAccount";

export const userApi = createApi({
    reducerPath: "userApi",
    tagTypes: ["AccountDetails"],
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl,
    }),
    endpoints: (builder) => ({
        accountDetails: builder.query<IAccount, number>({
            query: (userId) => ({
                url: `User/AccountDetails/${userId}`,
                method: "GET",
            }),
            providesTags: ["AccountDetails"],
        }),
        createUser: builder.mutation<IApiResponse<IUser>, ICreateUserRequest>({
            query: (body) => ({
                url: "User/Create",
                method: "POST",
                body,
            }),
        }),
        addOrUpdateAddress: builder.mutation<
            IApiResponse<boolean>,
            ICustomerAddress
        >({
            query: (body) => ({
                url: "User/AddOrUpdateAddress",
                method: "POST",
                body,
            }),
            invalidatesTags: ["AccountDetails"],
        }),
        deleteAddress: builder.mutation<IApiResponse<boolean>, number>({
            query: (id) => ({
                url: `User/DeleteAddress/${id}`,
                method: "GET",
            }),
            invalidatesTags: ["AccountDetails"],
        }),
    }),
});

export const {
    useAccountDetailsQuery,
    useCreateUserMutation,
    useAddOrUpdateAddressMutation,
    useDeleteAddressMutation,
} = userApi;

export interface ICreateUserRequest {
    email: string;
    guestCheckoutId?: string;
    firebaseUid: string;
    name: string;
}

export interface IVerificationEmail {
    sent: boolean;
    verified: boolean;
    fullAccountExists: boolean;
}

export interface IVerificationEmailRequest {
    email: string;
    send: boolean;
    guestCheckoutId?: string;
    firebaseUid?: string;
}
