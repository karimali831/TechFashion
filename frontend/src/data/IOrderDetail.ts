import { OrderStatus } from "src/enum/OrderStatus";

export interface IOrderDetail {
    id: number;
    ref: number;
    idStr: string;
    dateStr: string;
    dateTimeStr: string;
    // date: Date;
    paymentStatus: string;
    status: OrderStatus;
    name: string;
    line1: string;
    line2: string;
    city: string;
    postalCode: string;
    country: string;
    // total: number;
    totalStr: string;
}
