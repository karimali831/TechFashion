import { Alert, Card } from "@mui/material";
import { useEffect } from "react";
import MDBox from "src/components/MDBox";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { GuestCheckoutId, GuestCheckoutKey } from "src/state/InitialiseStore";
import {
    SetGuestCheckoutEmailAction,
    SetGuestCheckoutIdAction,
} from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";

export const Success = () => {
    const { guestCheckoutId, guestCheckoutEmail } =
        useAppSelector(getCartState);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (guestCheckoutId) {
            dispatch(SetGuestCheckoutIdAction(null));
        }

        if (guestCheckoutEmail) {
            dispatch(SetGuestCheckoutEmailAction(null));
        }

        if (GuestCheckoutId) {
            localStorage.removeItem(GuestCheckoutKey);
        }
    }, []);

    return (
        <MDBox className="home">
            <Card>
                <Alert severity="success">
                    Payment successful. Your order is now being processed and
                    you will be notified once your items are dispatched.
                </Alert>
            </Card>
        </MDBox>
    );
};
