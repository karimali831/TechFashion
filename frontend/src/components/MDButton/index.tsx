import { FC, ReactNode, forwardRef } from "react";
import { ButtonProps } from "@mui/material";
import MDButtonRoot from "src/components/MDButton/MDButtonRoot";

// Declaring props types for MDButton
interface Props extends Omit<ButtonProps, "color" | "variant"> {
    color?:
        | "white"
        | "primary"
        | "secondary"
        | "info"
        | "success"
        | "warning"
        | "error"
        | "light"
        | "dark"
        | "default";
    variant?: "text" | "contained" | "outlined" | "gradient";
    size?: "small" | "medium" | "large";
    circular?: boolean;
    iconOnly?: boolean;
    children?: ReactNode;
    [key: string]: any;
}

const MDButton: FC<Props> = forwardRef(
    ({ color, variant, size, circular, iconOnly, children, ...rest }, ref) => {
        const darkMode = false;

        return (
            <MDButtonRoot
                {...rest}
                ref={ref}
                color="primary"
                variant={variant === "gradient" ? "contained" : variant}
                size={size}
                ownerState={{
                    color,
                    variant,
                    size,
                    circular,
                    iconOnly,
                    darkMode,
                }}
            >
                {children}
            </MDButtonRoot>
        );
    }
);

// Declaring default props for MDButton
MDButton.defaultProps = {
    color: "white",
    variant: "contained",
    size: "medium",
    circular: false,
    iconOnly: false,
};

export default MDButton;
