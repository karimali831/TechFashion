import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import React from "react";
import { IFormMessage } from "../../enum/IFormMessage";

interface IOwnProps {
    message: IFormMessage;
}

export const FormMessage: React.FC<IOwnProps> = (props) => {
    const {
        message: { isSuccess, message },
    } = props;

    return (
        <div
            style={{
                flexDirection: "row",
                background: isSuccess ? "#28a745" : "#C41919",
                display: "flex",
                padding: 5,
                marginTop: 5,
                color: "white",
                borderRadius: 10,
                alignItems: "center",
            }}
        >
            {isSuccess ? (
                <CheckOutlinedIcon style={{ marginRight: 5, fontSize: 18 }} />
            ) : (
                <ErrorOutlineIcon style={{ marginRight: 5, fontSize: 18 }} />
            )}
            <span style={{ fontSize: 14 }}>{message}</span>
        </div>
    );
};
