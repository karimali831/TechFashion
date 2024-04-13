import { Alert, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { baseWebUrl } from "src/api/baseApi";
import { useGetOrderQuery } from "src/api/orderApi";
import MDBox from "src/components/MDBox";
import { Order } from "src/layouts/pages/order/Order";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { persistor } from "src/state/InitialiseStore";
import { ResetGuestCheckoutAction } from "src/state/contexts/cart/Actions";
import { getUserState } from "src/state/contexts/user/Selectors";

export const Success = () => {
    const params = new URLSearchParams(window.location.search);
    const paymentIntentId = params.get("payment_intent");

    const { firebaseUid } = useAppSelector(getUserState);
    const dispatch = useAppDispatch();

    const { data: order, isLoading } = useGetOrderQuery(paymentIntentId);

    useEffect(() => {
        if (!firebaseUid) {
            dispatch(ResetGuestCheckoutAction());
            persistor.purge();
        }
    }, []);

    // http://localhost:5173/order/266098623

    const loggedinStr =
        firebaseUid &&
        "You can view the status of your order or make changes to it by visiting your orders";

    return (
        <MDBox className="content">
            <Alert severity="success">
                Thanks for your order. We’ll let you know once your item(s) have
                dispatched. Your estimated delivery date is indicated below.{" "}
                {loggedinStr}
            </Alert>
            {!firebaseUid && !isLoading && (
                <Alert severity="info">
                    Your unique order link is : {baseWebUrl}
                    {`/order/${order.ref}`} {"  "} Alternatively, you can
                    register an account to view all your orders.
                </Alert>
            )}
            {isLoading ? <CircularProgress /> : <Order order={order} />}
        </MDBox>
    );
};
