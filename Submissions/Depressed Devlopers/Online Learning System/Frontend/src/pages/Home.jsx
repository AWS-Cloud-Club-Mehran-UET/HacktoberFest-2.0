import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to SkillBridge</h1>
          <p>Learn from industry experts and advance your career</p>
          <div className="hero-buttons">
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose SkillBridge?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Expert Instructors</h3>
              <p>
                Learn from industry professionals with real-world experience
              </p>
            </div>
            <div className="feature-card">
              <h3> Flexible Learning</h3>
              <p>Study at your own pace, anytime and anywhere</p>
            </div>
            <div className="feature-card">
              <h3> Career Focused</h3>
              <p>Courses designed to help you advance in your career</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
