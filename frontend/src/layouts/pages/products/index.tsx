import { Fade, Grid, Paper, styled } from "@mui/material";
import { useDispatch } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IProductInfo } from "src/interface/IProductInfo";
import { useAppSelector } from "src/state/Hooks";
import { SelectedProductAction } from "src/state/contexts/product/Actions";
import { getProductState } from "src/state/contexts/product/Selectors";
import ProductItem from "./ProductItem";

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
    const { products } = useAppSelector(getProductState);

    // const {} = useGetProductQuery()

    const onProductClick = (item: IProductInfo) => {
        dispatch(SelectedProductAction(item));
        navigate("/product/" + item.slug);
    };

    return (
        <Fade in={true} timeout={500} mountOnEnter={true} unmountOnExit={true} className="home">
            <Grid
                // padding={10}
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                {products.map((product, index) => (
                    <Grid item xs={2} sm={3} md={3} key={index}>
                        <Item sx={{ cursor: "pointer" }} onClick={() => onProductClick(product)}>
                            <ProductItem item={product} index={index} />
                        </Item>
                    </Grid>
                ))}
            </Grid>
        </Fade>
    );
};

export default Products;
