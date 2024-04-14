import { Box } from "@mui/material";
import { CodeVerification } from "src/components/Form/CodeVerification";
import MDBox from "src/components/MDBox";
import MDTypography from "src/components/MDTypography";
import useEffectSkipInitialRender from "src/hooks/useEffectSkipInitialRender";
import { useAppSelector, useAppDispatch } from "src/state/Hooks";
import {
    OpenCartAccountModalAction,
    SetGuestCheckoutAction,
} from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { SetEmailVerificationAttemptAction } from "src/state/contexts/user/Actions";
import { getUserState } from "src/state/contexts/user/Selectors";

export const VerifyEmail = () => {
    const { guestCheckout } = useAppSelector(getCartState);

    const { user, firebaseUid, emailVerificationAttempt } =
        useAppSelector(getUserState);

    const dispatch = useAppDispatch();

    useEffectSkipInitialRender(() => {
        if (!user && guestCheckout?.email === "") {
            dispatch(OpenCartAccountModalAction(true));
        }
    }, [guestCheckout]);

    const changeEmail = () => {
        dispatch(
            SetGuestCheckoutAction({
                ...guestCheckout,
                email: "",
            })
        );
    };

    return (
        <MDBox className="content" mt={1} textAlign={"center"}>
            <Box className="content-border">
                <h1>Verify email</h1>
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
                </Box>
                <Box mt={2} sx={{ borderBottom: "1px solid #ccc" }} />
                <Box mt={2}>
                    <MDTypography
                        variant="caption"
                        fontWeight="regular"
                        fontSize="small"
                    >
                        If you haven't received the email in last 10 minutes,
                        you can{" "}
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
                        <CodeVerification attempt={emailVerificationAttempt} />
                    </Box>
                </Box>
            </Box>
        </MDBox>
    );
};
