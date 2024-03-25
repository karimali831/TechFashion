import { Provider } from "react-redux";
import { store, persistor } from "./state/InitialiseStore";
import { AnimatedRoutes } from "./layouts/navigation/AnimatedRoutes";
import { ThemeProvider } from "@mui/material/styles";
import Category from "./layouts/ecommerce/category";
import "./App.css";
import Footer from "./layouts/ecommerce/footer";
import NavbarV2 from "./layouts/navigation/Navbar";
import { PersistGate } from "redux-persist/integration/react";
import theme from "src/assets/theme";
import themeDark from "src/assets/theme-dark";
import { CircularProgress } from "@mui/material";

function App() {
    const darkMode = false;

    return (
        <Provider store={store}>
            <PersistGate loading={<CircularProgress />} persistor={persistor}>
                <ThemeProvider theme={darkMode ? themeDark : theme}>
                    <NavbarV2 />
                    <Category />
                    <AnimatedRoutes />
                    <Footer />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
