import { Card, Grid } from "@mui/material";
import MDBox from "src/components/MDBox";
import MDTypography from "src/components/MDTypography";
import { Payment } from "../payment";
import { CartOverlay } from "./Overlay";

export const Cart = () => {
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
                <Grid alignItems={"flex-start"} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 6 }}>
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
