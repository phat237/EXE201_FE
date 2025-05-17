import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { store } from "./store/index.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
    <Toaster/>
      <App />
    </BrowserRouter>
  </Provider>
);
