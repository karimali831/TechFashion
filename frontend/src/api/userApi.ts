import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IApiResponse, baseApiUrl } from "./baseApi";
import { IUser } from "src/data/IUser";

export const userApi = createApi({
    reducerPath: "userApi",
    tagTypes: ["Activity"],
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl,
    }),
    endpoints: (builder) => ({
        createUser: builder.mutation<IApiResponse<IUser>, ICreateUserRequest>({
            query: (body) => ({
                url: "User/Create",
                method: "POST",
                body,
            }),
        }),
        sendVerificationEmail: builder.mutation<IApiResponse<boolean>, string>({
            query: (email) => ({
                url: `User/SendVerificationEmail?email=${email}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useCreateUserMutation, useSendVerificationEmailMutation } =
    userApi;

export interface ICreateUserRequest {
    email: string;
    guestCheckoutId?: string;
    firebaseUid: string;
    name: string;
}

export interface IVerificationEmail {
    sent: boolean;
    verified: boolean;
}

export interface IVerificationEmailRequest {
    email: string;
    send: boolean;
}
