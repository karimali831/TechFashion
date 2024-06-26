import { Cart } from "src/layouts/ecommerce/cart";
import { Success } from "src/layouts/ecommerce/payment/Success";
import ProductPage from "src/layouts/ecommerce/products/product-page";
import { Addresses } from "src/layouts/pages/account/address";
import Billing from "src/layouts/pages/account/billing";
import ResetPassword from "src/layouts/pages/account/resetpassword";
import { ProductImport } from "src/layouts/pages/admin/ProductImport";
import Contact from "src/layouts/pages/contact";
import Home from "src/layouts/pages/home";
import Login from "src/layouts/pages/login";
import Products from "src/layouts/pages/products";
import Register from "src/layouts/pages/register";
import { Page } from "../enum/Page";
import { IRoute } from "./Route";
import { VerifyEmail } from "src/layouts/pages/account/verifyemail";
import { OrderByRef } from "src/layouts/pages/order/ByRef";
import { AccountOrder } from "src/layouts/pages/order";

export const AppRoutes: IRoute[] = [
    {
        page: Page.Home,
        element: <Home />,
        memberOnly: false,
        url: "/",
        displayOnHeader: true,
    },
    {
        page: Page.Login,
        element: <Login />,
        memberOnly: false,
        url: "/login",
    },
    {
        page: Page.Register,
        element: <Register />,
        memberOnly: true,
        url: "/register",
    },
    {
        page: Page.ResetPassword,
        element: <ResetPassword />,
        memberOnly: false,
        url: "/reset-password",
    },
    {
        page: Page.Products,
        element: <Products />,
        memberOnly: false,
        url: "/products",
        displayOnHeader: true,
    },
    {
        page: Page.Product,
        element: <ProductPage />,
        memberOnly: false,
        url: "/product",
        path: "/product/:slug",
    },
    {
        page: Page.Cart,
        element: <Cart />,
        memberOnly: false,
        url: "/cart",
    },
    {
        page: Page.Contact,
        element: <Contact />,
        memberOnly: false,
        url: "/contact",
        displayOnHeader: true,
    },
    {
        page: Page.OrderSuccess,
        element: <Success />,
        memberOnly: false,
        url: "/ordersuccess",
        path: "/ordersuccess/:id",
    },
    {
        page: Page.Account,
        element: <Billing />,
        memberOnly: true,
        url: "/account",
    },
    {
        page: Page.Order,
        element: <OrderByRef />,
        memberOnly: false,
        url: "/order",
        path: "/order/:id",
    },
    ,
    {
        page: Page.AccountOrder,
        element: <AccountOrder />,
        memberOnly: true,
        url: "/account/order",
        path: "/account/order/:id",
    },
    {
        page: Page.Addresses,
        element: <Addresses />,
        memberOnly: true,
        url: "/account/addresses",
    },
    {
        page: Page.ProductImport,
        element: <ProductImport />,
        memberOnly: true,
        adminOnly: true,
        url: "/admin/productimport",
        displayOnHeader: true,
    },
    {
        page: Page.VerifyEmail,
        element: <VerifyEmail />,
        memberOnly: false,
        url: "/account/verifyemail",
        displayOnHeader: false,
    },
];
