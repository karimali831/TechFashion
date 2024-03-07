import { FormValueType } from "src/types/FormTypes";
import { PaymentStatus } from "../enum/PaymentStatus";
import { baseApi } from "./baseApi";
import { CategoryType } from "src/enum/CategoryType";
import { ICategory } from "src/models/ICategory";
import { ChartPeriod } from "src/enum/ChartPeriod";

export const getTokenFromLocalStorage = () => localStorage.getItem("token");

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getWidgets: builder.query<IDashboardWidget, number>({
            query: (period) => `Dashboard/GetWidgets/${period}`,
        }),
        getCharts: builder.query<IDashboardChart, IDashboardChartRequest>({
            query: (request) => ({
                url: "Dashboard/GetCharts",
                method: "POST",
                body: request,
            }),
            providesTags: ["Charts"],
        }),
        getExpenditureChartByCategory: builder.query<
            IDashboardExpenditureCategory,
            IDashboardCategoryListingRequest
        >({
            query: (request) => ({
                url: "Dashboard/GetExpenditureChartByCategory",
                method: "POST",
                body: request,
            }),
        }),
        getBudgetTargetChart: builder.query<
            IMonthComparisonChart,
            IDashboardBudgetTargetChartRequest
        >({
            query: (request) => ({
                url: "Dashboard/GetBudgetTargetChart",
                method: "POST",
                body: request,
            }),
        }),
        getListingByCategory: builder.query<
            IDashboardListing[],
            IDashboardCategoryListingRequest
        >({
            query: (request) => ({
                url: "Dashboard/GetListingByCategory",
                method: "POST",
                body: request,
            }),
        }),
        getBillsAndRecentTransactions: builder.query<
            IDashboardBillTransactionResponse,
            number
        >({
            query: (period) =>
                `Dashboard/GetBillsAndRecentTransactions/${period}`,
            providesTags: ["BillsAndTransactions"],
        }),
        getActivityHub: builder.query<IDashboardActivityHub, number>({
            query: (period) => `Dashboard/GetActivityHub/${period}`,
            providesTags: ["Activity"],
        }),
        getUserInfo: builder.query<IUserInfo, void>({
            query: () => "Dashboard/UserInfo",
            providesTags: ["UserInfo"],
        }),
        addActivity: builder.mutation<boolean, Omit<IAddActivityRequest, "id">>(
            {
                query: (body) => ({
                    url: "Dashboard/AddActivity",
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["Activity"],
            }
        ),
        addExpense: builder.mutation<void, Omit<IAddExpenseRequest, "id">>({
            query: (body) => ({
                url: "Dashboard/AddExpense",
                method: "POST",
                body,
            }),
            invalidatesTags: ["BillsAndTransactions", "Charts", "Activity"],
        }),
        addIncome: builder.mutation<void, Omit<IAddIncomeRequest, "id">>({
            query: (body) => ({
                url: "Dashboard/AddIncome",
                method: "POST",
                body,
            }),
            invalidatesTags: ["BillsAndTransactions", "Charts"],
        }),
        addEvent: builder.mutation<void, Omit<IAddEventRequest, "id">>({
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
        setPrivateCategories: builder.mutation<void, boolean>({
            query: (hide) => ({
                url: `Dashboard/SetPrivateCategories/${hide}`,
                method: "GET",
            }),
            invalidatesTags: ["UserInfo"],
        }),
    }),
});

export const {
    useGetWidgetsQuery,
    useGetChartsQuery,
    useGetBillsAndRecentTransactionsQuery,
    useGetActivityHubQuery,
    useGetUserInfoQuery,
    useGetExpenditureChartByCategoryQuery,
    useGetListingByCategoryQuery,
    useGetBudgetTargetChartQuery,
    useAddActivityMutation,
    useAddExpenseMutation,
    useAddIncomeMutation,
    useAddEventMutation,
    useSetPrivacyModeMutation,
    useSetPrivateCategoriesMutation,
} = dashboardApi;

export interface IDashboardChartRequest {
    chartPeriod: ChartPeriod;
    fromDate: FormValueType | null;
    toDate: FormValueType | null;
}

export interface IDashboardBudgetTargetChartRequest {
    tagId: string | null;
    catId: number | null;
    isSubCat: boolean;
    isEventType: boolean;
}

export interface IDashboardCategoryListingRequest {
    chartPeriod: ChartPeriod;
    catId?: number;
    tagId?: string;
    isSubCat: boolean;
    isFinance: boolean;
    fromDate: FormValueType | null;
    toDate: FormValueType | null;
}

export interface IDashboardListing {
    info: string;
    value: string;
    date: string;
}

export interface IDashboardExpenditureCategory {
    labels: string[];
    summary: IChartSummary[];
    data: { [key: string]: IMonthComparisonChart[] };
}

export interface IUserInfo {
    privacyMode: boolean;
    hidePrivateCategories: boolean;
    tags: IUserTag[];
}

export interface IAddEventRequest {
    calendarId: number;
    startDate: FormValueType;
    endDate: FormValueType | null;
    tagId: FormValueType | null;
    title: FormValueType | null;
    description: FormValueType;
    alarm: FormValueType;
    reminder: boolean;
    allDay: boolean;
    tentative: boolean;
    multiEvents: boolean;
}

export interface IUserTag {
    id: string;
    name: string;
    private: boolean;
}

export interface IAddIncomeRequest {
    name: FormValueType;
    sourceId: number;
    secondSourceId?: number;
    date: FormValueType;
    amount: FormValueType;
    monzoTransId: null;
}

export interface IFinance {
    id: number;
    name: string;
    avgMonthlyAmount: number;
    startDate: Date;
    endDate: Date;
    monthlyDueDate: number;
    nextDueDate: Date;
    overrideNextDueDate: number;
    remaining: number;
    totalAmount: number;
    totalPaid: number;
    manualPayment: boolean;
    daysUntilDue: number;
    paymentStatus: PaymentStatus;
    directDebit: boolean;
    monzoTag: string;
    superCatId: number;
}

export interface IAddActivityRequest {
    tagId: string;
    date: FormValueType;
    value: FormValueType;
}

export interface IAddExpenseRequest {
    name: FormValueType;
    date: FormValueType;
    amount: FormValueType;
    catId?: number;
    secondCatId?: number;
    financeId?: FormValueType;
    monzoTransId: null;
    cashExpense: boolean;
}

export interface IDashboardActivityHub {
    totalBudget: number;
    totalValue: number;
    tags: IActivityTag[];
    events: IDashboardEvent[];
    activities: IActivityTagProgress[];
}

export interface IDashboardEvent {
    title: string;
    start: Date;
    end: Date | null;
    themeColor: string;
}

export interface IActivityTag {
    id: string;
    name: string;
    targetUnit: string;
    private: boolean;
}

export interface IActivityTagProgress {
    tagId: string;
    catId: number | null;
    tagGroupId: number;
    targetUnit: string;
    subject: string;
    value: number;
    text: string;
    textV2: string;
    multiUsers: boolean;
    activityTag: string;
    color: string;
    avatars: string[];
    progressBar: IProgressBar;
    progressBarPreviousPeriod: IProgressBar;
    previousMonthTotalValue: number;
    previousSsecondMonthTotalValue: number;
    thisPeriodTotalValue: number;
    lastPeriodTotalValue: number;
    upcomingTotalValue: number;
    previousMonthSuccess: boolean;
    previousSecondMonthSuccess: boolean;
    lastPeriodSuccess: boolean;
    reverse: boolean;
    private: boolean;
    icon: string;
    displayUnitBeforeLabel: boolean;
    isFinanceType: boolean;
    isEventType: boolean;
    isSubCat: boolean;
}

export interface IProgressBar {
    targetFrequency: TimeFrequency;
    targetValue: number;
    targetUnit: string;
    actualValue: number;
    progressBarPercentage: number;
    progresssBarColor: string;
}

export enum TimeFrequency {
    Daily,
    Weekly,
    Monthly,
}

export interface IDashboardWidget {
    incomeSpendingChart: IMonthComparisonChart[];
    spentPreviousMonth: number;
    spentPreviousSecondMonth: number;
    spentLastMonthPercentDiff: number;
    earnedPreviousMonth: number;
    earnedPreviousSecondMonth: number;
    earnedLastMonthPercentDiff: number;
    runningKmPreviousWeek: number;
    runningKmPreviousSecondWeek: number;
    runningKmLastWeekPercentDiff: number;
    runningIcon: string;
    gymHoursPreviousWeek: number;
    gymHoursPreviousSecondWeek: number;
    gymHoursLastWeekPercentDiff: number;
    gymIcon: string;
    periodMonth: string;
    thisMonth: string;
    periodWeek: string;
    monzoLastUpdated: Date;
}

export interface IDashboardChart {
    totalSpent: number;
    spendingSummary: ISpendingSummary[];
    incomeSummary: IIncomeSummary[];
    incomeExpenditure: IMonthComparisonChart;
    incomeExpenditureLastUpdated: Date;
    topEarningsLastUpdated: Date;
}

export interface IMonthComparisonChart {
    labels: string[];
    summary: IChartSummary[];
    data: { [key: string]: IMonthComparisonChartData[] };
}

export interface IMonthComparisonChartData {
    yearMonth: string;
    monthName: string;
    total: number;
    type: CategoryType;
    category: string;
    secondCategory: string;
}

export interface IChartSummary {
    title: string;
    averagedDaily: string;
    averagedMonthly: string;
    totalSpent: string;
}

export interface IMonthComparisonChart {
    yearMonth: string;
    monthName: string;
    total: number;
    type: CategoryType;
    catId: number;
    secondCatId?: number;
    category: string;
    secondCategory: string;
    superCatId1?: number;
    superCatId?: number;
    financeSuperCatId?: number;
    isFinance: boolean;
    daysInMonth: number;
    average: string;
}

export interface ISpendingSummary {
    cat1: string;
    catId: number;
    superCatId: number | null;
    superCat: string | null;
    // financeId: number | null;
    secondCatId: number;
    isFinance: boolean;
    billName: string | null;
    cat2: string;
    secondCats: ISpendingSummary[];
    secondTypeId?: number;
    total: number;
    average: string;
    superCatId1?: number;
    superCatId2?: number;
    superCat1: string;
    superCat2: string;
    isSpecialCat: boolean;
    cat1Private: boolean;
    cat2Private: boolean;
}

export interface IIncomeSummary {
    cat1: string;
    catId: number;
    secondCatId: number;
    cat2: string;
    secondCats: ISpendingSummary[];
    secondTypeId?: number;
    total: number;
    average: string;
    cat1Private: boolean;
    cat2Private: boolean;
}

export interface IDashboardBillTransactionResponse {
    upcomingPaymentsTotal: string;
    previous2MonthsDiff: number;
    previous2MonthsDiffInfo: string;
    categories: ICategory[];
    // categories: Record<CategoryType, ICategory[]>;
    bills: IDashboardBill[];
    upcomingPayments: IDashboardBill[];
    recentEarnings: IDashboardTransaction[];
    recentExpenses: IDashboardTransaction[];
    billsProjection: string;
}

export interface IDashboardBill {
    id: number;
    name: string;
    avgMonthlyAmount: number;
    paymentStatus: PaymentStatus;
    manualPayment: boolean;
    daysUntilDue?: number;
    nextDueDate?: Date;
    private: boolean;
    subs?: ICategory[];
}

export interface IDashboardTransaction {
    name: string;
    amount: number;
    catId: number;
    date: string;
    category: string;
    isBill: boolean;
    private: boolean;
}
