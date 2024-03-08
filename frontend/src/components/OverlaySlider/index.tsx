import "./styles.less";
import { FC, ReactElement, useState } from "react";
import { Box, Icon, Slide } from "@mui/material";

interface IProps {
    size: OverlaySliderSize;
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
    customWidth,
    onClose,
    children,
}) => {
    const [slide, setSlide] = useState<boolean>(true);

    return (
        <Box id="overlay-slider" className="modal-backdrop">
            <Slide
                in={slide}
                direction="left"
                mountOnEnter={true}
                unmountOnExit={true}
                onExited={onClose}
            >
                <Box
                    id="component-inner"
                    style={{ width: customWidth ?? size }}
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
