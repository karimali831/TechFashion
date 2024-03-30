import { User } from "firebase/auth";
import { IVerificationEmail } from "src/api/userApi";
import { IUser } from "src/data/IUser";

export interface IUserState {
    user: IUser | null;
    authSuccess: boolean;
    firebaseUid: string | null;
    signingIn: boolean;
    verificationEmail: IVerificationEmail;
}

export const userInitialState: IUserState = {
    user: null,
    authSuccess: false,
    firebaseUid: null,
    signingIn: false,
    verificationEmail: {
        sent: false,
        verified: false,
        fullAccountExists: false,
    },
};

export type IFirebaseUser = User;
