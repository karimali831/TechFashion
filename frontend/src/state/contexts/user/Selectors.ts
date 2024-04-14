import { IVerificationEmail } from "src/api/userApi";
import { IUser } from "src/data/IUser";
import { IStoreState } from "src/state/IStoreState";

export const getUserState = (state: IStoreState) => state.user;

export const getUser = (state: IStoreState): IUser | null => {
    return state.user.user;
};

export const getVerificationEmail = (
    state: IStoreState
): IVerificationEmail => {
    return state.user.verificationEmail;
};

export const getUserAuth = (state: IStoreState): boolean => {
    return state.user.user != null;
};

export const getUserId = (state: IStoreState): number | null => {
    return state.user.user?.id ?? null;
};

export const getFirebaseUid = (state: IStoreState): string | null => {
    return state.user.firebaseUid;
};
