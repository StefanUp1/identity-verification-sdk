import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routing/AppRoutes";
import { AppProvider } from "./state/AppProvider";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
