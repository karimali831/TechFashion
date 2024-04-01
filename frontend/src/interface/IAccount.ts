import { ICustomerAddress } from "src/data/ICustomerAddress";
import { IOrderHistory } from "src/data/IOrderHistory";

export interface IAccount {
    orders: IOrderHistory[];
    addresses: ICustomerAddress[];
}
