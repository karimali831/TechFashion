const { DEV } = import.meta.env;

const rootUrl: string = DEV ? "http://localhost:5253" : window.location.origin;

export const getTokenFromLocalStorage = () => localStorage.getItem("token");

export const baseApiUrl = `${rootUrl}/api/`;
