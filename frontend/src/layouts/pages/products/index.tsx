import { Fade, Paper, styled } from "@mui/material";
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
    // boxShadow: "rgb(0 0 0) 0px 5px 15px",
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
        <Fade in={true} timeout={500} mountOnEnter={true} unmountOnExit={true}>
            <div className="grid-1">
                {isLoading
                    ? (() => {
                          const arr = [];
                          for (let i = 0; i < 3; i++) {
                              arr.push(
                                  <Item key={i} className="product-item">
                                      <ProductItem index={i} loading={true} />
                                  </Item>
                              );
                          }
                          return arr;
                      })()
                    : products.catalogue.map((product, index) => (
                          <Item
                              key={index}
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
                      ))}
            </div>
        </Fade>
    );
};

export default Products;
