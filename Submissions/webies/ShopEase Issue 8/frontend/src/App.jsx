import { Routes, Route } from "react-router-dom";
import { Login, Signup, Home } from "./pages";
import PrivateRoute from "./components/routes/PrivateRoute";
import AddProductForm from "./pages/AddProducts";

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
              <Route path='/AddProducts' element={<AddProductForm/>} > </Route>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
