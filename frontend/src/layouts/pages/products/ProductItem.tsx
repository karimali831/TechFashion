import { Box, Fade } from "@mui/material";
import "./styles.less";
import { IProductInfo } from "src/interface/IProductInfo";

interface IProps {
    index: number;
    item: IProductInfo;
}

const ProductItem = ({ index, item }: IProps) => {
    const mainImage = item.images.filter((x) => x.main)[0];

    return (
        <Box>
            <Fade
                in={true}
                style={{
                    transitionDelay: index !== 0 ? index * 100 + "ms" : "0ms",
                }}
            >
                <Box>
                    <img src={mainImage.url} className="zoom" />
                    <Box
                        style={{ marginTop: 10 }}
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                    >
                        <h3 className="title">{item.title}</h3>
                        <span className="price">{item.priceStr}</span>
                    </Box>
                </Box>
            </Fade>
        </Box>
    );
};

export default ProductItem;
