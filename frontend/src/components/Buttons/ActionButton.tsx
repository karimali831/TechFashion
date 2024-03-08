import { Button } from "@mui/material";
import { FC } from "react";
import { ButtonColor } from "src/types/SideNavColor";

interface IProps {
    text: string;
    onClick: () => void;
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
    onClick,
}) => {
    return (
        <Button
            disabled={disabled}
            variant={outlined ? "outlined" : "contained"}
            onClick={onClick}
            size={size ?? "medium"}
            color={color ?? "primary"}
        >
            {text}
        </Button>
    );
};
