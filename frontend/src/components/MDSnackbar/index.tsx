import { ReactNode } from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import { SnackbarProps } from "@mui/material";
import MDBox from "src/components/MDBox";
import MDTypography from "src/components/MDTypography";
import MDSnackbarIconRoot from "src/components/MDSnackbar/MDSnackbarIconRoot";
import { SideNavColor } from "src/state/contexts/dashboard/IDashboardState";
import { useAppSelector } from "src/state/Hooks";
import { getDashboardState } from "src/state/contexts/dashboard/Selectors";

// Declaring props types for MDSnackbar
interface Props extends SnackbarProps {
    open: boolean;
    color?: SideNavColor;
    icon: ReactNode;
    title: string;
    dateTime: string;
    content: string;
    close: () => void;
    bgWhite?: boolean;
    autoHideDuration?: number;
    [key: string]: any;
}

function MDSnackbar({
    open,
    color,
    icon,
    title,
    dateTime,
    content,
    close,
    bgWhite,
    autoHideDuration,
    ...rest
}: Props): JSX.Element {
    const { darkMode } = useAppSelector(getDashboardState);

    let titleColor: any;
    let dateTimeColor: any;
    let dividerColor: any;

    if (bgWhite) {
        titleColor = color;
        dateTimeColor = "dark";
        dividerColor = false;
    } else if (color === "light") {
        titleColor = darkMode ? "inherit" : "dark";
        dateTimeColor = darkMode ? "inherit" : "text";
        dividerColor = false;
    } else {
        titleColor = "white";
        dateTimeColor = "white";
        dividerColor = true;
    }

    return (
        <Snackbar
            TransitionComponent={Fade}
            autoHideDuration={autoHideDuration ?? 6000}
            onClose={(
                event: React.SyntheticEvent<any> | Event,
                reason: SnackbarCloseReason
            ) => close()}
            open={open}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            {...rest}
            action={
                <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={close}
                >
                    <Icon fontSize="small">close</Icon>
                </IconButton>
            }
        >
            <MDBox
                variant={bgWhite ? "contained" : "gradient"}
                bgColor={bgWhite ? "white" : color}
                minWidth="21.875rem"
                maxWidth="100%"
                shadow="md"
                borderRadius="md"
                p={1}
                sx={{
                    backgroundColor: ({ palette }: { palette: any }) =>
                        darkMode
                            ? palette.background.card
                            : palette[color] || palette.white.main,
                }}
            >
                <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    color="dark"
                    p={1.5}
                >
                    <MDBox display="flex" alignItems="center" lineHeight={0}>
                        <MDSnackbarIconRoot
                            fontSize="small"
                            ownerState={{ color, bgWhite }}
                        >
                            {icon}
                        </MDSnackbarIconRoot>
                        <MDTypography
                            variant="button"
                            fontWeight="medium"
                            color={titleColor}
                            textGradient={bgWhite}
                        >
                            {title}
                        </MDTypography>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" lineHeight={0}>
                        <MDTypography variant="caption" color={dateTimeColor}>
                            {dateTime}
                        </MDTypography>
                        <Icon
                            sx={{
                                color: ({ palette: { dark, white } }) =>
                                    (bgWhite && !darkMode) || color === "light"
                                        ? dark.main
                                        : white.main,
                                fontWeight: ({
                                    typography: { fontWeightBold },
                                }) => fontWeightBold,
                                cursor: "pointer",
                                marginLeft: 2,
                                transform: "translateY(-1px)",
                            }}
                            onClick={close}
                        >
                            close
                        </Icon>
                    </MDBox>
                </MDBox>
                <Divider sx={{ margin: 0 }} light={dividerColor} />
                <MDBox
                    p={1.5}
                    sx={{
                        fontSize: ({ typography: { size } }) => size.sm,
                        color: ({ palette }: { palette: any }) => {
                            let colorValue =
                                bgWhite || color === "light"
                                    ? palette.text.main
                                    : palette.white.main;

                            if (darkMode) {
                                colorValue =
                                    color === "light"
                                        ? "inherit"
                                        : palette.white.main;
                            }

                            return colorValue;
                        },
                    }}
                >
                    {content}
                </MDBox>
            </MDBox>
        </Snackbar>
    );
}

// Setting default values for the props of MDSnackbar
MDSnackbar.defaultProps = {
    bgWhite: false,
    color: "info",
};

export default MDSnackbar;
