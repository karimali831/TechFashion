import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApiUrl } from "./baseApi";
import { IUser } from "src/data/IUser";
export const userApi = createApi({
    reducerPath: "userApi",
    tagTypes: ["Activity"],
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl,
    }),
    endpoints: (builder) => ({
        getUserByFirebaseUid: builder.query<IUser, string>({
            query: (firebaseUid) => `User/Get/${firebaseUid}`,
        }),
        createUser: builder.mutation<void, ICreateUserRequest>({
            query: (body) => ({
                url: "User/Create",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useGetUserByFirebaseUidQuery, useCreateUserMutation } = userApi;

export interface ICreateUserRequest {
    email: string;
    firebaseUid: string;
    name: string;
}
