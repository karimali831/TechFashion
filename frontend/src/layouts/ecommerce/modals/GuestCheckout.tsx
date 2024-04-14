import { Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionButton } from "src/components/Buttons/ActionButton";
import { FormInput } from "src/components/Form";
import { MDModal } from "src/components/MDModal";
import { Page } from "src/enum/Page";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { ShowPageAction } from "src/state/contexts/app/Actions";
import {
    OpenCartAccountModalAction,
    SetGuestCheckoutAction,
} from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { SetEmailVerificationAttemptAction } from "src/state/contexts/user/Actions";
import { getUserState } from "src/state/contexts/user/Selectors";

export const GuestCheckoutModal = () => {
    const navigate = useNavigate();

    const { emailVerificationAttempt } = useAppSelector(getUserState);
    const { guestCheckout, openAccountModal } = useAppSelector(getCartState);

    const [email, setEmail] = useState<string>(guestCheckout?.email ?? "");

    const dispatch = useAppDispatch();

    const verifyEmail = () => {
        if (guestCheckout.email !== email) {
            dispatch(
                SetEmailVerificationAttemptAction(emailVerificationAttempt + 1)
            );
        }
        dispatch(
            SetGuestCheckoutAction({
                ...guestCheckout,
                email,
            })
        );

        dispatch(OpenCartAccountModalAction(false));
        dispatch(ShowPageAction(Page.VerifyEmail));
    };

    const navToLoginOrRegister = (page: Page) => {
        dispatch(OpenCartAccountModalAction(false));

        if (page === Page.Login) {
            navigate("/login?withCart=true");
        }

        if (page === Page.Register) {
            navigate("/register?withCart=true");
        }
    };

    return (
        <MDModal
            title="Guest Checkout"
            content={
                <Box>
                    <Box mt={1} mb={1}>
                        <span
                            onClick={() => navToLoginOrRegister(Page.Login)}
                            style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            Login
                        </span>{" "}
                        or{" "}
                        <span
                            onClick={() => navToLoginOrRegister(Page.Register)}
                            style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            Register
                        </span>{" "}
                        for faster checkout.
                    </Box>
                    <FormInput
                        placeholder="Enter email address"
                        validation={{
                            value: email,
                            minCharsRequired: 3,
                            maxCharsRequired: 100,
                            emailValidator: true,
                        }}
                        small={true}
                        onChange={(value) => setEmail(value)}
                    />
                    <Box mt={2}>
                        <ActionButton
                            fullWidth={true}
                            disabled={email.length < 4}
                            text="Verify Email"
                            onClick={verifyEmail}
                        />
                    </Box>
                </Box>
            }
            open={openAccountModal && !!guestCheckout}
            onClose={() => dispatch(OpenCartAccountModalAction(false))}
        />
    );
};
