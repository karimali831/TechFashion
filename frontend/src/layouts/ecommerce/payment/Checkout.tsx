import {
    AddressElement,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import PaymentIcon from "@mui/icons-material/Payment";
import { Alert, Box, Button, Typography } from "@mui/material";
import MDTypography from "src/components/MDTypography";
import { StripePaymentElementChangeEvent } from "@stripe/stripe-js";
import { baseWebUrl } from "src/api/baseApi";
import { CheckoutProps } from ".";
import { useAppDispatch } from "src/state/Hooks";
import { OpenSelectAddressModalAction } from "src/state/contexts/cart/Actions";

export const Checkout = ({
    guestEmail,
    clientSecret,
    total,
    address,
}: CheckoutProps) => {
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState<boolean>();
    const [disabled, setDisabled] = useState<boolean>(true);

    const stripe = useStripe();
    const elements = useElements();

    const dispatch = useAppDispatch();

    if (!stripe || !elements) return null;

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        setProcessing(true);
        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();

        setError(submitError?.message ?? null);

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${baseWebUrl}/ordersuccess`,
            },
        });

        if (error) {
            setError(`Payment failed ${error.message}`);
            setProcessing(false);
        }
    };

    const handleChange = async (event: StripePaymentElementChangeEvent) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
    };

    return (
        <form
            id="payment-form"
            onSubmit={handleSubmit}
            style={{ width: "100%" }}
        >
            <Box>
                {guestEmail && (
                    <MDTypography variant="text" fontWeight="regular">
                        {guestEmail}
                    </MDTypography>
                )}
                <MDTypography mt={2} mb={2} variant="h6" display="flex">
                    Shipping address
                    {!guestEmail && (
                        <Box
                            sx={{ ml: 1 }}
                            onClick={() =>
                                dispatch(OpenSelectAddressModalAction(true))
                            }
                        >
                            <Typography className="standard-text link">
                                (change)
                            </Typography>
                        </Box>
                    )}
                </MDTypography>
                {address ? (
                    <Box>
                        <Typography className="standard-text">
                            {address.name}
                        </Typography>
                        <Typography className="standard-text">
                            {address.line1}
                        </Typography>
                        <Typography className="standard-text">
                            {address.city}
                        </Typography>
                        <Typography className="standard-text">
                            {address.postalCode}, {address.country}
                        </Typography>
                    </Box>
                ) : (
                    <AddressElement
                        options={{
                            mode: "shipping",
                            allowedCountries: ["UK"],
                            // defaultValues: {
                            //     name: address?.name ?? "",
                            //     address: {
                            //         line1: address?.line1 ?? "",
                            //         line2: address?.line2 ?? "",
                            //         city: address?.city ?? "",
                            //         postal_code: address?.postalCode ?? "",
                            //         country: address?.country,
                            //     },
                            // },
                        }}
                    />
                )}
                <MDTypography mt={4} mb={2} variant="h6">
                    Payment details
                </MDTypography>
                <PaymentElement id="payment-element" onChange={handleChange} />
            </Box>
            {error && (
                <Box mt={1}>
                    <Alert severity="error">
                        <Typography className="standard-text">
                            {error}
                        </Typography>
                    </Alert>
                </Box>
            )}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="align"
                sx={{
                    mt: 3,
                }}
            >
                <MDTypography>Total</MDTypography>
                <MDTypography>{total}</MDTypography>
            </Box>
            <Box
                sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    type="submit"
                    disabled={processing || disabled}
                    variant="contained"
                    color="primary"
                    // fullWidth={true}
                    startIcon={
                        processing ? (
                            <ClipLoader
                                color="white"
                                size={10}
                                speedMultiplier={0.5}
                            />
                        ) : (
                            <PaymentIcon />
                        )
                    }
                >
                    {processing ? "Submitting" : "Pay Now"}
                </Button>
            </Box>
        </form>
    );
};

export default Checkout;
