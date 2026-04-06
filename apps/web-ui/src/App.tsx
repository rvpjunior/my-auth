import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { Callback } from "./pages/Callback";

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
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
