import typography from "../../base/typography";
import colors from "../../base/colors";

// import pxToRem from "src/assets/theme/functions/pxToRem";

const { size } = typography;
const { text } = colors;

const dialogContentText = {
    styleOverrides: {
        root: {
            fontSize: size.md,
            color: text.main,
        },
    },
};

export default dialogContentText;
