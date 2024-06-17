import "./styles.less";
import { FC, ReactElement, useState } from "react";
import { Box, Icon, Slide } from "@mui/material";
import { isMobile } from "react-device-detect";

interface IProps {
    size: OverlaySliderSize;
    direction: "left" | "right" | "up" | "down";
    customWidth?: number;
    onClose: () => void;
    children: ReactElement;
}

export enum OverlaySliderSize {
    Small = 400,
    Medium = 600,
    Large = 800,
    XLarge = 1000,
}

export const OverlaySlider: FC<IProps> = ({
    size,
    direction,
    customWidth,
    onClose,
    children,
}) => {
    const [slide, setSlide] = useState<boolean>(true);

    return (
        <Box id="overlay-slider" className="modal-backdrop">
            <Slide
                in={slide}
                direction={direction}
                mountOnEnter={true}
                unmountOnExit={true}
                onExited={onClose}
            >
                <Box
                    id="component-inner"
                    style={{
                        width: customWidth ?? isMobile ? size - 50 : size,
                        right: direction === "right" ? undefined : 0,
                        left: direction === "left" ? undefined : 0,
                        top: direction !== "left" ? 90 : 0,
                    }}
                >
                    {children}
                    <Box className="close" onClick={() => setSlide(false)}>
                        <Icon fontSize={"large"} sx={{ color: "#121212" }}>
                            close
                        </Icon>
                    </Box>
                </Box>
            </Slide>
        </Box>
    );
};
