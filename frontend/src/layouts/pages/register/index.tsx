import { CheckCircle } from "@mui/icons-material";
import { Box, Fade } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useGetCartQuery } from "src/api/cartApi";
import { useCreateUserMutation } from "src/api/userApi";
import { ActionButton } from "src/components/Buttons/ActionButton";
import { FormInput, FormValidation } from "src/components/Form";
import { FormMessage } from "src/components/Form/Message";
import { auth } from "src/config/firebase";
import { IFormMessage, IFormMessageCode } from "src/enum/IFormMessage";
import { Page } from "src/enum/Page";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { ShowPageAction } from "src/state/contexts/app/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";
import {
    LoginSuccessAction,
    SigninLoadingAction,
} from "src/state/contexts/user/Actions";
import { getUserState } from "src/state/contexts/user/Selectors";
import Swal from "sweetalert2";

type FormFields = {
    email: FormValidation;
    name: FormValidation;
    password: FormValidation;
};

const Register = (): JSX.Element => {
    const [messages, setMessages] = useState<IFormMessage[]>([]);

    const { guestCheckout } = useAppSelector(getCartState);
    const { user, authSuccess, signingIn, firebaseUid } =
        useAppSelector(getUserState);

    const { data: cart, isLoading } = useGetCartQuery({
        firebaseUid,
        guestCheckoutId: guestCheckout?.id,
    });

    const [createUser, { isLoading: creating }] = useCreateUserMutation();

    const dispatch = useAppDispatch();

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
        name: {
            value: "",
            minCharsRequired: 3,
        },
        password: {
            value: "",
            minCharsRequired: 6,
        },
    });

    const { email, name, password } = formFields;

    const onInputChange = (name: keyof FormFields, text: string) => {
        setFormFields({
            ...formFields,
            [name]: {
                ...formFields[name],
                value: text,
            },
        });
    };

    const formMessage = messages.find(
        (x) =>
            x.code !== IFormMessageCode.InvalidEmail &&
            x.code !== IFormMessageCode.UserNotFound &&
            x.code !== IFormMessageCode.WrongPassword &&
            x.code !== IFormMessageCode.PasswowrdsMismatched &&
            x.code !== IFormMessageCode.EmailAlreadyInUse
    );

    const handleSignUp = () => {
        dispatch(SigninLoadingAction(true));

        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredentials) => {
                const user = userCredentials.user;

                if (user) {
                    createUser({
                        name: name.value,
                        guestCheckoutId: guestCheckout?.id,
                        email: email.value,
                        firebaseUid: user.uid,
                    })
                        .unwrap()
                        .then((response) => {
                            if (response.errorMsg) {
                                Swal.fire({
                                    icon: "error",
                                    title: "An error occurred",
                                    text: response.errorMsg,
                                });
                            } else {
                                dispatch(LoginSuccessAction(response.data));

                                Swal.fire({
                                    icon: "success",
                                    title: "Success",
                                    text: "Account created and you are now logged in.",
                                    timer: 3000,
                                }).then(() =>
                                    dispatch(ShowPageAction(Page.Account))
                                );
                            }
                        });
                }

                dispatch(SigninLoadingAction(false));
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

    return (
        <Fade in={true} mountOnEnter={true} unmountOnExit={true} timeout={500}>
            <Box className="content">
                <form className="content-border content-small">
                    <h1>Register</h1>
                    {cart?.showGuestCheckout && (
                        <Box mt={1}>
                            <span
                                onClick={() =>
                                    dispatch(ShowPageAction(Page.VerifyEmail))
                                }
                                style={{
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                }}
                            >
                                Continue with Guest checkout
                            </span>
                        </Box>
                    )}
                    <FormInput
                        placeholder="Full name"
                        validation={formFields.name}
                        onChange={(e) => onInputChange("name", e)}
                    />
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
                        message={messages.find(
                            (x) => x.code === IFormMessageCode.WrongPassword
                        )}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                handleSignUp();
                            }
                        }}
                        passwordToggleEnabled={true}
                    />
                    {!!formMessage && <FormMessage message={formMessage} />}

                    <Box sx={{ mt: "18px", mb: "18px" }}>
                        Already registered?{" "}
                        <Link to="/login" style={{ textDecoration: "none" }}>
                            Login
                        </Link>
                    </Box>
                    <ActionButton
                        icon={
                            signingIn || creating ? (
                                <ClipLoader
                                    color="white"
                                    size={10}
                                    speedMultiplier={0.5}
                                />
                            ) : authSuccess ? (
                                <CheckCircle />
                            ) : undefined
                        }
                        text={!signingIn && !creating && "Register"}
                        success={authSuccess}
                        onClick={handleSignUp}
                    />
                </form>
            </Box>
        </Fade>
    );
};

export default Register;
