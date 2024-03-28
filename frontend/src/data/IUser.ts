export interface IUser {
    id: number;
    name?: string;
    email: string;
    firebaseUid?: string;
    stripeCustomerId?: string;
}
