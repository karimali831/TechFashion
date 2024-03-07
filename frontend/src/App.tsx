import { Provider } from "react-redux";
import store from "./state/InitialiseStore";
import { AnimatedRoutes } from "./layouts/navigation/AnimatedRoutes";
import Navbar from "./layouts/navigation/Navbar";
import Category from "./layouts/ecommerce/category";
import "./App.css";
import Footer from "./layouts/ecommerce/footer";

function App() {
    return (
        <Provider store={store}>
            <Navbar />
            <Category />
            <AnimatedRoutes />
            <Footer />
        </Provider>
    );
}

export default App;
