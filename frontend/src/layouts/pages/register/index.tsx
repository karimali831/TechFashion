import { CheckCircle } from "@mui/icons-material";
import { Button, Fade } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useCreateUserMutation } from "src/api/userApi.ts";
import { FormInput, FormValidation } from "src/components/Form";
import { FormMessage } from "src/components/Form/Message";
import { auth } from "src/config/firebase";
import { IFormMessage, IFormMessageCode } from "src/enum/IFormMessage";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { SigninLoadingAction } from "src/state/contexts/user/Actions";
import { getUserState } from "src/state/contexts/user/Selectors";
import Swal from "sweetalert2";

type FormFields = {
    email: FormValidation;
    name: FormValidation;
    password: FormValidation;
    repeatPassword: FormValidation;
};

const Register = (): JSX.Element => {
    const [messages, setMessages] = useState<IFormMessage[]>([]);

    const [createUser] = useCreateUserMutation();

    const navigate = useNavigate();
    const { user, authSuccess, signingIn } = useAppSelector(getUserState);

    useEffect(() => {
        if (user) {
            navigate("/account");
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
        repeatPassword: {
            value: "",
            minCharsRequired: 6,
        },
    });

    const { email, name, password, repeatPassword } = formFields;

    const onInputChange = (name: keyof FormFields, text: string) => {
        setFormFields({
            ...formFields,
            [name]: {
                ...formFields[name],
                value: text,
            },
        });
    };

    const dispatch = useAppDispatch();
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
                                Swal.fire({
                                    icon: "success",
                                    title: "Success",
                                    text: response.data,
                                    timer: 10000,
                                }).then(() => navigate("/login"));
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

    const checkPasswordMismatch = () => {
        const code = IFormMessageCode.PasswowrdsMismatched;
        const errorExists = messages.some((x) => x.code === code);

        if (password.value === "" || repeatPassword.value === "") {
            if (errorExists) {
                setMessages(messages.filter((x) => x.code !== code));
            }
        } else {
            const mismatched =
                formFields.password.value !== formFields.repeatPassword.value;

            if (errorExists && !mismatched) {
                setMessages(messages.filter((x) => x.code !== code));
            } else {
                if (mismatched) {
                    setMessages((messages) => [
                        ...messages,
                        {
                            code,
                            message: "Passwords do no match. hey?",
                            isClient: true,
                        },
                    ]);
                }
            }
        }
    };

    return (
        <Fade in={true} mountOnEnter={true} unmountOnExit={true} timeout={500}>
            <div className="register">
                <form>
                    <h1>Register</h1>
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
                        passwordToggleEnabled={true}
                    />
                    <FormInput
                        placeholder="Repeat password"
                        validation={formFields.repeatPassword}
                        onChange={(e) => onInputChange("repeatPassword", e)}
                        message={messages.find(
                            (x) =>
                                x.code === IFormMessageCode.PasswowrdsMismatched
                        )}
                        onBlur={checkPasswordMismatch}
                        passwordToggleEnabled={true}
                    />
                    {!!formMessage && <FormMessage message={formMessage} />}

                    <div
                        className="register-actions"
                        style={{ marginTop: "18px" }}
                    >
                        <p>
                            Already registered?{" "}
                            <Link
                                to="/login"
                                style={{ textDecoration: "none" }}
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                    <Button
                        disabled={signingIn}
                        variant="contained"
                        onClick={handleSignUp}
                        startIcon={
                            signingIn ? (
                                <ClipLoader
                                    color="white"
                                    size={10}
                                    speedMultiplier={0.5}
                                />
                            ) : authSuccess ? (
                                <CheckCircle />
                            ) : undefined
                        }
                    >
                        {!signingIn && "Register"}
                    </Button>
                </form>
            </div>
        </Fade>
    );
};

export default Register;