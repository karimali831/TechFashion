import { IRouteParams } from "src/types/RouteParams";
import { Order } from "./Order";
import { useParams } from "react-router-dom";
import { Box, LinearProgress } from "@mui/material";
import { useGetOrderByRefQuery } from "src/api/orderApi";
import MDBox from "src/components/MDBox";

export const OrderByRef = () => {
    const { id } = useParams<IRouteParams>();

    const { data: order, isLoading } = useGetOrderByRefQuery(id);

    if (isLoading) return <LinearProgress />;

    return (
        <MDBox className="content">
            <Box className="content-border">
                <Order order={order} displayItemsOnly={false} />
            </Box>
        </MDBox>
    );
};
