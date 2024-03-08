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
import { OpenCartOverlayAction } from "src/state/contexts/cart/Actions";
import { getCartState } from "src/state/contexts/cart/Selectors";
import { OverlaySlider, OverlaySliderSize } from "src/components/OverlaySlider";
import { navData } from "src/assets/data/navData";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { ActionButton } from "src/components/Buttons/ActionButton";

// const pages = ["Home", "Shop", "Blog", "Contact"];
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

function NavbarV2() {
    const navigate: NavigateFunction = useNavigate();

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );
    // const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    //     null
    // );

    const dispatch = useAppDispatch();
    const { openOverlay, itemsInCart } = useAppSelector(getCartState);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    // const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    //     setAnchorElUser(event.currentTarget);
    // };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const navToPage = (url: string) => {
        handleCloseNavMenu();
        navigate(url);
    };

    // const handleCloseUserMenu = () => {
    //     setAnchorElUser(null);
    // };

    return (
        <Box>
            {openOverlay && (
                <OverlaySlider
                    size={OverlaySliderSize.Small}
                    onClose={() => dispatch(OpenCartOverlayAction(false))}
                >
                    <Box display="flex" flexDirection="column" height="100%">
                        {itemsInCart === 0 ? (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                height="100%"
                                justifyContent="center"
                            >
                                <h2 style={{ marginBottom: 10 }}>
                                    Your cart is empty
                                </h2>
                                <ActionButton
                                    size="large"
                                    text="Continue shopping"
                                    onClick={() => window.location.reload()}
                                />
                            </Box>
                        ) : (
                            <Box>
                                <h2>Your cart</h2>
                            </Box>
                        )}
                    </Box>
                </OverlaySlider>
            )}
            <AppBar
                position="static"
                style={{ background: "transparent", color: "black" }}
            >
                <Container>
                    <Toolbar disableGutters>
                        <Box sx={{ display: { xs: "none", md: "flex" } }}>
                            <img
                                src="src/assets/img/logo.png"
                                alt="Tech Fashion"
                                style={{
                                    height: 50,
                                    borderRadius: 5,
                                    objectFit: "cover",
                                }}
                            />
                        </Box>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                ml: 2,
                                display: { xs: "none", md: "flex" },
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            Tech Fashion
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
                                {navData.map((page) => (
                                    <MenuItem
                                        key={page.id}
                                        onClick={() => navToPage(page.url)}
                                    >
                                        <Typography textAlign="center">
                                            {page.name}
                                        </Typography>
                                    </MenuItem>
                                ))}
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
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
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
                            {navData.map((page) => (
                                <Button
                                    key={page.id}
                                    onClick={() => navToPage(page.url)}
                                    sx={{
                                        my: 2,
                                        color: "#999999",
                                        display: "block",
                                        fontSize: "1.2rem",
                                        fontFamily: "'Ysabeau SC', sans-serif",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {page.name}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Badge
                                badgeContent={itemsInCart}
                                color="primary"
                                invisible={itemsInCart === 0}
                            >
                                <Icon
                                    sx={{ cursor: "pointer" }}
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