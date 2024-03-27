import MDTypography from "src/components/MDTypography";

// Declaring props types for DefaultCell
interface Props {
    value: string;
    link?: boolean;
    suffix?: string | boolean;
}

function DefaultCell({ value, link, suffix }: Props): JSX.Element {
    return (
        <MDTypography
            variant="caption"
            fontWeight="medium"
            color="text"
            sx={{ cursor: link ? "pointer" : "auto" }}
        >
            {value}
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
