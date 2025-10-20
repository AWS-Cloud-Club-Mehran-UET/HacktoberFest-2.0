import { useState, useEffect } from "react";
import CourseForm from "../../components/CourseForm";
import { api } from "../../services/api";

export default function InstructorDashboard() {
  const [myCourses, setMyCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      const response = await api.get("/instructor/courses");
      setMyCourses(response.data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const handleCourseCreated = (newCourse) => {
    setMyCourses([...myCourses, newCourse]);
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Instructor Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Creation */}
        <div className="lg:col-span-1">
          {!showForm ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Create New Course</h3>
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 text-lg"
              >
                + Create Course
              </button>
            </div>
          ) : (
            <CourseForm onCourseCreated={handleCourseCreated} />
          )}
        </div>

        {/* Course List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">
              Your Courses ({myCourses.length})
            </h3>

            {myCourses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No courses created yet
              </p>
            ) : (
              <div className="space-y-4">
                {myCourses.map((course) => (
                  <div
                    key={course.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-lg">{course.title}</h4>
                    <p className="text-gray-600 text-sm">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {course.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {course.duration}
                      </span>
                      <span className="text-sm text-blue-600">
                        {course.students} students
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
