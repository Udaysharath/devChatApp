import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { SocketProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <>
    <Provider store={store}>
      <SocketProvider>
        <App />
        <Toaster closeButton />
      </SocketProvider>
    </Provider>
  </>
  // </StrictMode>,
);
