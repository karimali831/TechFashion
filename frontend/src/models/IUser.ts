import { Theme } from "../enum/Theme";
import { IMultiSelectWrapper } from "./IMultiSelect";
import { ITag } from "./ITag";

export interface IUser {
    userID: string;
    firebaseUid: string;
    name: string;
    email: string;
    roleIds: string;
    buddyIds: string;
    defaultNativeCalendarView: string;
    theme: Theme;
    phoneNumber?: string | null;
    cronofyUid?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    enableCronofy: boolean;
    extCalendars?: string | null;
    selectedCalendars?: string | null;
    avatar?: string | null;
    pinnedDocIds?: string | null;
    recentOpenedDocIds?: string | null;
    pushToken: string | null;
    options: IMultiSelectWrapper[];
    userTags: ITag[];
}
