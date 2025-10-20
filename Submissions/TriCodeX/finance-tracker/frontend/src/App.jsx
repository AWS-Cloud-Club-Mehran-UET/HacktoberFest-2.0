import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import Transactions from "../pages/transactions/Transactions";
import Goals from "../pages/goals/Goals";
import Achievements from "../pages/achievements/Achievements";
import Login from "../components/Login";
import Signup from "../components/Signup";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/achievements" element={<Achievements />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
