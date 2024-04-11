import Hero from "./Hero";
import "./Home.css";
import Brands from "./Brands";
import PopularProducts from "./PopularProducts";
import Deals from "./Deals";
import ProductsOnSale from "./ProductsOnSale";
import Showcase from "./Showcase";
import banner from "src/assets/img/ecommerce/banner.jpg";
import MDBox from "src/components/MDBox";
import { Box, Fade } from "@mui/material";

const Home = (): JSX.Element => {
    return (
        <Box>
            <Fade
                in={true}
                mountOnEnter={true}
                unmountOnExit={true}
                timeout={500}
            >
                <MDBox
                    component="img"
                    src={banner}
                    alt="Product Image"
                    width={"100%"}
                />
            </Fade>
            {/* <Category /> */}
            <Fade
                in={true}
                mountOnEnter={true}
                unmountOnExit={true}
                timeout={500}
                style={{ transitionDelay: "250ms" }}
            >
                <Box className="content">
                    <Hero />
                    <Brands />
                    <PopularProducts />
                    <Deals />
                    <ProductsOnSale />
                    <Showcase />
                </Box>
            </Fade>
        </Box>
    );
};

export default Home;
