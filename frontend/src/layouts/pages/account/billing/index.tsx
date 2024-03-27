import Grid from "@mui/material/Grid";
import MDBox from "src/components/MDBox";
import PaymentMethod from "src/layouts/pages/account/billing/components/PaymentMethod";
import Invoices from "src/layouts/pages/account/billing/components/Invoices";
import BillingInformation from "src/layouts/pages/account/billing/components/BillingInformation";
import Transactions from "src/layouts/pages/account/billing/components/Transactions";
import MasterCard from "src/components/Cards/MasterCard";
import DefaultInfoCard from "src/components/Cards/DefaultInfoCard";
import { Box, Button, Icon, LinearProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { SignOutAction } from "src/state/contexts/user/Actions";
import { useGetOrderHistoryQuery } from "src/api/cartApi";
import { getUserState } from "src/state/contexts/user/Selectors";
import DataTable from "src/layouts/table/DataTable";
import StatusCell from "src/layouts/ecommerce/orders/order-list/components/StatusCell";
import { OrderStatus } from "src/enum/OrderStatus";
import DefaultCell from "src/layouts/ecommerce/orders/order-list/components/DefaultCell";
import IdCell2 from "src/layouts/ecommerce/orders/order-list/components/IdCell2";
import { IOrderHistory } from "src/data/IOrderHistory";
import { ShowPageWithParamsAction } from "src/state/contexts/app/Actions";
import { Page } from "src/enum/Page";

const columns = [
    {
        Header: "id",
        accessor: "idStr",
        Cell: ({ value }: any) => <IdCell2 id={value} />,
    },
    {
        Header: "date",
        accessor: "dateStr",
        Cell: ({ value }: any) => <DefaultCell value={value} />,
    },
    {
        Header: "payment status",
        accessor: "paymentStatus",
        Cell: ({ value }: any) => {
            let status;

            if (value === "succeeded") {
                status = (
                    <StatusCell icon="done" color="success" status="Paid" />
                );
            } else if (value === "refunded") {
                status = (
                    <StatusCell icon="replay" color="dark" status="Refunded" />
                );
            } else {
                status = (
                    <StatusCell icon="close" color="error" status="Canceled" />
                );
            }

            return status;
        },
    },
    {
        Header: "order status",
        accessor: "status",
        Cell: ({ value }: any) => {
            return OrderStatus[value];
        },
    },
    {
        Header: "total",
        accessor: "totalStr",
        Cell: ({ value }: any) => <DefaultCell value={value} />,
    },
];

function Billing(): JSX.Element {
    const dispatch = useAppDispatch();

    const { user } = useAppSelector(getUserState);

    const { data: orderHistory, isLoading: orderHistoryLoading } =
        useGetOrderHistoryQuery(user.id);

    if (orderHistoryLoading) {
        return <LinearProgress />;
    }

    return (
        <MDBox mt={4} className="home">
            <h1>Account</h1>
            <Box
                mt={2}
                display={"flex"}
                alignItems={"center"}
                sx={{ cursor: "pointer" }}
            >
                <Icon fontSize="medium" sx={{ mr: 1 }}>
                    person_outline
                </Icon>
                <span
                    style={{ textDecoration: "underline" }}
                    onClick={() => dispatch(SignOutAction())}
                >
                    Log out
                </span>
            </Box>
            <Box mt={5}>
                <h2>Order history</h2>
                <Box mt={1}>
                    {orderHistory.length === 0 ? (
                        <span>You haven't placed any orders yet.</span>
                    ) : (
                        <Box>
                            <DataTable<IOrderHistory>
                                table={{
                                    columns,
                                    rows: orderHistory,
                                }}
                                entriesPerPage={false}
                                canSearch
                                loading={orderHistoryLoading}
                                onRowClick={(order) =>
                                    dispatch(
                                        ShowPageWithParamsAction({
                                            page: Page.Order,
                                            primaryId: order.id.toString(),
                                        })
                                    )
                                }
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </MDBox>
    );

    return (
        <MDBox mt={4} className="home">
            <Button
                variant="contained"
                onClick={() => dispatch(SignOutAction())}
            >
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
