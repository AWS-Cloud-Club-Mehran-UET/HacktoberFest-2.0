import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { loginUser } from "../services/api";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { user, token } = await loginUser(email, password);
      login(user);
      alert(`Welcome back, ${user.name}!`);
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword, role) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        Login to SkillBridge
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up here
          </Link>
        </p>
      </div>

      {/* Demo Accounts */}
      <div className="mt-6 border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">
          Quick Demo Access:
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() =>
              handleDemoLogin("student@skillbridge.com", "password", "student")
            }
            className="w-full bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700"
          >
            Login as Student
          </button>
          <button
            onClick={() =>
              handleDemoLogin(
                "instructor@skillbridge.com",
                "password",
                "instructor"
              )
            }
            className="w-full bg-purple-600 text-white py-2 rounded text-sm hover:bg-purple-700"
          >
            Login as Instructor
          </button>
          <button
            onClick={() =>
              handleDemoLogin("admin@skillbridge.com", "password", "admin")
            }
            className="w-full bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700"
          >
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
}
