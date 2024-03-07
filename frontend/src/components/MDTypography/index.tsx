import { FC, ReactNode, forwardRef } from "react";
import { TypographyProps } from "@mui/material";
import MDTypographyRoot from "src/components/MDTypography/MDTypographyRoot";
import { useAppSelector } from "src/state/Hooks";
import { getDashboardState } from "src/state/contexts/dashboard/Selectors";

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
    fontWeight?: "light" | "regular" | "medium" | "bold" | undefined;
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
    children: ReactNode;
    opacity?: number;
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
            opacity,
            children,
            ...rest
        },
        ref
    ) => {
        const { darkMode } = useAppSelector(getDashboardState);
        return (
            <MDTypographyRoot
                {...rest}
                ref={ref}
                ownerState={{
                    color,
                    textTransform,
                    verticalAlign,
                    fontWeight,
                    opacity,
                    textGradient,
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
    opacity: 1,
};

export default MDTypography;
