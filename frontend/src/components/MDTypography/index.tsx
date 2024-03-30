import { FC, ReactNode, forwardRef } from "react";
import { TypographyProps } from "@mui/material";
import MDTypographyRoot from "src/components/MDTypography/MDTypographyRoot";

// Declaring props types for MDTypography
interface Props extends TypographyProps {
    color?:
        | "inherit"
        | "primary"
        | "secondary"
        | "info"
        | "success"
        | "warning"
        | "error"
        | "light"
        | "dark"
        | "text"
        | "white";
    fontWeight?: "light" | "regular" | "medium" | "bold" | "strong" | undefined;
    textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
    verticalAlign?:
        | "unset"
        | "baseline"
        | "sub"
        | "super"
        | "text-top"
        | "text-bottom"
        | "middle"
        | "top"
        | "bottom";
    textGradient?: boolean;
    textDecoration?: string;
    children: ReactNode;
    opacity?: number;
    onClick?: () => void;
    [key: string]: any;
}

const MDTypography: FC<Props | any> = forwardRef(
    (
        {
            color,
            fontWeight,
            textTransform,
            verticalAlign,
            textGradient,
            textDecoration,
            opacity,
            children,
            onClick,
            ...rest
        },
        ref
    ) => {
        const darkMode = false;

        return (
            <MDTypographyRoot
                {...rest}
                ref={ref}
                onClick={onClick}
                style={{ cursor: onClick ? "pointer" : undefined }}
                ownerState={{
                    color,
                    textTransform,
                    verticalAlign,
                    fontWeight,
                    opacity,
                    textGradient,
                    textDecoration,
                    darkMode,
                }}
            >
                {children}
            </MDTypographyRoot>
        );
    }
);

// Declaring default props for MDTypography
MDTypography.defaultProps = {
    color: "dark",
    fontWeight: undefined,
    textTransform: "none",
    verticalAlign: "unset",
    textGradient: false,
    textDecoration: "none",
    opacity: 1,
};

export default MDTypography;
