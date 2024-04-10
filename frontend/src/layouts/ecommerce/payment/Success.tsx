import { Alert, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { baseWebUrl } from "src/api/baseApi";
import { useGetOrderQuery } from "src/api/orderApi";
import MDBox from "src/components/MDBox";
import { Order } from "src/layouts/pages/order/Order";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { persistor } from "src/state/InitialiseStore";
import { ResetGuestCheckoutAction } from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";

export const Success = () => {
    const params = new URLSearchParams(window.location.search);
    const paymentIntentId = params.get("payment_intent");

    const { guestCheckout } = useAppSelector(getCartState);
    const dispatch = useAppDispatch();

    const { data: order, isLoading } = useGetOrderQuery(paymentIntentId);

    useEffect(() => {
        if (!!guestCheckout) {
            dispatch(ResetGuestCheckoutAction());
            persistor.purge();
        }
    }, []);

    return (
        <MDBox className="content">
            <Alert severity="success">
                Payment successful. Your order is now being processed and you
                will be notified once your items are dispatched.
            </Alert>
            {!!guestCheckout && !isLoading && (
                <Alert severity="info">
                    Your unique order link is : {baseWebUrl}
                    {`/order/${order.ref}`}
                    Or register an account to view all your orders.
                </Alert>
            )}
            {isLoading ? <CircularProgress /> : <Order order={order} />}
        </MDBox>
    );
};
