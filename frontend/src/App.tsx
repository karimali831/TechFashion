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
import { Box, CircularProgress } from "@mui/material";
import { Welcome } from "./layouts/ecommerce/welcome";

function App() {
    const darkMode = false;

    return (
        <Provider store={store}>
            <PersistGate loading={<CircularProgress />} persistor={persistor}>
                <ThemeProvider theme={darkMode ? themeDark : theme}>
                    <Welcome />
                    <Box>
                        <Navbar />
                        <AnimatedRoutes />
                    </Box>
                    <Footer />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
