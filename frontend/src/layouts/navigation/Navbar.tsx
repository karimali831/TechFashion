import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Badge, Icon } from "@mui/material";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import {
    OpenCartAccountModalAction,
    OpenCartOverlayAction,
    OpenVerifyEmailModalAction,
    SetGuestCheckoutAction,
} from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { OverlaySlider, OverlaySliderSize } from "src/components/OverlaySlider";
import { CartOverlay } from "../ecommerce/cart/Overlay";
import { useGetCartQuery } from "src/api/cartApi";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import { MDModal } from "src/components/MDModal";
import { getUserState } from "src/state/contexts/user/Selectors";
import { auth } from "src/config/firebase";
import { ShowPageAction } from "src/state/contexts/app/Actions";
import { Page } from "src/enum/Page";
import { FormInput } from "src/components/Form";
import { ActionButton } from "src/components/Buttons/ActionButton";
import { AppRoutes } from "src/router/Routes";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MDTypography from "src/components/MDTypography";
import { CodeVerification } from "src/components/Form/CodeVerification";
import axios from "axios";
import { IApiResponse, baseApiUrl } from "src/api/baseApi";
import { IVerificationEmail, IVerificationEmailRequest } from "src/api/userApi";
import { SetEmailVerificationAction } from "src/state/contexts/user/Actions";
import Swal from "sweetalert2";

function NavbarV2() {
    const navigate = useNavigate();
    const { user, firebaseUid } = useAppSelector(getUserState);
    const {
        guestCheckout,
        openOverlay,
        openAccountModal,
        openVerifyEmailModal,
    } = useAppSelector(getCartState);

    const [emailVerificationAttempt, setEmailVerificationAttempt] =
        useState<number>(1);
    const [email, setEmail] = useState<string>(guestCheckout?.email ?? "");
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!user && guestCheckout?.email !== "") {
            const checkVerificationEmail = async () =>
                await axios.post<IApiResponse<IVerificationEmail>>(
                    baseApiUrl + "User/CheckVerificationEmail",
                    {
                        email: guestCheckout.email,
                        send: false,
                        firebaseUid,
                        guestCheckoutId: guestCheckout.id,
                    } as IVerificationEmailRequest
                );

            checkVerificationEmail().then(({ data: response }) => {
                if (response.errorMsg) {
                    dispatch(OpenCartAccountModalAction(false));
                    dispatch(OpenVerifyEmailModalAction(false));
                    Swal.fire({
                        title: "An error occurred",
                        text: response.errorMsg,
                    });
                } else {
                    dispatch(SetEmailVerificationAction(response.data));

                    if (response.data.verified) {
                        dispatch(OpenCartAccountModalAction(false));
                        dispatch(OpenVerifyEmailModalAction(false));
                        dispatch(ShowPageAction(Page.Cart));
                    } else if (response.data.sent) {
                        dispatch(OpenCartAccountModalAction(false));
                        dispatch(OpenVerifyEmailModalAction(true));
                    }
                }
            });
        }
    }, [openAccountModal]);

    const { data: cart } = useGetCartQuery({
        firebaseUid,
        guestCheckoutId: guestCheckout?.id,
    });

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const itemsInCart: ICartProductDetail[] = cart?.products ?? [];

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const navToPage = (page: Page) => {
        handleCloseNavMenu();
        dispatch(ShowPageAction(page));
    };

    const verifyEmail = () => {
        if (guestCheckout.email !== email) {
            setEmailVerificationAttempt(emailVerificationAttempt + 1);
        }
        dispatch(
            SetGuestCheckoutAction({
                ...guestCheckout,
                email,
            })
        );

        dispatch(OpenCartAccountModalAction(false));
        dispatch(OpenVerifyEmailModalAction(true));
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
        <Box>
            <MDModal
                title="Verify Email"
                open={openVerifyEmailModal}
                content={
                    <Box mt={2} textAlign={"center"}>
                        {firebaseUid === null && (
                            <MDTypography variant="text" fontWeight="regular">
                                Use your email to sign in — no password needed
                            </MDTypography>
                        )}
                        <Box mt={1} mb={2}>
                            <MDTypography
                                variant="caption"
                                fontWeight="regular"
                            >
                                Confirm it's you by entering the code sent to
                                your email:
                            </MDTypography>{" "}
                            <MDTypography variant="caption" fontWeight="medium">
                                {user?.email ?? email}
                            </MDTypography>
                        </Box>
                        <Box mt={2} sx={{ borderBottom: "1px solid #ccc" }} />
                        <Box mt={2}>
                            <MDTypography
                                variant="caption"
                                fontWeight="regular"
                            >
                                If you haven't received the email in last 10
                                minutes, you can{" "}
                                <MDTypography
                                    variant="caption"
                                    fontWeight="regular"
                                    textDecoration="underline"
                                    onClick={() =>
                                        setEmailVerificationAttempt(
                                            emailVerificationAttempt + 1
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
                                onClick={() =>
                                    navToLoginOrRegister(Page.Register)
                                }
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
            {openOverlay && (
                <OverlaySlider
                    size={OverlaySliderSize.Small}
                    onClose={() => dispatch(OpenCartOverlayAction(false))}
                >
                    <CartOverlay isOverlay={true} />
                </OverlaySlider>
            )}
            <AppBar
                position="static"
                style={{ background: "transparent", color: "black" }}
            >
                <Container>
                    <Toolbar disableGutters>
                        {/* <Box sx={{ display: { xs: "none", md: "flex" } }}>
                            <img
                                src="src/assets/img/logo.png"
                                alt="Tech Fashion"
                                style={{
                                    height: 50,
                                    borderRadius: 5,
                                    objectFit: "cover",
                                }}
                            />
                        </Box> */}
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 5,
                                // ml: 2,
                                display: { xs: "none", md: "flex" },
                                fontFamily: "'Ysabeau SC', sans-serif",
                                fontWeight: 900,
                                lineHeight: 1,
                                fontSize: 52,
                                letterSpacing: 8,
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            Store
                        </Typography>

                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "none" },
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: "block", md: "none" },
                                }}
                            >
                                {AppRoutes.filter((x) => x.displayOnHeader).map(
                                    (route) => (
                                        <MenuItem
                                            key={route.page}
                                            onClick={() =>
                                                navToPage(route.page)
                                            }
                                        >
                                            <Typography textAlign="center">
                                                {route.page}
                                            </Typography>
                                        </MenuItem>
                                    )
                                )}
                            </Menu>
                        </Box>

                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                fontFamily: "'Ysabeau SC', sans-serif",
                                fontWeight: 900,
                                lineHeight: 1,
                                fontSize: 22,
                                letterSpacing: 6,
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            Tech Fashion
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                            }}
                        >
                            {AppRoutes.filter((x) => x.displayOnHeader).map(
                                (route) => (
                                    <Button
                                        key={route.page}
                                        onClick={() => navToPage(route.page)}
                                        sx={{
                                            my: 2,
                                            color: "#999999",
                                            display: "block",
                                            fontSize: "1.2rem",
                                            fontFamily:
                                                "'Ysabeau SC', sans-serif",
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {route.page}
                                    </Button>
                                )
                            )}
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Icon
                                sx={{ cursor: "pointer", mr: 2, fontSize: 30 }}
                                fontSize="medium"
                                onClick={() =>
                                    dispatch(
                                        ShowPageAction(
                                            auth ? Page.Account : Page.Login
                                        )
                                    )
                                }
                            >
                                person_outline
                            </Icon>
                            <Badge
                                badgeContent={itemsInCart.length}
                                color="primary"
                                invisible={itemsInCart.length === 0}
                            >
                                <Icon
                                    sx={{ cursor: "pointer" }}
                                    fontSize="medium"
                                    onClick={() =>
                                        dispatch(
                                            OpenCartOverlayAction(!openOverlay)
                                        )
                                    }
                                >
                                    shopping_cart
                                </Icon>
                            </Badge>
                            {/* <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/2.jpg"
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem
                                    key={setting}
                                    onClick={handleCloseUserMenu}
                                >
                                    <Typography textAlign="center">
                                        {setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu> */}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}
export default NavbarV2;
