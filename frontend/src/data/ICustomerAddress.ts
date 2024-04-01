export interface ICustomerAddress {
    id: number;
    userId: number;
    name: string;
    line1: string;
    line2?: string;
    city?: string;
    postalCode: string;
    country: string;
    main: boolean;
}
