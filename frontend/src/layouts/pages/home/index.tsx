import Hero from "./Hero";
import "./Home.css";
import Brands from "./Brands";
import PopularProducts from "./PopularProducts";
import Deals from "./Deals";
import ProductsOnSale from "./ProductsOnSale";
import Showcase from "./Showcase";
import { motion } from "framer-motion";
const Home = (): JSX.Element => {
    return (
        <motion.div
            className="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}

            //  initial={{ width: 0 }}
            // animate={{ width: "100%" }}
            // exit={{
            //     x: window.innerWidth,
            //     transition: {
            //         duration: 0.3,
            //     },
            // }}
        >
            <Hero />
            <Brands />
            <PopularProducts />
            <Deals />
            <ProductsOnSale />
            <Showcase />
        </motion.div>
    );
};

export default Home;
