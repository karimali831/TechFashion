import { Box, Typography } from "@mui/material";

export const Welcome = () => {
    return (
        <Box
            sx={{
                height: 36,
                background: "#000",
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
                Welcome to our Store
            </Typography>
        </Box>
    );
};
