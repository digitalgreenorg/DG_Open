import ReactDOM from "react-dom/client";
import App from "./App";
import { VistaarFarmStackProvider } from "common/components/context/VistaarContext/FarmStackProvider";
import { EadpFarmStackProvider } from "common/components/context/EadpContext/FarmStackProvider";
import { KadpFarmStackProvider } from "common/components/context/KadpContext/FarmStackProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
const instance = process.env.REACT_APP_INSTANCE;

// Dynamically select which context provider to use based on the instance
let ProviderComponent;

switch (instance.toUpperCase()) {
  case "VISTAAR":
    ProviderComponent = VistaarFarmStackProvider;
    break;
  case "EADP":
    ProviderComponent = EadpFarmStackProvider;
    break;
  case "KADP":
    ProviderComponent = KadpFarmStackProvider;
    break;
  default:
    // A default provider or null if there's no suitable match
    ProviderComponent = ({ children }) => <>{children}</>; // Simple pass-through component
}

root.render(
  <ProviderComponent>
    <App />
  </ProviderComponent>
);
