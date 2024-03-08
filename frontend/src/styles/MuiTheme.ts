import { createTheme } from "@mui/material";

export const defaultTheme = createTheme({
    typography: {
        fontFamily: "'Ysabeau SC', sans-serif",
        // fontFamily: '"Open Sans", sans-serif',
        fontWeightRegular: 300,
        button: {
            textTransform: "capitalize",
            letterSpacing: 2,
        },
    },
    palette: {
        primary: {
            // main: "#f39c12",
            main: "#000",
        },
        warning: {
            main: "#f39c12",
        },
        error: {
            main: "#EF5350",
        },
        success: {
            main: "#28A745",
        },
        white: "#FFFFFF",
        transparent: "#FFFFFF",
        black: "#000000",
        light: "#DEF7FF",
        dark: "#000",
        gradients: "#FFFFFF",
        socialMediaColors: "#FFFFFF",
        badgeColors: "#FFFFFF",
        coloredShadows: "#FFFFFF",
        inputBorderColor: "#FFFFFF",
        tabs: "#FFFFFF",
    },
    components: {
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    // Controls default (unchecked) color for the thumb
                    color: "#e7e7e7",
                },
                colorPrimary: {
                    "&.Mui-checked": {
                        // Controls checked color for the thumb
                        color: "#28a745",
                    },
                },
                track: {
                    // Controls default (unchecked) color for the track
                    opacity: 0.2,
                    backgroundColor: "#e7e7e7",
                    ".Mui-checked.Mui-checked + &": {
                        // Controls checked color for the track
                        opacity: 0.7,
                        backgroundColor: "#e7e7e7",
                    },
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                input: {
                    //
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    //
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: "#000",
                    fontWeight: 500,
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    // "&.Mui-focused": {
                    //     color: ""
                    // }
                },
            },
        },
    },
    boxShadows: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
        xxl: "",
        inset: "",
        colored: {
            primary: "",
            secondary: "",
            info: "",
            success: "",
            warning: "",
            error: "",
            light: "",
            dark: "",
        },
        navbarBoxShadow: "",
        sliderBoxShadow: {
            thumb: "",
        },
        tabsBoxShadow: {
            indicator: "",
        },
    },
    borders: {
        borderColor: "",
        borderWidth: {},
        borderRadius: {},
    },
    functions: undefined,
});
