import React from "react";
import { IconContext } from "@phosphor-icons/react/dist/lib/context";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/app/store.js";
import App from "@/app/App.jsx";
import "@/app/global.scss";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <IconContext.Provider
        value={{ weight: "duotone", "aria-hidden": true, focusable: false }}
      >
        <App />
      </IconContext.Provider>
    </Provider>
  </React.StrictMode>,
);
