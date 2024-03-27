import { Box, LinearProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import {
    useGetOrderHistoryQuery,
    useGetOrderedItemsQuery,
} from "src/api/cartApi";
import { useGetProductQuery } from "src/api/productApi";
import MDBox from "src/components/MDBox";
import MDTypography from "src/components/MDTypography";
import { IOrderItem } from "src/data/IOrderItem";
import { Page } from "src/enum/Page";
import DefaultCell from "src/layouts/ecommerce/orders/order-list/components/DefaultCell";
import DataTable from "src/layouts/table/DataTable";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import {
    ShowPageAction,
    ShowPageWithParamsAction,
} from "src/state/contexts/app/Actions";
import { SelectedProductAction } from "src/state/contexts/product/Actions";
import { getUserState } from "src/state/contexts/user/Selectors";
import { IRouteParams } from "src/types/RouteParams";

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

export const Order = () => {
    const { user } = useAppSelector(getUserState);

    const { id } = useParams<IRouteParams>();
    const orderId = Number(id);

    const dispatch = useAppDispatch();

    const { data: orderHistory, isLoading: orderHistoryLoading } =
        useGetOrderHistoryQuery(user?.id, {
            skip: !user,
        });
    const { data: products, isLoading: productsIsLoading } =
        useGetProductQuery();
    const { data, isLoading } = useGetOrderedItemsQuery(orderId);

    const order = orderHistory?.filter((x) => x.id == orderId)[0];

    if (isLoading || orderHistoryLoading || !order || productsIsLoading) {
        return <LinearProgress />;
    }

    return (
        <MDBox mt={4} className="home">
            <h1>Account</h1>
            <span
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => dispatch(ShowPageAction(Page.Account))}
            >
                Return to Account details
            </span>
            <Box mt={5} sx={{ border: "1px solid #eee", p: 2 }}>
                <h1>Order {order.idStr}</h1>
                <span>Placed on {order.dateTimeStr}</span>
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
                <Box>
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
            </Box>
        </MDBox>
    );
};
