import { Box, CircularProgress, Fade, Icon } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "./Checkout";
import MDAlert from "src/components/MDAlert";
import { useAppSelector } from "src/state/Hooks";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { useCreatePaymentIntentQuery, useGetCartQuery } from "src/api/cartApi";
import { getUserState } from "src/state/contexts/user/Selectors";
import { ICustomerAddress } from "src/data/ICustomerAddress";
import { useAccountDetailsQuery } from "src/api/userApi";

const stripePromise = loadStripe(
    "pk_test_51MF29cB4n2CpwCrekms5MYYiKzNBOpA20kCPNvON4clMPEwh84j1Mv5rljEj1VHEAUGL9moIjteZZpIcmymsggYw00cJJfvH2O"
);

const appearance = {
    // theme: "stripe",
    variables: {
        // colorPrimary: "#0570de",
        // colorBackground: "#ffffff",
        // colorText: "#30313d",
        // colorDanger: "#df1b41",
        // fontFamily: "Ideal Sans, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "4px",
        // See all possible variables below
    },
};

const loader = "auto";

export type CheckoutProps = {
    clientSecret: string;
    total: string;
    guestEmail: string | null;
    address: ICustomerAddress | null;
};

const CheckoutPage = ({
    clientSecret,
    total,
    guestEmail,
    address,
}: CheckoutProps) => (
    <Elements
        stripe={stripePromise}
        options={{ clientSecret, appearance, loader }}
    >
        <Checkout
            clientSecret={clientSecret}
            total={total}
            guestEmail={guestEmail}
            address={address}
        />
    </Elements>
);

export const Payment = () => {
    const { firebaseUid, user } = useAppSelector(getUserState);
    const { guestCheckout, addressId } = useAppSelector(getCartState);

    const { data: cart } = useGetCartQuery({
        firebaseUid,
        guestCheckoutId: guestCheckout?.id,
    });

    const { data: account, isLoading: accountLoading } = useAccountDetailsQuery(
        user?.id,
        { skip: !user }
    );

    const address = account?.addresses.filter((x) => x.id === addressId)[0];

    const { data: paymentIntent, isFetching: paymentIntentLoading } =
        useCreatePaymentIntentQuery(
            {
                cartId: cart?.id,
                addressId: address?.id,
                firebaseUid,
                guestUser: guestCheckout,
            },
            { skip: !cart }
        );

    if (
        paymentIntentLoading ||
        !cart ||
        accountLoading ||
        !stripePromise ||
        !paymentIntent
    )
        return <CircularProgress />;

    if (paymentIntent.errorMsg) {
        return (
            <Fade in={true} mountOnEnter={true} unmountOnExit={true}>
                <Box>
                    <MDAlert dismissible={true} color="error">
                        <Icon sx={{ mr: 1 }}>error</Icon>
                        {paymentIntent.errorMsg}
                    </MDAlert>
                </Box>
            </Fade>
        );
    }

    return (
        <CheckoutPage
            clientSecret={paymentIntent.clientSecret}
            total={paymentIntent.amount}
            guestEmail={firebaseUid === null && guestCheckout?.email}
            address={address}
        />
    );
};
