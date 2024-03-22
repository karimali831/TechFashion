import { Alert, Card } from "@mui/material";
import MDBox from "src/components/MDBox";

export const Success = () => {
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
