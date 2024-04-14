import { Fade, Grid, Paper, styled } from "@mui/material";
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
    color: theme.palette.text.secondary,
    // boxShadow:
    //     "box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05), 0 15px 40px rgba(166, 173, 201, 0.2);",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    // bosShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px"
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

    return (
        <Fade
            in={true}
            timeout={500}
            mountOnEnter={true}
            unmountOnExit={true}
            className="content"
        >
            <Grid container={true} spacing={3}>
                {isLoading
                    ? (() => {
                          const arr = [];
                          for (let i = 0; i < 3; i++) {
                              arr.push(
                                  <Grid item key={i}>
                                      <Item className="product-item">
                                          <ProductItem
                                              index={i}
                                              loading={true}
                                          />
                                      </Item>
                                  </Grid>
                              );
                          }
                          return arr;
                      })()
                    : products.catalogue.map((product, index) => (
                          <Grid item key={index}>
                              <Item
                                  className="product-item"
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => onProductClick(product)}
                              >
                                  <ProductItem
                                      item={product}
                                      index={index}
                                      loading={false}
                                  />
                              </Item>
                          </Grid>
                      ))}
            </Grid>
        </Fade>
    );
};

export default Products;
