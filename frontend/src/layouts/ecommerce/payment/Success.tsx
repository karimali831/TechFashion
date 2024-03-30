import { Alert, Box, Card } from "@mui/material";
import { useEffect } from "react";
import MDBox from "src/components/MDBox";
import MDTypography from "src/components/MDTypography";
import { getUserState } from "src/state/contexts/user/Selectors";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { ResetGuestCheckoutAction } from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";

export const Success = () => {
    const { firebaseUid } = useAppSelector(getUserState);
    const { guestCheckout } = useAppSelector(getCartState);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!!guestCheckout) {
            dispatch(ResetGuestCheckoutAction());
        }
    }, []);

    return (
        <MDBox className="home">
            <Card>
                <Alert severity="success">
                    Payment successful. Your order is now being processed and
                    you will be notified once your items are dispatched.
                </Alert>
                {firebaseUid == null && (
                    <Box p={2}>
                        <MDTypography variant="text">
                            Register an account with your email if you wish to
                            view and track your orders.
                        </MDTypography>
                    </Box>
                )}
            </Card>
        </MDBox>
    );
};
