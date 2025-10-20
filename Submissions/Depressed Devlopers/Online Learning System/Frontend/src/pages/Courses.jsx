import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CoursesDetail.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      setCourses(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  return (
    <div className="courses-page">
      <div className="container">
        <h1>All Courses</h1>
        <p>Enhance your skills with our expert-led courses</p>

        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="course-image"
              />
              <div className="course-content">
                <span className="category">{course.category}</span>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span>By: {course.instructor?.name}</span>
                  <span>{course.rating}</span>
                </div>
                <div className="course-footer">
                  <span className="price">
                    {course.price === 0 ? "FREE" : `₹${course.price}`}
                  </span>
                  <button className="enroll-btn">Enroll Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
