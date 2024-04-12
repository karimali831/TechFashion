import { Box, Fade, Skeleton } from "@mui/material";
import "./styles.less";
import { IProductCatalogue } from "src/interface/IProductCatalogue";

interface IProps {
    index: number;
    item?: IProductCatalogue;
    loading: boolean;
}

export const RandomImages: string[] = [
    "https://d0e430-1f.myshopify.com/cdn/shop/files/KIGo0sX7KYchXMp.jpg?v=1712738008&width=360",
    "https://d0e430-1f.myshopify.com/cdn/shop/files/4b890taYr39XmRR.jpg?v=1712737948&width=360",
    "https://d0e430-1f.myshopify.com/cdn/shop/files/0eItXGV66LJnak8.jpg?v=1712737973&width=360",
    "https://d0e430-1f.myshopify.com/cdn/shop/files/4upnmt8m6CYCew6.jpg?v=1712737948&width=360",
    "https://d0e430-1f.myshopify.com/cdn/shop/files/U15mbtbXJ9dUlzO.jpg?v=1712737998&width=360",
    "https://d0e430-1f.myshopify.com/cdn/shop/files/df9lITfB7UsInxQ.jpg?v=1712738020&width=360",
    "https://d0e430-1f.myshopify.com/cdn/shop/files/phvQXoXvHMg46sQ.jpg?v=1712738038&width=360",
    "https://d0e430-1f.myshopify.com/cdn/shop/files/KeNyoIK0FI3qDfi.png?v=1712737988&width=360",
    "https://d0e430-1f.myshopify.com/cdn/shop/files/HQQnWOx8zxzqvde.png?v=1712737972&width=360",
    "https://d0e430-1f.myshopify.com/cdn/shop/files/jzDgEgwWkDXnNku.jpg?v=1712737962&width=360",
    "https://d0e430-1f.myshopify.com/cdn/shop/files/CBBdhk4MUc8BdT6.jpg?v=1712737983&width=360",
    "https://d0e430-1f.myshopify.com/cdn/shop/files/xqGV4QpGs1lm8ku.jpg?v=1712737988&width=360",
];

const ProductItem = ({ index, item, loading }: IProps) => {
    // const { data } = useGetProductQuery();

    // const mainImage = data.details.filter(x => x.id === item.id)
    //     .map(x => x.imageMain)

    const randomNumber = Math.floor(Math.random() * RandomImages.length);

    return (
        <Fade
            in={true}
            mountOnEnter={true}
            unmountOnExit={true}
            style={{
                transitionDelay: index !== 0 ? index * 100 + "ms" : "0ms",
            }}
        >
            {loading ? (
                <Box
                    display="flex"
                    flexDirection={"column"}
                    overflow={"hidden"}
                >
                    <Skeleton animation="wave" height={235} className="zoom" />
                    <Box>
                        <Skeleton
                            width={"100%"}
                            animation="pulse"
                            height={30}
                        />
                        <Skeleton
                            width={"100%"}
                            animation="pulse"
                            height={30}
                        />
                    </Box>
                </Box>
            ) : (
                <Box
                    display="flex"
                    flexDirection={"column"}
                    overflow={"hidden"}
                >
                    <img
                        // src={item.imageSrc}
                        src={RandomImages[randomNumber]}
                        className="zoom"
                    />
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
            )}
        </Fade>
    );
};

export default ProductItem;
