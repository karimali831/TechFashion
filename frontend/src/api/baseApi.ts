const { DEV } = import.meta.env;

const rootUrl: string = DEV ? "https://localhost:7278" : window.location.origin;

export const getTokenFromLocalStorage = () => localStorage.getItem("token");

export const baseApiUrl = `${rootUrl}/api/`;
