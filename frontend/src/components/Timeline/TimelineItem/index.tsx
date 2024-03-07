import { ReactNode } from "react";
import Icon from "@mui/material/Icon";
import MDBox from "src/components/MDBox";
import MDTypography from "src/components/MDTypography";
import { Skeleton } from "@mui/material";
import { useTimeline } from "../context";
import timelineItem from "./styles";

// Declaring prop types for TimelineItem
interface Props {
    color?:
        | "primary"
        | "secondary"
        | "info"
        | "success"
        | "warning"
        | "error"
        | "dark"
        | "light";
    icon?: ReactNode;
    title?: string;
    dateTime?: string;
    loading?: boolean;
    description?: string;
    lastItem?: boolean;
    [key: string]: any;
}

function TimelineItem({
    color,
    icon,
    title,
    dateTime,
    loading,
    description,
    rightElement,
    lastItem,
}: Props): JSX.Element {
    const isDark = useTimeline();

    return (
        <MDBox
            position="relative"
            mb={3}
            sx={(theme: any) => timelineItem(theme, { lastItem, isDark })}
        >
            <MDBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgColor={color}
                color="white"
                width="2rem"
                height="2rem"
                borderRadius="50%"
                position="absolute"
                top="8%"
                left="2px"
                zIndex={2}
                sx={{ fontSize: ({ typography: { size } }: any) => size.sm }}
            >
                <Icon fontSize="inherit">{loading ? "more_horiz" : icon}</Icon>
            </MDBox>
            <MDBox
                ml={5.75}
                pt={description ? 0.7 : 0.5}
                lineHeight={0}
                maxWidth="30rem"
            >
                {loading ? (
                    <Skeleton
                        animation="pulse"
                        variant="rounded"
                        height={15}
                        width="50%"
                    />
                ) : (
                    <MDTypography
                        variant="button"
                        fontWeight="medium"
                        color={isDark ? "white" : "dark"}
                    >
                        {title}
                    </MDTypography>
                )}
                <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {loading ? (
                        <>
                            <Skeleton
                                animation="pulse"
                                variant="rounded"
                                height={10}
                                width="35%"
                            />
                            <Skeleton
                                animation="wave"
                                variant="rounded"
                                height={20}
                                width={50}
                            />
                        </>
                    ) : (
                        <>
                            <MDTypography
                                variant="caption"
                                color={isDark ? "secondary" : "text"}
                            >
                                {dateTime}
                            </MDTypography>
                            <MDBox>{rightElement}</MDBox>
                        </>
                    )}
                </MDBox>
                <MDBox mt={2} mb={1.5}>
                    {description ? (
                        <MDTypography
                            variant="button"
                            color={isDark ? "white" : "dark"}
                        >
                            {description}
                        </MDTypography>
                    ) : null}
                </MDBox>
            </MDBox>
        </MDBox>
    );
}

// Declaring default props for TimelineItem
TimelineItem.defaultProps = {
    color: "info",
    lastItem: false,
    description: "",
};

export default TimelineItem;
