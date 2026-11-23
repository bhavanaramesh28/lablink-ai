import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111B32",
            color: "#fff",
            border: "1px solid rgba(0,217,255,0.3)",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
