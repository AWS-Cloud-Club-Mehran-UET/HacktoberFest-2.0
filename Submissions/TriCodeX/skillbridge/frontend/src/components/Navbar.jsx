import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            🎓 SkillBridge
          </Link>

          <div className="flex space-x-4 items-center">
            <Link to="/courses" className="text-gray-700 hover:text-blue-600">
              Courses
            </Link>

            {user ? (
              <>
                <Link
                  to="/student/dashboard"
                  className="text-gray-700 hover:text-blue-600"
                >
                  My Learning
                </Link>
                <Link
                  to="/instructor/dashboard"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Teach
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Admin
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Logout ({user.name})
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
