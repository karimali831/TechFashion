import { Box, Fade } from "@mui/material";
import "./styles.less";
import { IProductInfo } from "src/interface/IProductInfo";

interface IProps {
    index: number;
    item: IProductInfo;
}

const ProductItem = ({ index }: IProps) => {
    return (
        <Box>
            <Fade
                in={true}
                style={{
                    transitionDelay: index !== 0 ? index * 100 + "ms" : "0ms",
                }}
            >
                <Box>
                    <img src="src/assets/img/footware.jpg" className="zoom" />
                    <Box
                        style={{ marginTop: 10 }}
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                    >
                        <h3 className="title">Product Title</h3>
                        <span className="price">£44.40</span>
                    </Box>
                </Box>
            </Fade>
        </Box>
    );
};

export default ProductItem;
