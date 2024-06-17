import MDTypography from "src/components/MDTypography";

// Declaring props types for DefaultCell
interface Props {
    value: string;
    link?: boolean;
    suffix?: string | boolean;
    maxLength?: number;
    textAlign?: "left" | "center" | "right";
}

function DefaultCell({
    value,
    link,
    suffix,
    maxLength,
    textAlign,
}: Props): JSX.Element {
    return (
        <MDTypography
            variant="caption"
            fontSize={15}
            fontWeight="regular"
            color="text"
            sx={{
                cursor: link ? "pointer" : "auto",
                textDecoration: link && "underline",
                textAlign,
            }}
        >
            {!maxLength
                ? value
                : value.length > maxLength
                ? value.substring(0, maxLength) + "..."
                : value}
            {suffix && (
                <MDTypography
                    variant="caption"
                    fontWeight="medium"
                    color="secondary"
                >
                    &nbsp;&nbsp;{suffix}
                </MDTypography>
            )}
        </MDTypography>
    );
}

// Declaring default props for DefaultCell
DefaultCell.defaultProps = {
    suffix: "",
    textAlign: "right",
};

export default DefaultCell;
