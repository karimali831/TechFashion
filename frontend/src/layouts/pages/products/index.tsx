import { Fade, Grid, LinearProgress, Paper, styled } from "@mui/material";
import { useDispatch } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { SelectedProductAction } from "src/state/contexts/product/Actions";
import ProductItem from "./ProductItem";
import { useGetProductQuery } from "src/api/productApi";
import { IProductCatalogue } from "src/interface/IProductCatalogue";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    height: 326,
    width: 270,
    color: theme.palette.text.secondary,
}));

const Products = () => {
    const navigate: NavigateFunction = useNavigate();

    const dispatch = useDispatch();
    // const { products } = useAppSelector(getProductState);

    const { data: products, isLoading } = useGetProductQuery();

    const onProductClick = (item: IProductCatalogue) => {
        const productDetails = products.details.filter((x) => x.id === item.id);

        dispatch(SelectedProductAction(productDetails));
        navigate("/product/" + item.slug);
    };

    if (isLoading) {
        return <LinearProgress />;
    }

    return (
        <Fade
            in={true}
            timeout={500}
            mountOnEnter={true}
            unmountOnExit={true}
            className="home"
        >
            <Grid
                // padding={10}
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                {products.catalogue.map((product, index) => (
                    <Grid item xs={2} sm={3} md={3} key={index}>
                        <Item
                            sx={{ cursor: "pointer" }}
                            onClick={() => onProductClick(product)}
                        >
                            <ProductItem item={product} index={index} />
                        </Item>
                    </Grid>
                ))}
            </Grid>
        </Fade>
    );
};

export default Products;
