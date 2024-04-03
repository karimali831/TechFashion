import { Grid, Fade, Typography, Box, LinearProgress } from "@mui/material";
import MDTypography from "src/components/MDTypography";
import { IOrderHistory } from "src/data/IOrderHistory";
import { IOrderItem } from "src/data/IOrderItem";
import { OrderStatus } from "src/enum/OrderStatus";
import { Page } from "src/enum/Page";
import DataTable from "src/layouts/table/DataTable";
import { ShowPageWithParamsAction } from "src/state/contexts/app/Actions";
import { SelectedProductAction } from "src/state/contexts/product/Actions";
import { useGetOrderedItemsQuery } from "src/api/cartApi";
import { useAppDispatch } from "src/state/Hooks";
import DefaultCell from "src/layouts/ecommerce/orders/order-list/components/DefaultCell";
import { useGetProductQuery } from "src/api/productApi";

interface IProps {
    order: IOrderHistory;
}

const columns = [
    {
        Header: "Product",
        accessor: "product",
        Cell: ({ value }: any) => <DefaultCell link={true} value={value} />,
    },
    {
        Header: "SKU",
        accessor: "sku",
        Cell: ({ value }: any) => <DefaultCell value={value} />,
    },
    {
        Header: "Price",
        accessor: "priceStr",
        Cell: ({ value }: any) => <DefaultCell value={value} />,
    },
    {
        Header: "Quantity",
        accessor: "quantity",
        Cell: ({ value }: any) => <DefaultCell value={value} />,
    },
    ,
    {
        Header: "Total",
        accessor: "totalStr",
        Cell: ({ value }: any) => <DefaultCell value={value} />,
    },
];

export const Order = ({ order }: IProps) => {
    const { data, isLoading } = useGetOrderedItemsQuery(order.ref);

    const { data: products, isLoading: productsIsLoading } =
        useGetProductQuery();

    const dispatch = useAppDispatch();

    if (isLoading || productsIsLoading) {
        return <LinearProgress />;
    }

    return (
        <Grid container mt={2} spacing={4}>
            <Fade
                in={true}
                mountOnEnter={true}
                unmountOnExit={true}
                timeout={500}
            >
                <Grid item xl={9} md={12} xs={12}>
                    <h1>Order {order.idStr}</h1>
                    <span>Placed on {order.dateTimeStr}</span>
                    <Box
                        mt={1}
                        sx={{
                            border: "1px solid #eee",
                            p: "10px 5px 5px 10px",
                        }}
                    >
                        <DataTable<IOrderItem>
                            table={{
                                columns,
                                rows: data,
                            }}
                            entriesPerPage={false}
                            canSearch
                            loading={isLoading}
                            onRowClick={(order) => {
                                const productDetails = products.details.filter(
                                    (x) => x.id === order.productId
                                );

                                dispatch(SelectedProductAction(productDetails));
                                dispatch(
                                    ShowPageWithParamsAction({
                                        page: Page.Product,
                                        primaryId: order.productSlug,
                                    })
                                );
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            border: "1px solid #eee",
                            p: "10px 5px 5px 10px",
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            sx={{ p: 1 }}
                        >
                            <MDTypography
                                variant="caption"
                                fontWeight="regular"
                                color="text"
                            >
                                Subtotal
                            </MDTypography>
                            <MDTypography
                                variant="caption"
                                fontWeight="regular"
                                color="text"
                            >
                                {order.totalStr}
                            </MDTypography>
                        </Box>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            sx={{ p: 1 }}
                        >
                            <MDTypography fontWeight="medium" color="text">
                                Total
                            </MDTypography>
                            <MDTypography
                                // variant="caption"
                                fontWeight="medium"
                                color="text"
                            >
                                {order.totalStr}
                            </MDTypography>
                        </Box>
                    </Box>
                </Grid>
            </Fade>
            <Fade
                in={true}
                mountOnEnter={true}
                unmountOnExit={true}
                timeout={500}
                style={{
                    transitionDelay: "250ms",
                }}
            >
                <Grid item xl={3} md={12} xs={12}>
                    <h2>Status</h2>
                    <Box mt={1} display="flex" flexDirection={"column"}>
                        <Typography className="standard-text">
                            Order: {OrderStatus[order.status]}
                        </Typography>
                        <Typography className="standard-text">
                            Payment: {order.paymentStatus}
                        </Typography>
                    </Box>
                    <Box mt={3}>
                        <h2>Shipping Address</h2>
                        <Box mt={1} display="flex" flexDirection={"column"}>
                            <Typography className="standard-text">
                                {order.name}
                            </Typography>
                            <Typography className="standard-text">
                                {order.line1}
                            </Typography>
                            <Typography className="standard-text">
                                {order.line2}
                            </Typography>
                            <Typography className="standard-text">
                                {order.city}
                            </Typography>
                            <Typography className="standard-text">
                                {order.postalCode}, {order.country}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Fade>
        </Grid>
    );
};