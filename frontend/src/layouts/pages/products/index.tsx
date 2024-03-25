import { Fade, Grid, LinearProgress, Paper, styled } from "@mui/material";
import { SelectedProductAction } from "src/state/contexts/product/Actions";
import ProductItem from "./ProductItem";
import { useGetProductQuery } from "src/api/productApi";
import { IProductCatalogue } from "src/interface/IProductCatalogue";
import { useAppDispatch } from "src/state/Hooks";
import { ShowPageWithParamsAction } from "src/state/contexts/app/Actions";
import { Page } from "src/enum/Page";

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
    const dispatch = useAppDispatch();

    const { data: products, isLoading } = useGetProductQuery();

    const onProductClick = (item: IProductCatalogue) => {
        const productDetails = products.details.filter((x) => x.id === item.id);

        dispatch(SelectedProductAction(productDetails));
        dispatch(
            ShowPageWithParamsAction({
                page: Page.Product,
                primaryId: item.slug,
            })
        );
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
