import { Box } from "@mui/material";
import { CodeVerification } from "src/components/Form/CodeVerification";
import { MDModal } from "src/components/MDModal";
import MDTypography from "src/components/MDTypography";
import { useAppSelector, useAppDispatch } from "src/state/Hooks";
import {
    OpenCartAccountModalAction,
    OpenVerifyEmailModalAction,
    SetGuestCheckoutAction,
} from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { SetEmailVerificationAttemptAction } from "src/state/contexts/user/Actions";
import { getUserState } from "src/state/contexts/user/Selectors";

export const VerifyEmailModal = () => {
    const { openVerifyEmailModal, guestCheckout } =
        useAppSelector(getCartState);

    const { user, firebaseUid, emailVerificationAttempt } =
        useAppSelector(getUserState);

    const dispatch = useAppDispatch();

    const changeEmail = () => {
        dispatch(
            SetGuestCheckoutAction({
                ...guestCheckout,
                email: "",
            })
        );

        dispatch(OpenCartAccountModalAction(true));
        dispatch(OpenVerifyEmailModalAction(false));
    };

    return (
        <MDModal
            title="Verify Email"
            open={openVerifyEmailModal}
            content={
                <Box mt={1} textAlign={"center"}>
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
            }
            onClose={() => dispatch(OpenVerifyEmailModalAction(false))}
        />
    );
};
