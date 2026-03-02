import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { LegacyAuthProvider } from "./contexts/LegacyAuthContext";
import LegacyDashboard from "./pages/LegacyDashboard";
import LegacyLogin from "./pages/LegacyLogin";
import { ProtectedRoute } from "./ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>
        <Route
          path="/legacy"
          element={
            <LegacyAuthProvider>
              <Outlet />
            </LegacyAuthProvider>
          }
        >
          <Route index element={<LegacyDashboard />} />
          <Route path="login" element={<LegacyLogin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
