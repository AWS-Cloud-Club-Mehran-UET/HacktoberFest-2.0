import { Routes, Route } from "react-router-dom";
import { Login, Signup, Home } from "@/pages";
import PrivateRoute from "@/components/routes/PrivateRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
