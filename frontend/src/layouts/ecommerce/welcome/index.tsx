import { Box, Typography } from "@mui/material";
import { useAppSelector } from "src/state/Hooks";
import { getAppState } from "src/state/contexts/app/Selectors";

export const Welcome = () => {
    const { welcomeText } = useAppSelector(getAppState);

    let backgroundImg = undefined;

    if (welcomeText.variant === "promotion") {
        backgroundImg = "linear-gradient(195deg, #EF5350, #E53935);";
    } else if (welcomeText.variant === "success") {
        backgroundImg = "linear-gradient(195deg, #66BB6A, #43A047);";
    }

    return (
        <Box
            sx={{
                position: "absolute",
                width: "100%",
                top: 0,
                height: 30,
                background: welcomeText.variant === "default" && "#000",
                backgroundImage: backgroundImg,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Typography
                sx={{
                    color: "white",
                    fontSize: 13,
                    letterSpacing: 1,
                    fontWeight: 400,
                    fontFamily: "Assistant, sans-serif",
                }}
            >
                {welcomeText.text}
            </Typography>
        </Box>
    );
};
