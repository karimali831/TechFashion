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
    fontSize?: "small" | "medium" | "large" | number;
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
            fontSize,
            opacity,
            children,
            onClick,
            ...rest
        },
        ref
    ) => {
        const darkMode = false;

        if (fontSize === "small") {
            fontSize = 13;
        } else if (fontSize === "medium") {
            fontSize = 16;
        } else if (fontSize === "large") {
            fontSize = 18;
        }

        return (
            <MDTypographyRoot
                {...rest}
                ref={ref}
                onClick={onClick}
                style={{
                    cursor: onClick ? "pointer" : undefined,
                    fontFamily: "Assistant, sans-serif",
                    letterSpacing: 1,
                    fontSize,
                }}
                ownerState={{
                    color,
                    textTransform,
                    verticalAlign,
                    fontWeight,
                    opacity,
                    textGradient,
                    textDecoration,
                    fontSize,
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
    fontSize: "medium",
    opacity: 1,
};

export default MDTypography;
