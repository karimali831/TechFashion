import { AnimatePresence } from "framer-motion";
import { Route, Routes } from "react-router-dom";
// import Home from "../pages/home";
// import Login from "../pages/login";
// import Products from "../pages/products";
// import Register from "../pages/register";
// import ResetPassword from "../pages/account/resetpassword";
// import Contact from "../pages/contact";
import Accessories from "../ecommerce/category/accessories";
import Footware from "../ecommerce/category/footware";
import Jewelry from "../ecommerce/category/jewelry";
import Mens from "../ecommerce/category/mens";
import Outdoor from "../ecommerce/category/outdoor";
import Outware from "../ecommerce/category/outware";
import Sportsware from "../ecommerce/category/sportsware";
import Womans from "../ecommerce/category/womans";
// import ProductPage from "../ecommerce/products/product-page";
// import { Cart } from "../ecommerce/cart";
// import { Success } from "../ecommerce/payment/Success";
import { AppRoutes } from "src/router/Routes";

export const AnimatedRoutes = () => {
    return (
        <AnimatePresence>
            <Routes>
                {AppRoutes.map((route) => (
                    <Route
                        key={route.page}
                        path={route.path ?? route.url}
                        element={route.element}
                    />
                ))}

                <Route
                    path="/store/category/accessories"
                    element={<Accessories />}
                />
                <Route path="/store/category/outdoor" element={<Outdoor />} />
                <Route path="/store/category/mens" element={<Mens />} />
                <Route path="/store/category/footware" element={<Footware />} />
                <Route path="/store/category/womans" element={<Womans />} />
                <Route path="/store/category/outware" element={<Outware />} />
                <Route path="/store/category/jewelry" element={<Jewelry />} />
                <Route
                    path="/store/category/sportsware"
                    element={<Sportsware />}
                />
                {/* {Routess.map((route, idx) =>
                    <Route
                        key={idx}
                        path={route.path}
                        Component={route.component}
                    />
                )} */}
            </Routes>
        </AnimatePresence>
    );
};
