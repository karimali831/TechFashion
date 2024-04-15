import { ICustomerAddress } from "src/data/ICustomerAddress";
import { IOrderDetail } from "src/data/IOrderDetail";

export interface IAccount {
    orders: IOrderDetail[];
    addresses: ICustomerAddress[];
}
