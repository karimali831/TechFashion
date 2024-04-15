import { Box, Fade, LinearProgress } from "@mui/material";
import { useEffect } from "react";
import { useGetCartQuery } from "src/api/cartApi";
import { CodeVerification } from "src/components/Form/CodeVerification";
import MDBox from "src/components/MDBox";
import MDTypography from "src/components/MDTypography";
import { Page } from "src/enum/Page";
import { GuestCheckout } from "src/layouts/ecommerce/cart/GuestCheckout";
import { useAppSelector, useAppDispatch } from "src/state/Hooks";
import { ShowPageAction } from "src/state/contexts/app/Actions";
import { SetGuestCheckoutAction } from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";
import {
    SetEmailVerificationAttemptAction,
    SignOutAction,
} from "src/state/contexts/user/Actions";
import { getUserState } from "src/state/contexts/user/Selectors";

export const VerifyEmail = () => {
    const { guestCheckout } = useAppSelector(getCartState);

    const { user, firebaseUid, emailVerificationAttempt, verificationEmail } =
        useAppSelector(getUserState);

    const { data: cart, isLoading } = useGetCartQuery({
        firebaseUid,
        guestCheckoutId: guestCheckout?.id,
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (verificationEmail.verified) {
            dispatch(ShowPageAction(Page.Cart));
        }
    }, [verificationEmail]);

    useEffect(() => {
        if (!isLoading && !cart) {
            dispatch(ShowPageAction(Page.Products));
        }
    }, [cart]);

    const changeEmail = () => {
        dispatch(
            SetGuestCheckoutAction({
                ...guestCheckout,
                email: "",
            })
        );
    };

    if (isLoading) {
        return <LinearProgress />;
    }

    if (cart?.showGuestCheckout && guestCheckout?.email === "") {
        return <GuestCheckout />;
    }

    return (
        <Fade in={true} mountOnEnter={true} unmountOnExit={true} timeout={500}>
            <MDBox className="content" textAlign="center">
                <Box className="content-border content-small">
                    <h1>Verify email</h1>
                    <Box mt={1} />
                    {firebaseUid === null && (
                        <MDTypography variant="text" fontWeight="regular">
                            Use your email to sign in — no password needed
                        </MDTypography>
                    )}
                    <Box>
                        <MDTypography
                            variant="caption"
                            fontWeight="regular"
                            fontSize="small"
                        >
                            Confirm it's you by entering the code sent to your
                            email:
                        </MDTypography>{" "}
                        <MDTypography
                            variant="caption"
                            fontWeight="medium"
                            fontSize="small"
                        >
                            {user?.email ?? guestCheckout.email}
                        </MDTypography>
                        {firebaseUid && (
                            <>
                                {" "}
                                <MDTypography
                                    variant="caption"
                                    fontWeight="regular"
                                    textDecoration="underline"
                                    fontSize="small"
                                    onClick={() => dispatch(SignOutAction())}
                                >
                                    (logout)
                                </MDTypography>
                            </>
                        )}
                    </Box>
                    <Box mt={2} sx={{ borderBottom: "1px solid #ccc" }} />
                    <Box mt={2}>
                        <MDTypography
                            variant="caption"
                            fontWeight="regular"
                            fontSize="small"
                        >
                            If you haven't received the email in last 10
                            minutes, you can{" "}
                            <MDTypography
                                variant="caption"
                                fontWeight="regular"
                                textDecoration="underline"
                                fontSize="small"
                                onClick={() =>
                                    dispatch(
                                        SetEmailVerificationAttemptAction(
                                            emailVerificationAttempt + 1
                                        )
                                    )
                                }
                            >
                                request another code
                            </MDTypography>
                            {firebaseUid === null ? (
                                <>
                                    {" or "}
                                    <MDTypography
                                        variant="caption"
                                        fontWeight="regular"
                                        fontSize="small"
                                        textDecoration="underline"
                                        onClick={changeEmail}
                                    >
                                        change your email address
                                    </MDTypography>
                                    {". "}
                                </>
                            ) : null}
                        </MDTypography>
                        <Box mt={2}>
                            <CodeVerification
                                attempt={emailVerificationAttempt}
                            />
                        </Box>
                    </Box>
                </Box>
            </MDBox>
        </Fade>
    );
};
