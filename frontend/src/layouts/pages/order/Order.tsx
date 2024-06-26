import {
    Grid,
    Fade,
    Typography,
    Box,
    LinearProgress,
    StepIconProps,
} from "@mui/material";
import MDTypography from "src/components/MDTypography";
import { IOrderDetail } from "src/data/IOrderDetail";
import { IOrderItem } from "src/data/IOrderItem";
import { OrderStatus } from "src/enum/OrderStatus";
import { Page } from "src/enum/Page";
import DataTable from "src/layouts/table/DataTable";
import { ShowPageWithParamsAction } from "src/state/contexts/app/Actions";
import { SelectedProductAction } from "src/state/contexts/product/Actions";
import { useAppDispatch } from "src/state/Hooks";
import DefaultCell from "src/layouts/ecommerce/orders/order-list/components/DefaultCell";
import { useGetProductQuery } from "src/api/productApi";
import { useGetOrderedItemsQuery } from "src/api/orderApi";
import { IProductVariantObj } from "src/interface/IProductVariantObj";
import MDBox from "src/components/MDBox";
import { ColorlibStepIconRoot, ProgressStepper } from "src/components/Stepper";
import { IStepper } from "src/interface/IStepper";
import {
    CheckCircle,
    LocalShipping,
    Pending,
    Receipt,
} from "@mui/icons-material";

interface IProps {
    order: IOrderDetail;
    displayItemsOnly: boolean;
}

const columns = [
    {
        Header: "Product",
        accessor: "product",
        width: 300,
        Cell: ({ value }: any) => (
            <DefaultCell
                link={true}
                value={value}
                // maxLength={50}
                textAlign="right"
            />
        ),
    },
    {
        Header: "Variant",
        accessor: "variantList",
        Cell: ({ row }: any) => {
            const variantCount = row.original.variantList.length;
            if (variantCount == 0) return "-";

            return row.original.variantList.map(
                (book: IProductVariantObj, idx: number) => (
                    <Box key={book.attribute}>
                        <MDTypography
                            variant="caption"
                            fontSize="small"
                            fontWeight="regular"
                            color="text"
                        >
                            {variantCount === 1 ? "" : "-"} {book.value}
                        </MDTypography>
                    </Box>
                )
            );
        },
    },
    {
        Header: "Price",
        accessor: "priceStr",
        Cell: ({ value }: any) => <DefaultCell value={value} />,
    },
    {
        Header: "Quantity",
        accessor: "quantity",
        width: 100,
        Cell: ({ value }: any) => <DefaultCell value={value} />,
    },
    ,
    {
        Header: "Total",
        accessor: "totalStr",
        Cell: ({ value }: any) => (
            <DefaultCell value={value} textAlign="center" />
        ),
    },
];

const orderSteps: IStepper[] = [
    { id: 0, label: "Created" },
    { id: 1, label: "Awaiting dispatch" },
    { id: 3, label: "Shipped" },
    { id: 4, label: "Delivered" },
];

function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <Receipt fontSize={"medium"} />,
        2: <Pending fontSize={"medium"} />,
        3: <LocalShipping fontSize={"medium"} />,
        4: <CheckCircle fontSize={"medium"} />,
    };

    return (
        <ColorlibStepIconRoot
            ownerState={{ completed, active }}
            className={className}
        >
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}

export const Order = ({ order, displayItemsOnly }: IProps) => {
    const { data, isLoading } = useGetOrderedItemsQuery(order.ref);

    const { data: products, isLoading: productsIsLoading } =
        useGetProductQuery();

    const dispatch = useAppDispatch();

    if (isLoading || productsIsLoading) {
        return <LinearProgress />;
    }

    return (
        <MDBox>
            <Grid container spacing={4}>
                <Fade
                    in={true}
                    mountOnEnter={true}
                    unmountOnExit={true}
                    timeout={500}
                >
                    <Grid item xl={displayItemsOnly ? 12 : 9} md={12} xs={12}>
                        <h1>Order #{order.ref}</h1>
                        <span>Placed on {order.dateTimeStr}</span>

                        <MDBox mt={2} mb={2}>
                            <ProgressStepper
                                steps={orderSteps}
                                activeStep={order.status}
                                icons={ColorlibStepIcon}
                            />
                        </MDBox>

                        <Box
                            mt={1}
                            sx={{
                                p: {
                                    xs: 0,
                                    sm: 0,
                                    md: 0,
                                    lg: "10px 5px 5px 10px",
                                },
                            }}
                        >
                            <DataTable<IOrderItem>
                                table={{
                                    columns,
                                    rows: data,
                                }}
                                showTotalEntries={false}
                                entriesPerPage={false}
                                noEndBorder={true}
                                canSearch={false}
                                loading={isLoading}
                                onRowClick={(order) => {
                                    const productDetails =
                                        products.details.filter(
                                            (x) => x.id === order.productId
                                        );

                                    dispatch(
                                        SelectedProductAction(productDetails)
                                    );
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
                                ml: 1.2,
                                mr: 0.6,
                                mt: -1,
                                p: {
                                    xs: 0,
                                    sm: 0,
                                    md: 0,
                                    lg: "10px 5px 5px 10px",
                                },
                                borderBottom: {
                                    xs: 0,
                                    sm: 0,
                                    md: 0,
                                    lg: "1px solid #eee",
                                },
                                borderLeft: {
                                    xs: 0,
                                    sm: 0,
                                    md: 0,
                                    lg: "1px solid #eee",
                                },
                                borderRight: {
                                    xs: 0,
                                    sm: 0,
                                    md: 0,
                                    lg: "1px solid #eee",
                                },
                            }}
                        >
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                sx={{ p: 1, mt: 2 }}
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
                {!displayItemsOnly && (
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
                                <Typography className="standard-text">
                                    Arriving: Wednesday, April 3
                                </Typography>
                            </Box>
                            <Box mt={3}>
                                <h2>Shipping Address</h2>
                                <Box
                                    mt={1}
                                    display="flex"
                                    flexDirection={"column"}
                                >
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
                )}
            </Grid>
        </MDBox>
    );
};
