import { Alert, Box, CircularProgress } from "@mui/material";
import VerificationInput from "react-verification-input";
import "./styles.css";
import { IApiResponse, baseApiUrl } from "src/api/baseApi";
import axios from "axios";
import { useAppSelector } from "src/state/Hooks";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { getUserState } from "src/state/contexts/user/Selectors";
import MDTypography from "../MDTypography";
import { IVerificationEmail, IVerificationEmailRequest } from "src/api/userApi";
import { SetEmailVerificationAction } from "src/state/contexts/user/Actions";
import { ShowPageAction } from "src/state/contexts/app/Actions";
import { Page } from "src/enum/Page";

interface IVerifyEmailRequest {
    email: string;
    code: number;
}

interface IProps {
    attempt: number;
}

export const CodeVerification = ({ attempt }: IProps) => {
    const [sendingCode, setSendingCode] = useState<boolean>(false);
    const [verifying, setVerifying] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { guestCheckout } = useAppSelector(getCartState);
    const { user, firebaseUid, verificationEmail } =
        useAppSelector(getUserState);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!!user || guestCheckout.email !== "") {
            setSendingCode(true);
            const sendVerificationEmail = async () =>
                await axios.post<IApiResponse<IVerificationEmail>>(
                    baseApiUrl + "User/CheckVerificationEmail",
                    {
                        email: user?.email ?? guestCheckout.email,
                        send: true,
                        firebaseUid,
                        guestCheckoutId: guestCheckout.id,
                    } as IVerificationEmailRequest
                );

            sendVerificationEmail()
                .then(({ data: response }) => {
                    dispatch(SetEmailVerificationAction(response.data));

                    if (response.data.fullAccountExists) {
                        Swal.fire({
                            icon: "error",
                            title: "Account already exists, please login instead.",
                        });
                    } else if (response.errorMsg) {
                        setErrorMsg(response.errorMsg);
                    } else {
                        setErrorMsg(null);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setErrorMsg(error.message);
                })
                .finally(() => setSendingCode(false));
        }
    }, [attempt]);

    const onComplete = async (value: string) => {
        setVerifying(true);

        await axios
            .post<boolean>(baseApiUrl + "User/VerifyEmail", {
                email: user?.email ?? guestCheckout.email,
                code: Number(value),
            } as IVerifyEmailRequest)
            .then(({ data: response }) => {
                if (response) {
                    setErrorMsg(null);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Your email address is now verified",
                    }).then(() => {
                        dispatch(
                            SetEmailVerificationAction({
                                ...verificationEmail,
                                verified: true,
                            })
                        );

                        dispatch(ShowPageAction(Page.Cart));
                    });
                } else {
                    setErrorMsg(
                        "Verification code is incorrect or has expired. Please try again."
                    );
                }
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "An error occurred",
                    text: error.message,
                });
            })
            .finally(() => setVerifying(false));
    };

    return (
        <Box display="flex" justifyContent="center">
            {sendingCode || verifying ? (
                <CircularProgress />
            ) : (
                <Box display="flex" flexDirection="column" alignItems="center">
                    {errorMsg && (
                        <Box mb={2}>
                            <Alert severity="error">{errorMsg}</Alert>
                        </Box>
                    )}
                    <VerificationInput
                        validChars="0-9"
                        length={6}
                        onComplete={onComplete}
                        inputProps={{ inputMode: "numeric" }}
                        placeholder=""
                        classNames={{
                            container: "container",
                            character: "character",
                            characterInactive: "character--inactive",
                            characterSelected: "character--selected",
                            characterFilled: "character--filled",
                        }}
                    />
                    <Box mt={2}>
                        <MDTypography
                            variant="caption"
                            fontWeight="regular"
                            fontSize="small"
                        >
                            By continuing, your email address will be saved with
                            Elegance Craft.
                        </MDTypography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};
