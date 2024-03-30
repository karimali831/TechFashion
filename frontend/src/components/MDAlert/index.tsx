import { useState, ReactNode } from "react";
import Fade from "@mui/material/Fade";
import MDBox from "src/components/MDBox";
import MDAlertRoot from "src/components/MDAlert/MDAlertRoot";
import MDAlertCloseIcon from "src/components/MDAlert/MDAlertCloseIcon";

// Declaring props types for MDAlert
interface Props {
    color?:
        | "primary"
        | "secondary"
        | "info"
        | "success"
        | "warning"
        | "error"
        | "light"
        | "dark";
    dismissible?: boolean;
    children: ReactNode;
    [key: string]: any;
}

function MDAlert({
    color,
    dismissible,
    children,
    ...rest
}: Props): JSX.Element | null {
    const [alertStatus, setAlertStatus] = useState("mount");

    const handleAlertStatus = () => setAlertStatus("fadeOut");

    // The base template for the alert
    const alertTemplate: any = (mount: boolean = true) => (
        <Fade in={mount} timeout={300}>
            <MDAlertRoot ownerState={{ color }} {...rest}>
                <MDBox display="flex" color="white">
                    {children}
                </MDBox>
                {dismissible ? (
                    <MDAlertCloseIcon
                        onClick={mount ? handleAlertStatus : undefined}
                    >
                        &times;
                    </MDAlertCloseIcon>
                ) : null}
            </MDAlertRoot>
        </Fade>
    );

    switch (true) {
        case alertStatus === "mount":
            return alertTemplate();
        case alertStatus === "fadeOut":
            setTimeout(() => setAlertStatus("unmount"), 400);
            return alertTemplate(false);
        default:
            alertTemplate();
            break;
    }

    return null;
}

// Declaring default props for MDAlert
MDAlert.defaultProps = {
    color: "info",
    dismissible: false,
};

export default MDAlert;
