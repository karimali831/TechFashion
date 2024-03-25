import { Modal, Backdrop, Fade, Box } from "@mui/material";
import { FC, ReactNode } from "react";
import MDBox from "../MDBox";
import { Close } from "@mui/icons-material";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 3,
    borderRadius: 1,
};

interface IProps {
    width?: number | string;
    title?: string;
    titleNode?: ReactNode;
    content: ReactNode;
    open: boolean;
    onClose: () => void;
}

export const MDModal: FC<IProps> = ({
    width,
    title,
    titleNode,
    content,
    open,
    onClose,
}) => {
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={{ ...style, width: width ?? 400 }}>
                    <MDBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        {titleNode ?? title ? <h2>{title}</h2> : null}
                        <MDBox onClick={onClose} sx={{ cursor: "pointer" }}>
                            <Close color="secondary" />
                        </MDBox>
                    </MDBox>
                    {content}
                    {/* <Typography
                        id="transition-modal-description"
                        sx={{ mt: 2 }}
                    >
                        Duis mollis, est non commodo luctus, nisi erat porttitor
                        ligula.
                    </Typography> */}
                </Box>
            </Fade>
        </Modal>
    );
};
