import { useState, useEffect } from "react";
import { getCourses, api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [enrolling, setEnrolling] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const data = await getCourses();
    setCourses(data);
  };

  const enrollInCourse = async (courseId) => {
    if (!user) {
      alert("Please login to enroll in courses");
      return;
    }

    setEnrolling(courseId);
    try {
      await api.post(`/enroll/${courseId}`);
      alert("Successfully enrolled in course!");
      loadCourses(); // Refresh course list
    } catch (error) {
      alert(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Catalog</h1>
      <p className="text-gray-600 mb-6">Browse all available courses</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {course.category}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{course.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Instructor:</span>
                  <span className="font-medium">{course.instructor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Students:</span>
                  <span className="font-medium">
                    {course.students} enrolled
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rating:</span>
                  <span className="font-medium">⭐ {course.rating}/5</span>
                </div>
              </div>

              <button
                onClick={() => enrollInCourse(course.id)}
                disabled={enrolling === course.id}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {enrolling === course.id ? "Enrolling..." : "Enroll Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
