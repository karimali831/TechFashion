import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "../../../../components/MDTypography";
import ProductImages from "../../../../layouts/ecommerce/products/product-page/components/ProductImages";
import ProductInfo from "../../../../layouts/ecommerce/products/product-page/components/ProductInfo";
import dataTableData from "../../../../layouts/ecommerce/products/product-page/data/dataTableData";
import MDBox from "../../../../components/MDBox";
import DataTable from "src/layouts/table/DataTable";

function ProductPage(): JSX.Element {
    return (
        <MDBox py={3}>
            <Card sx={{ overflow: "visible" }}>
                <MDBox p={3}>
                    <MDBox mb={3}>
                        <MDTypography variant="h5" fontWeight="medium">
                            Product Details
                        </MDTypography>
                    </MDBox>

                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={6} xl={5}>
                            <ProductImages />
                        </Grid>
                        <Grid item xs={12} lg={5} sx={{ mx: "auto" }}>
                            <ProductInfo />
                        </Grid>
                    </Grid>

                    <MDBox mt={8} mb={2}>
                        <MDBox mb={1} ml={2}>
                            <MDTypography variant="h5" fontWeight="medium">
                                Other Products
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
