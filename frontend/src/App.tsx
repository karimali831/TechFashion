import { Provider } from "react-redux";
import { store, persistor } from "./state/InitialiseStore";
import { AnimatedRoutes } from "./layouts/navigation/AnimatedRoutes";
import { ThemeProvider } from "@mui/material/styles";
import "./App.css";
import Footer from "./layouts/ecommerce/footer";
import Navbar from "./layouts/navigation/Navbar";
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
                    <Navbar />
                    <AnimatedRoutes />
                    <Footer />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
