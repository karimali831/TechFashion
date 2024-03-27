import { OrderStatus } from "src/enum/OrderStatus";

export interface IOrderHistory {
    id: number;
    idStr: string;
    dateStr: string;
    dateTimeStr: string;
    // date: Date;
    paymentStatus: string;
    status: OrderStatus;
    // total: number;
    totalStr: string;
}
