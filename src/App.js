import React from "react";
import ReactDOM from "react-dom/client";
import Admin from "./Admin";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";

const App = () => {
  return (
    <PrimeReactProvider>
      <Admin />
    </PrimeReactProvider>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
