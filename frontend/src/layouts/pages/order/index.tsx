import { LinearProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAccountDetailsQuery } from "src/api/userApi";
import MDBox from "src/components/MDBox";
import { Page } from "src/enum/Page";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { ShowPageAction } from "src/state/contexts/app/Actions";
import { getUserState } from "src/state/contexts/user/Selectors";
import { IRouteParams } from "src/types/RouteParams";
import { Order } from "./Order";

export const AccountOrder = () => {
    const { user } = useAppSelector(getUserState);

    const { id } = useParams<IRouteParams>();
    const orderRef = Number(id);

    const dispatch = useAppDispatch();

    const { data: account, isLoading: accountLoading } = useAccountDetailsQuery(
        user?.id,
        {
            skip: !user,
        }
    );

    const order = account?.orders.filter((x) => x.ref == orderRef)[0];

    if (accountLoading || !order) {
        return <LinearProgress />;
    }

    return (
        <MDBox mt={4} className="content-uncentered">
            <h1>Account</h1>
            <span
                className="standard-text link"
                onClick={() => dispatch(ShowPageAction(Page.Account))}
            >
                Return to Account details
            </span>
            <Order order={order} displayItemsOnly={false} />
        </MDBox>
    );
};
