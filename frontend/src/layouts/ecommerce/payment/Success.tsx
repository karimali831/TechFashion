import { Alert, CircularProgress, Fade } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
// import { baseWebUrl } from "src/api/baseApi";
import { useGetOrderQuery } from "src/api/orderApi";
import MDBox from "src/components/MDBox";
import { Order } from "src/layouts/pages/order/Order";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { persistor } from "src/state/InitialiseStore";
import { SetWelcomeTextAction } from "src/state/contexts/app/Actions";
import { ResetGuestCheckoutAction } from "src/state/contexts/cart/Actions";
import { getUserState } from "src/state/contexts/user/Selectors";
import { IRouteParams } from "src/types/RouteParams";

export const Success = () => {
    // const params = new URLSearchParams(window.location.search);
    // const paymentIntentId = params.get("payment_intent");

    const { id } = useParams<IRouteParams>();
    const orderId = Number(id);

    const { firebaseUid } = useAppSelector(getUserState);
    const dispatch = useAppDispatch();

    const { data: order, isLoading, isError } = useGetOrderQuery(orderId);

    useEffect(() => {
        return () => {
            dispatch(
                SetWelcomeTextAction({
                    variant: "default",
                    text: "After sales message",
                })
            );
        };
    }, []);

    useEffect(() => {
        persistor.purge();

        if (!firebaseUid) {
            dispatch(ResetGuestCheckoutAction());
        }

        if (!isLoading && !isError) {
            dispatch(
                SetWelcomeTextAction({
                    variant: "success",
                    text: "Payment successful",
                })
            );
        }
    }, [isLoading]);

    const loggedinStr =
        firebaseUid &&
        "You can view the status of your order or make changes to it by visiting your orders";

    if (isError)
        return (
            <MDBox className="content">
                <Alert severity="error">
                    Unable to load order at this time
                </Alert>
            </MDBox>
        );

    return (
        <MDBox className="content">
            {!isLoading && (
                <Fade
                    in={true}
                    mountOnEnter={true}
                    unmountOnExit={true}
                    timeout={500}
                >
                    <Alert severity="success">
                        Thanks for your order. We’ll let you know once your
                        item(s) have dispatched. Your order confirmation email
                        has been sent. {loggedinStr}
                    </Alert>
                </Fade>
            )}
            {/* {!firebaseUid && !isLoading && (
                <Fade in={true} mountOnEnter={true} unmountOnExit={true}>
                    <Alert severity="info">
                        Your unique order link is : {baseWebUrl}
                        {`/order/${order.ref}`} {"  "} Alternatively, you can
                        register an account to view all your orders.
                    </Alert>
                </Fade>
            )} */}
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Order order={order} displayItemsOnly={true} />
            )}
        </MDBox>
    );
};
