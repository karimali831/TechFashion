export interface IUser {
    id: number;
    name?: string;
    email: string;
    firebaseUid?: string;
    guestCheckoutId?: string;
    stripeCustomerId?: string;
}
