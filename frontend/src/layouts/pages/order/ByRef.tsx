import { IRouteParams } from "src/types/RouteParams";
import { Order } from "./Order";
import { useParams } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { useGetOrderByRefQuery } from "src/api/orderApi";
import MDBox from "src/components/MDBox";

export const OrderByRef = () => {
    const { id } = useParams<IRouteParams>();

    const { data: order, isLoading } = useGetOrderByRefQuery(id);

    if (isLoading) return <LinearProgress />;

    return (
        <MDBox className="content-uncentered" mt={3}>
            <Order order={order} displayItemsOnly={false} />
        </MDBox>
    );
};
