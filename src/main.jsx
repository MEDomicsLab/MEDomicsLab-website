import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import theme from "./data/theme.json";
import { cacheMarkdown } from "./lib/markdown.js";
import "./index.css";

Object.entries(theme.cssVars).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value);
});

const pageData = document.getElementById("page-data");
if (pageData) {
  Object.entries(JSON.parse(pageData.textContent)).forEach(([path, content]) => {
    cacheMarkdown(path, content);
  });
  pageData.remove();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
