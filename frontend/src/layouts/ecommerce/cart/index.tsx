import { Card, Grid, LinearProgress } from "@mui/material";
import MDBox from "src/components/MDBox";
import MDTypography from "src/components/MDTypography";
import { Payment } from "../payment";
import { CartOverlay } from "./Overlay";
import { useGetCartQuery } from "src/api/cartApi";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { getUserState } from "src/state/contexts/user/Selectors";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import { ShowPageAction } from "src/state/contexts/app/Actions";
import { Page } from "src/enum/Page";
import { OpenVerifyEmailModalAction } from "src/state/contexts/cart/Actions";
import useEffectSkipInitialRender from "src/hooks/useEffectSkipInitialRender";
import { useEffect } from "react";

export const Cart = () => {
    const dispatch = useAppDispatch();

    const { firebaseUid, verificationEmail } = useAppSelector(getUserState);
    const { guestCheckout, openVerifyEmailModal } =
        useAppSelector(getCartState);

    const { data: cart, isLoading } = useGetCartQuery({
        firebaseUid,
        guestCheckoutId: guestCheckout?.id,
    });

    const itemsInCart: ICartProductDetail[] = cart?.products ?? [];

    useEffect(() => {
        if (!isLoading && (!cart || itemsInCart.length === 0)) {
            dispatch(ShowPageAction(Page.Products));
        }
    }, [itemsInCart]);

    useEffectSkipInitialRender(() => {
        const open =
            !verificationEmail.verified &&
            !openVerifyEmailModal &&
            guestCheckout?.email !== "";

        dispatch(OpenVerifyEmailModalAction(open));
    }, [verificationEmail]);

    if (isLoading || itemsInCart.length === 0) {
        <LinearProgress />;
    }

    return (
        <MDBox className="content">
            <Card
                sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <Grid
                    alignItems={"flex-start"}
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 6 }}
                >
                    <Grid item xs={12} md={12} lg={6}>
                        <MDTypography mb={1}>
                            <h2>Checkout</h2>
                        </MDTypography>
                        <Payment />
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                        <CartOverlay isOverlay={false} />
                    </Grid>
                </Grid>
            </Card>
        </MDBox>
    );
};
