const { DEV, VITE_API_URL } = import.meta.env;

// const rootUrl: string = DEV ? VITE_API_URL : window.location.origin;

export const getTokenFromLocalStorage = () => localStorage.getItem("token");

export const baseApiUrl = `${VITE_API_URL}/api/`;

export const baseWebUrl = DEV
    ? "http://localhost:5173"
    : "https://techfashion.netlify.app";

export interface IApiResponse<T> {
    data?: T;
    errorMsg?: string;
}

export interface IAxiosResponse<T> {
    data: T;
    status: number;
    statusText: string;
}
