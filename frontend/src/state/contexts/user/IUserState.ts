import { User } from "firebase/auth";
import { IUser } from "src/data/IUser";

export interface IUserState {
    user: IUser | null;
    authSuccess: boolean;
    firebaseUid: string | null;
    signingIn: boolean;
}

export const userInitialState: IUserState = {
    user: null,
    authSuccess: false,
    firebaseUid: null,
    signingIn: false,
};

export type IFirebaseUser = User;
