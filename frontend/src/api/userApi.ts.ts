import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IApiResponse, baseApiUrl } from "./baseApi";
export const userApi = createApi({
    reducerPath: "userApi",
    tagTypes: ["Activity"],
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl,
    }),
    endpoints: (builder) => ({
        createUser: builder.mutation<IApiResponse<string>, ICreateUserRequest>({
            query: (body) => ({
                url: "User/Create",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useCreateUserMutation } = userApi;

export interface ICreateUserRequest {
    email: string;
    guestCheckoutId?: string;
    firebaseUid: string;
    name: string;
}
