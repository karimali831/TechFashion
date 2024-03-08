import { Provider } from "react-redux";
import store from "./state/InitialiseStore";
import { AnimatedRoutes } from "./layouts/navigation/AnimatedRoutes";
// import Navbar from "./layouts/navigation/Navbar";
import Category from "./layouts/ecommerce/category";
import "./App.css";
import Footer from "./layouts/ecommerce/footer";
import NavbarV2 from "./layouts/navigation/NavbarV2";
import { defaultTheme } from "./styles/MuiTheme";
import { ThemeProvider } from "@mui/material";

function App() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Provider store={store}>
                {/* <Navbar /> */}
                <NavbarV2 />
                <Category />
                <AnimatedRoutes />
                <Footer />
            </Provider>
        </ThemeProvider>
    );
}

export default App;
