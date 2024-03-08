import { ReactNode } from "react";
import Card from "@mui/material/Card";
import MDBox from "src/components/MDBox";
import MDTypography from "src/components/MDTypography";
import { TimelineProvider } from "../context";

// Declaring props types for TimelineList
interface Props {
    title: string;
    dark?: boolean;
    children: ReactNode;
}

function TimelineList({ title, dark, children }: Props): JSX.Element {
    return (
        <TimelineProvider value={dark}>
            <Card>
                <MDBox
                    bgColor={dark ? "dark" : "white"}
                    variant="gradient"
                    borderRadius="xl"
                    sx={{
                        background: ({ palette: { background } }: any) =>
                            background.card,
                    }}
                >
                    <MDBox pt={3} px={3}>
                        <MDTypography
                            variant="h6"
                            fontWeight="medium"
                            color={dark ? "white" : "dark"}
                        >
                            {title}
                        </MDTypography>
                    </MDBox>
                    <MDBox p={2}>{children}</MDBox>
                </MDBox>
            </Card>
        </TimelineProvider>
    );
}

// Declaring default props for TimelineList
TimelineList.defaultProps = {
    dark: false,
};

export default TimelineList;
