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
import {
    OpenCartAccountModalAction,
    OpenVerifyEmailModalAction,
} from "src/state/contexts/cart/Actions";
import { ShowPageAction } from "src/state/contexts/app/Actions";
import { Page } from "src/enum/Page";
import { getUserState } from "src/state/contexts/user/Selectors";
import MDTypography from "../MDTypography";
import { IVerificationEmail, IVerificationEmailRequest } from "src/api/userApi";

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
    const { verificationEmail } = useAppSelector(getUserState);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("attempt", attempt);

        if (
            !!guestCheckout &&
            guestCheckout.email !== "" &&
            !verificationEmail.sent
        ) {
            setSendingCode(true);
            const sendVerificationEmail = async () =>
                await axios.post<IApiResponse<IVerificationEmail>>(
                    baseApiUrl + "User/CheckVerificationEmail",
                    {
                        email: guestCheckout.email,
                        send: true,
                    } as IVerificationEmailRequest
                );

            sendVerificationEmail()
                .then(({ data: response }) => {
                    if (response.errorMsg) {
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
                email: guestCheckout.email,
                code: Number(value),
            } as IVerifyEmailRequest)
            .then(({ data: response }) => {
                if (response) {
                    setErrorMsg(null);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Your email address is now verified",
                    });

                    dispatch(OpenVerifyEmailModalAction(false));
                    dispatch(OpenCartAccountModalAction(false));
                    dispatch(ShowPageAction(Page.Cart));
                } else {
                    setErrorMsg(
                        "Incorrect verification code, please try again."
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
                    <Box p={2}>
                        <MDTypography variant="caption" fontWeight="regular">
                            By continuing, your email address will be saved with
                            Tech Fashion.
                        </MDTypography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};