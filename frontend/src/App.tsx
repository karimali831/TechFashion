import { Provider } from "react-redux";
import store from "./state/InitialiseStore";
import { AnimatedRoutes } from "./layouts/navigation/AnimatedRoutes";
import { ThemeProvider } from "@mui/material/styles";
import Category from "./layouts/ecommerce/category";
import "./App.css";
import Footer from "./layouts/ecommerce/footer";
import NavbarV2 from "./layouts/navigation/NavbarV2";
import theme from "src/assets/theme";
import themeDark from "src/assets/theme-dark";

function App() {
    const darkMode = false;

    return (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            <Provider store={store}>
                <NavbarV2 />
                <Category />
                <AnimatedRoutes />
                <Footer />
            </Provider>
        </ThemeProvider>
    );
}

export default App;
