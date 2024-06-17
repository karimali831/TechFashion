import { CheckCircle } from "@mui/icons-material";
import { Box, Fade } from "@mui/material";
import {
    browserLocalPersistence,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ActionButton } from "src/components/Buttons/ActionButton";
import { FormInput, FormValidation } from "src/components/Form";
import { FormMessage } from "src/components/Form/Message";
import MDBox from "src/components/MDBox";
import { auth } from "src/config/firebase";
import { IFormMessage, IFormMessageCode } from "src/enum/IFormMessage";
import { Page } from "src/enum/Page";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { ShowPageAction } from "src/state/contexts/app/Actions";
import { SigninLoadingAction } from "src/state/contexts/user/Actions";
import { getUserState } from "src/state/contexts/user/Selectors";

type FormFields = {
    email: FormValidation;
    password: FormValidation;
};

const Login = (): JSX.Element => {
    const [messages, setMessages] = useState<IFormMessage[]>([]);

    const dispatch = useAppDispatch();
    const { user, authSuccess, signingIn } = useAppSelector(getUserState);

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                dispatch(ShowPageAction(Page.Account));
            }, 500);
        }
    }, [user]);

    const [formFields, setFormFields] = useState<FormFields>({
        email: {
            value: "",
            emailValidator: true,
        },
        password: {
            value: "",
            minCharsRequired: 6,
        },
    });

    const { email, password } = formFields;

    const formMessage = messages.find(
        (x) =>
            x.code !== IFormMessageCode.InvalidEmail &&
            x.code !== IFormMessageCode.UserNotFound &&
            x.code !== IFormMessageCode.WrongPassword
    );

    const sendForgotPassword = () => {
        sendPasswordResetEmail(auth, email.value)
            .then(() => {
                setMessages([
                    {
                        message:
                            "A link to reset your password has been sent to " +
                            formFields.email.value,
                        isSuccess: true,
                    },
                ]);
            })
            .catch(setFormMessage);
    };

    const handleLogin = () => {
        dispatch(SigninLoadingAction(true));

        auth.setPersistence(browserLocalPersistence)
            .then(() => {
                return signInWithEmailAndPassword(
                    auth,
                    email.value,
                    password.value
                ).catch((message: IFormMessage) => {
                    dispatch(SigninLoadingAction(false));
                    setFormMessage(message);
                });
            })
            .catch((message: IFormMessage) => {
                dispatch(SigninLoadingAction(false));
                setFormMessage(message);
            });
    };

    const setFormMessage = (message: IFormMessage) => {
        const errorExists = messages.some((x) => x.code === message.code);

        if (!errorExists) {
            setMessages((messages) => [...messages, message]);
        }
    };

    const onInputChange = (name: keyof FormFields, text: string) => {
        setFormFields({
            ...formFields,
            [name]: {
                ...formFields[name],
                value: text,
            },
        });
    };

    return (
        <Fade in={true} mountOnEnter={true} unmountOnExit={true} timeout={500}>
            <MDBox className="content">
                <form className="content-border content-small">
                    <h1>Login</h1>
                    <FormInput
                        placeholder="Email"
                        validation={formFields.email}
                        onChange={(e) => onInputChange("email", e)}
                        message={messages.find(
                            (x) =>
                                x.code === IFormMessageCode.InvalidEmail ||
                                x.code === IFormMessageCode.UserNotFound ||
                                x.code === IFormMessageCode.EmailAlreadyInUse
                        )}
                    />

                    <FormInput
                        placeholder="Password"
                        validation={formFields.password}
                        onChange={(e) => onInputChange("password", e)}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                handleLogin();
                            }
                        }}
                        message={messages.find(
                            (x) => x.code === IFormMessageCode.WrongPassword
                        )}
                        passwordToggleEnabled={true}
                    />
                    {!!formMessage && <FormMessage message={formMessage} />}

                    <Box sx={{ mt: "18px", mb: "18px" }}>
                        <span
                            onClick={sendForgotPassword}
                            style={{ textDecoration: "none" }}
                        >
                            Forgot Password?
                        </span>
                        <Link
                            to="/register"
                            style={{
                                marginLeft: "15px",
                                textDecoration: "none",
                            }}
                        >
                            Don't have an account yet?
                        </Link>
                    </Box>

                    <ActionButton
                        icon={
                            signingIn ? (
                                <ClipLoader
                                    color="white"
                                    size={10}
                                    speedMultiplier={0.5}
                                />
                            ) : authSuccess ? (
                                <CheckCircle fontSize={"large"} />
                            ) : undefined
                        }
                        text={!signingIn && authSuccess ? "Signed in" : "Login"}
                        success={authSuccess}
                        onClick={handleLogin}
                    />
                </form>
            </MDBox>
        </Fade>
    );
};

export default Login;
