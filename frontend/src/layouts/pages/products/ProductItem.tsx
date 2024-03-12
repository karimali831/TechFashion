import { Box, Fade } from "@mui/material";
import "./styles.less";
import { IProductCatalogue } from "src/interface/IProductCatalogue";

interface IProps {
    index: number;
    item: IProductCatalogue;
}

const ProductItem = ({ index, item }: IProps) => {
    // const { data } = useGetProductQuery();

    // const mainImage = data.details.filter(x => x.id === item.id)
    //     .map(x => x.imageMain)

    return (
        <Box>
            <Fade
                in={true}
                style={{
                    transitionDelay: index !== 0 ? index * 100 + "ms" : "0ms",
                }}
            >
                <Box>
                    <img src={item.imageSrc} className="zoom" />
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
