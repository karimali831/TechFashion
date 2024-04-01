import { Button, CircularProgress } from "@mui/material";
import { FC, ReactElement } from "react";

interface IProps {
    text: string;
    icon?: ReactElement;
    onClick: () => void;
    loading?: boolean;
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    outlined?: boolean;
    success?: boolean;
    danger?: boolean;
    warning?: boolean;
    width?: number;
    fullWidth?: boolean;
}

export const ActionButton: FC<IProps> = ({
    text,
    icon,
    outlined,
    disabled,
    size,
    fullWidth,
    success,
    loading,
    danger,
    warning,
    width,
    onClick,
}) => {
    let bgColor;

    if (success) {
        bgColor = "#45C419";
    } else if (danger) {
        bgColor = "rgb(196, 25, 25)";
    } else if (warning) {
        bgColor = "rgb(255, 167, 38)";
    } else if (outlined) {
        bgColor = "transparent";
    } else {
        // bgColor = "#195DC4";
        bgColor = "#121212";
    }

    return (
        <Button
            sx={{
                background: bgColor,
                width: fullWidth ? "100%" : width ?? "15%",
                minWidth: 120,
                borderColor: outlined && "#121212",
                padding: size === "small" ? "10px" : "15px",
                color: outlined && "#121212",
            }}
            disabled={loading || disabled}
            variant={outlined ? "outlined" : "contained"}
            onClick={onClick}
            fullWidth={fullWidth}
            startIcon={
                loading ? (
                    <CircularProgress size={size === "small" ? 14 : 16} />
                ) : (
                    icon
                )
            }
            size={size ?? "medium"}
        >
            {!loading && text}
        </Button>
    );
};
