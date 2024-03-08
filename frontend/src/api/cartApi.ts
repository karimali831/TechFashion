import { baseApi } from "./baseApi";

export const getTokenFromLocalStorage = () => localStorage.getItem("token");

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getWidgets: builder.query<ITest, number>({
            query: (period) => `Dashboard/GetWidgets/${period}`,
        }),
        getCharts: builder.query<ITest, ITest>({
            query: (request) => ({
                url: "Dashboard/GetCharts",
                method: "POST",
                body: request,
            }),
            providesTags: ["Charts"],
        }),

        addEvent: builder.mutation<void, Omit<ITest, "id">>({
            query: (body) => ({
                url: "Dashboard/AddEvent",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Activity"],
        }),
        setPrivacyMode: builder.mutation<void, boolean>({
            query: (enabled) => ({
                url: `Dashboard/SetPrivacyMode/${enabled}`,
                method: "GET",
            }),
            invalidatesTags: ["UserInfo"],
        }),
    }),
});

export const {
    useGetWidgetsQuery,
    useGetChartsQuery,
    useAddEventMutation,
    useSetPrivacyModeMutation,
} = cartApi;

export interface ITest {}
