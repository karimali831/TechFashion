import "regenerator-runtime";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { CustomRouter } from "./router/index.tsx";
import { history } from "./state/InitialiseStore";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <CustomRouter history={history}>
        <App />
    </CustomRouter>
);
