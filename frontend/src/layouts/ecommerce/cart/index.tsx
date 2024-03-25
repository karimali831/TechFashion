import { Card, Grid } from "@mui/material";
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

export const Cart = () => {
    const dispatch = useAppDispatch();

    const { firebaseUid } = useAppSelector(getUserState);
    const { guestCheckout } = useAppSelector(getCartState);

    const { data: cart } = useGetCartQuery({
        firebaseUid,
        guestCheckoutId: guestCheckout?.id,
    });

    const itemsInCart: ICartProductDetail[] = cart?.products ?? [];

    if (itemsInCart.length === 0) {
        dispatch(ShowPageAction(Page.Products));
    }

    return (
        <MDBox className="home">
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
