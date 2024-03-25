import { Page } from "../enum/Page";

export interface IRoute {
    page: Page;
    memberOnly: boolean;
    element: React.ReactNode;
    path?: string;
    url: string;
    displayOnHeader?: boolean;
}
