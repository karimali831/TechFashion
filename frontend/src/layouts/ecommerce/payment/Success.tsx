import { Alert, Card } from "@mui/material";
import MDBox from "src/components/MDBox";

export const Success = () => {
    // const { guestCheckoutId, guestCheckoutEmail } =
    //     useAppSelector(getCartState);

    // const dispatch = useAppDispatch();

    // useEffect(() => {
    //     if (guestCheckoutId) {
    //         dispatch(SetGuestCheckoutIdAction(null));
    //     }

    //     if (guestCheckoutEmail) {
    //         dispatch(SetGuestCheckoutEmailAction(""));
    //     }
    // }, []);

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
