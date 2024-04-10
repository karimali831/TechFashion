import { User } from "firebase/auth";
import { IVerificationEmail } from "src/api/userApi";
import { IUser } from "src/data/IUser";

export interface IUserState {
    user: IUser | null;
    authSuccess: boolean;
    firebaseUid: string | null;
    signingIn: boolean;
    verificationEmail: IVerificationEmail;
    emailVerificationAttempt: number;
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
    emailVerificationAttempt: 1,
};

export type IFirebaseUser = User;
