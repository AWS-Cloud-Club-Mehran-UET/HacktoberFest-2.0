import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import StudentDashboard from "./pages/Student/StudentDashboard";
import InstructorDashboard from "./pages/Instructor/InstructorDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CourseCatalog from "./pages/CourseCatalog";
import Login from "./components/Login";
import Signup from "./components/SignUp";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route
              path="/instructor/dashboard"
              element={<InstructorDashboard />}
            />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
