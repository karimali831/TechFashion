import { FC, forwardRef } from "react";
import MDTypography from "src/components/MDTypography";
import MDProgressRoot from "src/components/MDProgress/MDProgressRoot";

// Delcare props types for MDProgress
interface Props {
    variant?: "contained" | "gradient";
    color?:
        | "primary"
        | "secondary"
        | "info"
        | "success"
        | "warning"
        | "error"
        | "light"
        | "dark";
    value: number;
    labelOverride?: string;
    displayLabel?: boolean;
    [key: string]: any;
}

const MDProgress: FC<Props> = forwardRef(
    ({ variant, color, value, displayLabel, labelOverride, ...rest }, ref) => (
        <>
            {displayLabel && (
                <MDTypography
                    variant="button"
                    fontSize={11}
                    fontWeight="medium"
                    color="text"
                >
                    {labelOverride ?? value + "%"}
                </MDTypography>
            )}
            <MDProgressRoot
                {...rest}
                ref={ref}
                variant="determinate"
                value={value}
                ownerState={{ color, value, variant }}
            />
        </>
    )
);

// Declaring default props for MDProgress
MDProgress.defaultProps = {
    variant: "contained",
    color: "info",
    value: 0,
    displayLabel: false,
};

export default MDProgress;
