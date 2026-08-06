import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppRoute from "./routes/AppRoute.jsx";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store/productStore.js";

createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <Toaster position="top-right" />
      <AppRoute />
    </Provider>
  </>,
);
