import {
    AddressElement,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import PaymentIcon from "@mui/icons-material/Payment";
import { Box, Button } from "@mui/material";
import MDTypography from "src/components/MDTypography";
import { StripePaymentElementChangeEvent } from "@stripe/stripe-js";
import { useAppSelector } from "src/state/Hooks";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { baseWebUrl } from "src/api/baseApi";
import { getUserState } from "src/state/contexts/user/Selectors";

interface IProps {
    clientSecret: string;
    total: string;
}

export const Checkout = ({ clientSecret, total }: IProps) => {
    const [, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState<boolean>();
    const [disabled, setDisabled] = useState<boolean>(true);

    const { user } = useAppSelector(getUserState);
    const { guestCheckout } = useAppSelector(getCartState);

    const stripe = useStripe();
    const elements = useElements();

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
                <Box>
                    {/* <LinkAuthenticationElement
                    // Optional prop for prefilling customer information
                    options={{
                        defaultValues: {
                            email: guestCheckout.email,
                        },
                    }}
                    // onChange={(event) => {
                    //     setEmail(event.value.email);
                    // }}
                /> */}
                    <MDTypography mt={2} mb={1} variant="h6">
                        Shipping
                    </MDTypography>
                    <AddressElement
                        options={{
                            mode: "shipping",

                            allowedCountries: ["UK"],
                            defaultValues: {
                                name: user?.name ?? guestCheckout.name,
                                address: { country: "UK" },
                            },
                        }}
                    />
                    <MDTypography mt={2} mb={1} variant="h6">
                        Payment
                    </MDTypography>
                    <PaymentElement
                        id="payment-element"
                        onChange={handleChange}
                        options={{
                            defaultValues: {
                                billingDetails: {
                                    name: "John Doe",
                                    phone: "888-888-8888",
                                    address: {
                                        postal_code: "10001",
                                        country: "US",
                                    },
                                },
                            },
                        }}
                    />
                </Box>
                {/* {error && <Alert severity="error">{error}</Alert>} */}
                <Box>
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

                    <Button
                        sx={{ mt: 1 }}
                        type="submit"
                        disabled={processing || disabled}
                        variant="contained"
                        color="primary"
                        fullWidth={true}
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
            </Box>
        </form>
    );
};

export default Checkout;
