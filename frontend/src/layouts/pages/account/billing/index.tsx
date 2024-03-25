import Grid from "@mui/material/Grid";
import MDBox from "src/components/MDBox";
import PaymentMethod from "src/layouts/pages/account/billing/components/PaymentMethod";
import Invoices from "src/layouts/pages/account/billing/components/Invoices";
import BillingInformation from "src/layouts/pages/account/billing/components/BillingInformation";
import Transactions from "src/layouts/pages/account/billing/components/Transactions";
import MasterCard from "src/components/Cards/MasterCard";
import DefaultInfoCard from "src/components/Cards/DefaultInfoCard";
import { Button } from "@mui/material";
import { auth } from "src/config/firebase";
import { useAppSelector } from "src/state/Hooks";
import { getUserState } from "src/state/contexts/user/Selectors";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Billing(): JSX.Element {
    const navigate = useNavigate();
    const { user } = useAppSelector(getUserState);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user]);

    return (
        <MDBox mt={4} className="home">
            <Button variant="contained" onClick={() => auth.signOut()}>
                Sign out
            </Button>
            <MDBox mb={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} xl={6}>
                                <MasterCard
                                    number={4562112245947852}
                                    holder="jack peterson"
                                    expires="11/22"
                                />
                            </Grid>
                            <Grid item xs={12} md={6} xl={3}>
                                <DefaultInfoCard
                                    icon="account_balance"
                                    title="salary"
                                    description="Belong Interactive"
                                    value="+$2000"
                                />
                            </Grid>
                            <Grid item xs={12} md={6} xl={3}>
                                <DefaultInfoCard
                                    icon="paypal"
                                    title="paypal"
                                    description="Freelance Payment"
                                    value="$455.00"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <PaymentMethod />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Invoices />
                    </Grid>
                </Grid>
            </MDBox>
            <MDBox mb={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <BillingInformation />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Transactions />
                    </Grid>
                </Grid>
            </MDBox>
        </MDBox>
    );
}

export default Billing;
