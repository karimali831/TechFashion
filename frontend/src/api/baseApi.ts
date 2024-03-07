import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const { DEV } = import.meta.env;

const rootUrl: string = DEV ? "https://localhost:7278" : window.location.origin;

// initialize an empty api service that we'll inject endpoints into later as needed
export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${rootUrl}/api/`,
        // headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    }),
    tagTypes: ["Activity", "BillsAndTransactions", "Charts", "UserInfo"],
    endpoints: () => ({}),
});
