export interface IUser {
    id: number;
    name?: string;
    email: string;
    firebaseUid?: string;
    stripeCustomerId?: string;
    // not mapped to db
    emailVerified: boolean;
}
