import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { store } from "./store/index.js";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { useContext } from "react";
import { ThemeContext } from "./Context/ThemeContext.jsx";
import { NotificationProvider } from "./Context/NotificationContext";

// Wrapper to add data-theme attribute
function RootApp() {
  const { themeMode } = useContext(ThemeContext);
  return (
    <div data-theme={themeMode}>
      <Toaster  />
      <App />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <RootApp />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  </Provider>
);