import { Button, CircularProgress } from "@mui/material";
import { FC } from "react";
import { ButtonColor } from "src/types/SideNavColor";

interface IProps {
    text: string;
    onClick: () => void;
    loading?: boolean;
    size?: "small" | "medium" | "large";
    color?: ButtonColor;
    disabled?: boolean;
    outlined?: boolean;
}

export const ActionButton: FC<IProps> = ({
    text,
    outlined,
    disabled,
    color,
    size,
    loading,
    onClick,
}) => {
    return (
        <Button
            disabled={loading || disabled}
            variant={outlined ? "outlined" : "contained"}
            onClick={onClick}
            fullWidth={true}
            startIcon={loading && <CircularProgress size={16} />}
            size={size ?? "medium"}
            color={color ?? "primary"}
        >
            {!loading && text}
        </Button>
    );
};
