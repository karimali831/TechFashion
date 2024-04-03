import { Alert, Card } from "@mui/material";
import { useEffect } from "react";
import MDBox from "src/components/MDBox";
import { Order } from "src/layouts/pages/order/Order";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { persistor } from "src/state/InitialiseStore";
import { ResetGuestCheckoutAction } from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";

export const Success = () => {
    const { guestCheckout } = useAppSelector(getCartState);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!!guestCheckout) {
            dispatch(ResetGuestCheckoutAction());
            persistor.purge();
        }
    }, []);

    return (
        <MDBox className="home">
            <Card>
                <Alert severity="success">
                    Payment successful. Your order is now being processed and you will be notified once your items are
                    dispatched.
                </Alert>
                <Order />
            </Card>
        </MDBox>
    );
};
