import MDTypography from "src/components/MDTypography";

// Declaring props types for DefaultCell
interface Props {
    value: string;
    link?: boolean;
    suffix?: string | boolean;
    maxLength?: number;
}

function DefaultCell({ value, link, suffix, maxLength }: Props): JSX.Element {
    return (
        <MDTypography
            variant="caption"
            fontWeight="regular"
            color="text"
            sx={{ cursor: link ? "pointer" : "auto" }}
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
};

export default DefaultCell;
