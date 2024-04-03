import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "../../../../components/MDTypography";
import ProductImages from "../../../../layouts/ecommerce/products/product-page/components/ProductImages";
import ProductInfo from "../../../../layouts/ecommerce/products/product-page/components/ProductInfo";
import dataTableData from "../../../../layouts/ecommerce/products/product-page/data/dataTableData";
import MDBox from "../../../../components/MDBox";
import DataTable from "src/layouts/table/DataTable";
import { Box, Icon, Skeleton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "src/state/Hooks";
import { getProductState } from "src/state/contexts/product/Selectors";
import { useEffect } from "react";
import { SelectedProductAction } from "src/state/contexts/product/Actions";
import { useParams } from "react-router-dom";
import { ProductRouteParams } from "src/types/RouteParams";
import { useGetProductQuery } from "src/api/productApi";
import { GoBackAction } from "src/state/contexts/app/Actions";

function ProductPage(): JSX.Element {
    const { slug } = useParams<ProductRouteParams>();

    const dispatch = useAppDispatch();

    const { selectedProduct } = useAppSelector(getProductState);

    const { data: products, isLoading } = useGetProductQuery();

    useEffect(() => {
        if (!!products && selectedProduct.length === 0) {
            const findItem = products.details.filter((x) => x.slug === slug);
            dispatch(SelectedProductAction(findItem));
        }
    }, [products]);

    // if (selectedProduct.length === 0 || isLoading) {
    //     return <LinearProgress />;
    // }

    return (
        <MDBox py={3} className="home">
            <Card sx={{ overflow: "visible" }}>
                <MDBox p={3}>
                    <MDBox mb={3} display="flex" alignItems="center">
                        <Icon
                            onClick={() => dispatch(GoBackAction())}
                            sx={{ cursor: "pointer" }}
                        >
                            arrow_back
                        </Icon>
                        <MDTypography ml={1} variant="h5" fontWeight="medium">
                            Product Details
                        </MDTypography>
                    </MDBox>

                    <Grid container>
                        <Grid item xs={12} lg={6} xl={5}>
                            {isLoading ? (
                                <Box>
                                    <Skeleton
                                        animation="wave"
                                        width="100%"
                                        height={200}
                                        variant="rounded"
                                    />
                                </Box>
                            ) : (
                                <ProductImages />
                            )}
                        </Grid>

                        <Grid item xs={12} lg={5} sx={{ mx: "auto" }}>
                            <ProductInfo
                                item={selectedProduct}
                                loading={isLoading}
                            />
                        </Grid>
                    </Grid>

                    <MDBox mt={8} mb={2}>
                        <MDBox mb={1} ml={2}>
                            <MDTypography variant="h5" fontWeight="medium">
                                You may also like
                            </MDTypography>
                        </MDBox>
                        <DataTable
                            table={dataTableData}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            isSorted={false}
                            loading={false}
                        />
                    </MDBox>
                </MDBox>
            </Card>
        </MDBox>
    );
}

export default ProductPage;
