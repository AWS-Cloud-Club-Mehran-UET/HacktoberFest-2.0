import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import { Navigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = "";
    if (password.length === 0) {
      strength = "";
    } else if (password.length < 6) {
      strength = "weak";
    } else if (password.length < 8) {
      strength = "medium";
    } else {
      strength = "strong";
    }
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        if (response.data.user.role === "instructor") {
          navigate("/instructor-dashboard");
        } else {
          navigate("/Login");
        }
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Create Your Account</h1>
          <p>Join SkillBridge and start your learning journey</p>
        </div>

        {error && (
          <div
            className="error-message"
            style={{
              background: "#fef2f2",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="role-selector">
            <label
              className={`role-option ${
                formData.role === "student" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="role"
                value="student"
                checked={formData.role === "student"}
                onChange={handleChange}
              />
              Student
            </label>
            <label
              className={`role-option ${
                formData.role === "instructor" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="role"
                value="instructor"
                checked={formData.role === "instructor"}
                onChange={handleChange}
              />
              Instructor
            </label>
          </div>

          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            {passwordStrength && (
              <div className={`password-strength ${passwordStrength}`}>
                Password Strength:{" "}
                {passwordStrength.charAt(0).toUpperCase() +
                  passwordStrength.slice(1)}
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary register-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>

        {/* Terms Notice */}
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f3f4f6",
            borderRadius: "8px",
            textAlign: "center",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          By creating an account, you agree to our Terms of Service and Privacy
          Policy.
        </div>
      </div>
    </div>
  );
};

export default Register;
