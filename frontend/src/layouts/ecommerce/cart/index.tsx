import { Card, Grid } from "@mui/material";
import { Payment } from "../payment";
import MDBox from "src/components/MDBox";
import { CartOverlay } from "./Overlay";
import MDTypography from "src/components/MDTypography";

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
                <Grid
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
