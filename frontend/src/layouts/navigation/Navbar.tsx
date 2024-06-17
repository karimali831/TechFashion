import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { Badge, Button, Icon } from "@mui/material";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import {
    OpenCartOverlayAction,
    SetAddressIdAction,
} from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { OverlaySlider, OverlaySliderSize } from "src/components/OverlaySlider";
import { CartOverlay } from "../ecommerce/cart/Overlay";
import { useGetCartQuery } from "src/api/cartApi";
import { ICartProductDetail } from "src/interface/ICartProductDetail";
import { getUserState } from "src/state/contexts/user/Selectors";
import { auth } from "src/config/firebase";
import { ShowPageAction } from "src/state/contexts/app/Actions";
import { Page } from "src/enum/Page";
import { AppRoutes } from "src/router/Routes";
import { useEffect, useState } from "react";
import Logo from "src/assets/img/ec-logo.png";
import { useAccountDetailsQuery } from "src/api/userApi";
import { getAppState } from "src/state/contexts/app/Selectors";
import { ShippingAddressModal } from "../ecommerce/modals/ShippingAddress";
import MDBox from "src/components/MDBox";
import { Close } from "@mui/icons-material";
import { Welcome } from "../ecommerce/welcome";

const MenuLinkStyle: React.CSSProperties = {
    cursor: "pointer",
    marginRight: 30,
    fontFamily: "Assistant, sans-serif",
    color: "#ccc",
    fontSize: 14,
    textTransform: "none",
    letterSpacing: 0.6,
    fontWeight: 400,
    textUnderlineOffset: 3,
    transitionBehavior: "normal",
    transitionDuration: "0.1s",
    transitionProperty: "text-decoration",
    transitionTimingFunction: "ease",
};

function Navbar() {
    const [anchorElCategories, setAnchorElCategories] =
        React.useState<null | HTMLElement>(null);
    const openCategories = Boolean(anchorElCategories);
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const { page } = useAppSelector(getAppState);
    const { user, firebaseUid } = useAppSelector(getUserState);
    const { guestCheckout, openOverlay } = useAppSelector(getCartState);

    const { data: account } = useAccountDetailsQuery(user?.id, { skip: !user });

    const defaultAddress = account?.addresses.filter((x) => x.main)[0];

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (defaultAddress) {
            dispatch(SetAddressIdAction(defaultAddress.id));
        }
    }, [defaultAddress]);

    const { data: cart } = useGetCartQuery({
        firebaseUid,
        guestCheckoutId: guestCheckout?.id,
    });

    const itemsInCart: ICartProductDetail[] = cart?.products ?? [];

    const navToPage = (page: Page) => {
        setOpenMenu(false);
        dispatch(ShowPageAction(page));
    };

    const handleCategoriesClose = () => {
        setAnchorElCategories(null);
    };

    const handleCategoriesClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorElCategories(event.currentTarget);
    };

    return (
        <Box
            className="nav"
            sx={{
                background: "#1d1d1d",
                borderBottom: ".1rem solid rgba(0,0,0, .08)",
                mb: 13,
            }}
        >
            <ShippingAddressModal />
            {openOverlay && (
                <OverlaySlider
                    direction="left"
                    size={OverlaySliderSize.Small}
                    onClose={() => dispatch(OpenCartOverlayAction(false))}
                >
                    <CartOverlay isOverlay={true} />
                </OverlaySlider>
            )}
            <AppBar
                position="fixed"
                className="content"
                sx={{
                    zIndex: 1030,
                    background: "#1d1d1d",
                    color: "#ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: { xs: 90, md: 115 },
                }}
            >
                <Welcome />
                <Container
                    maxWidth={false}
                    className="content"
                    sx={{ position: "relative", top: 15, p: 0 }}
                >
                    <Toolbar disableGutters>
                        <Box
                            sx={{
                                display: { xs: "none", md: "flex" },
                                cursor: "pointer",
                                mr: 4,
                            }}
                            onClick={() => dispatch(ShowPageAction(Page.Home))}
                        >
                            <img
                                src={Logo}
                                alt="Elegance Craft"
                                style={{
                                    height: 50,
                                    borderRadius: 5,
                                    objectFit: "cover",
                                }}
                            />
                        </Box>
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
                                onClick={() => setOpenMenu(!openMenu)}
                                color="inherit"
                            >
                                {openMenu ? <Close /> : <MenuIcon />}
                            </IconButton>
                            {openMenu && (
                                <OverlaySlider
                                    direction="right"
                                    size={OverlaySliderSize.Small}
                                    onClose={() => setOpenMenu(false)}
                                >
                                    <MDBox>
                                        {AppRoutes.filter(
                                            (x) => x.displayOnHeader
                                        ).map((route) => (
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
                                        ))}
                                    </MDBox>
                                </OverlaySlider>
                            )}
                        </Box>

                        <Box
                            sx={{
                                display: { xs: "flex", md: "none" },
                                cursor: "pointer",
                                mr: 5,
                            }}
                            onClick={() => dispatch(ShowPageAction(Page.Home))}
                        >
                            <img
                                src={Logo}
                                alt="Elegance Craft"
                                style={{
                                    height: 40,
                                    width: 200,

                                    objectFit: "cover",
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: {
                                    xs: "none",
                                    md: "flex",
                                    alignItems: "center",
                                },
                            }}
                        >
                            {AppRoutes.filter((x) => x.displayOnHeader).map(
                                (route) => (
                                    <a
                                        key={route.page}
                                        onClick={() => navToPage(route.page)}
                                        style={{
                                            ...MenuLinkStyle,
                                            textDecoration:
                                                page === route.page &&
                                                "underline",
                                        }}
                                    >
                                        {route.page}
                                    </a>
                                )
                            )}
                            <Button
                                id="basic-button"
                                aria-controls={open ? "basic-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={handleCategoriesClick}
                                style={MenuLinkStyle}
                                sx={{ m: 0, p: 0 }}
                            >
                                Categories{" "}
                                <Icon sx={{ ml: 1 }}>
                                    {!openCategories
                                        ? "keyboard_arrow_down"
                                        : "keyboard_arrow_up"}
                                </Icon>
                            </Button>
                            <Menu
                                anchorEl={anchorElCategories}
                                open={openCategories}
                                onClose={handleCategoriesClose}
                                MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                }}
                            >
                                <MenuItem onClick={handleCategoriesClose}>
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={handleCategoriesClose}>
                                    My account
                                </MenuItem>
                                <MenuItem onClick={handleCategoriesClose}>
                                    Logout
                                </MenuItem>
                            </Menu>
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
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}
export default Navbar;
