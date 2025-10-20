import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg border-b-4 border-green-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-green-600">
            💰 FinanceTracker
          </Link>

          <div className="flex space-x-4 items-center">
            {user ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-green-600">
                  Dashboard
                </Link>
                <Link
                  to="/transactions"
                  className="text-gray-700 hover:text-green-600"
                >
                  Transactions
                </Link>
                <Link
                  to="/goals"
                  className="text-gray-700 hover:text-green-600"
                >
                  Goals
                </Link>
                <Link
                  to="/achievements"
                  className="text-gray-700 hover:text-green-600"
                >
                  Achievements
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    Level {user.level}
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {user.points} pts
                  </div>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-green-600"
                  >
                    Logout ({user.name})
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
