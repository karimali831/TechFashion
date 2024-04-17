import { ReactNode } from "react";
import { Theme } from "@mui/material/styles";
import MDBox from "src/components/MDBox";

interface Props {
    children: ReactNode;
    noBorder?: boolean;
    align?: "left" | "right" | "center";
}

function DataTableBodyCell({ noBorder, align, children }: Props): JSX.Element {
    return (
        <MDBox
            component="td"
            textAlign={align}
            sx={({
                palette: { light },
                typography: { size },
                borders: { borderWidth },
            }: Theme) => ({
                fontSize: size.sm,
                py: { xs: 0, sm: 0, md: 0, lg: 1.5 },
                px: { xs: 0, sm: 0, md: 0, lg: 3 },
                borderBottom: {
                    xs: "none",
                    sm: "none",
                    md: "none",
                    lg: noBorder
                        ? "none"
                        : `${borderWidth[1]} solid ${light.main}`,
                },
            })}
        >
            <MDBox
                // width="max-content"
                color="text"
                sx={{
                    verticalAlign: "middle",
                    display: { md: "block", lg: "inline-block" },
                }}
            >
                {children}
            </MDBox>
        </MDBox>
    );
}

// Declaring default props for DataTableBodyCell
DataTableBodyCell.defaultProps = {
    noBorder: true,
    align: "left",
};

export default DataTableBodyCell;
