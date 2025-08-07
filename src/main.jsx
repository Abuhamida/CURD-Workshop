import "./index.css";
import { createRoot } from "react-dom/client";
import { AppRoutes } from "./routing/AppRoutes";
import { Provider } from "react-redux";
import { store, persistor } from "@/store/index";
import { PersistGate } from "redux-persist/integration/react";
import AuthInitializer from "./components/AuthInitializer";


createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AuthInitializer>
          <AppRoutes />
        </AuthInitializer>
      </PersistGate>
    </Provider>
);
