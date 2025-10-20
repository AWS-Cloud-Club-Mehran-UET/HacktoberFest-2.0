import { useState, useEffect } from "react";
import {api} from "../../services/api";
import { Link } from "react-router-dom";
import Certificate from "../../components/Certificate";

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCertificate, setShowCertificate] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [enrollmentsRes, certificatesRes] = await Promise.all([
        api.get("/student/enrollments"),
        api.get("/student/certificates"),
      ]);
      setEnrollments(enrollmentsRes.data);
      setCertificates(certificatesRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (enrollmentId, newProgress) => {
    try {
      await api.patch(`/enrollments/${enrollmentId}/progress`, {
        progress: newProgress,
      });
      loadData(); // Refresh data
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">Loading your courses...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {showCertificate && (
        <Certificate
          enrollmentId={showCertificate}
          onClose={() => setShowCertificate(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <Link
          to="/courses"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Browse Courses
        </Link>
      </div>

      {/* Certificates Section */}
      {certificates.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            🎓 Your Certificates ({certificates.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4"
              >
                <h3 className="font-semibold text-lg text-green-800">
                  {cert.courseTitle}
                </h3>
                <p className="text-gray-600 text-sm">
                  Completed on {cert.completedDate}
                </p>
                <p className="text-gray-500 text-sm">
                  Instructor: {cert.instructor}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Certificate ID: {cert.id}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enrolled Courses Section */}
      <h2 className="text-2xl font-semibold mb-4">
        📚 Your Courses ({enrollments.length})
      </h2>

      {enrollments.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">
            No courses enrolled yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start your learning journey by enrolling in a course
          </p>
          <Link
            to="/courses"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Browse Available Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold mb-2">
                {enrollment.course.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {enrollment.course.description}
              </p>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{enrollment.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      enrollment.progress === 100
                        ? "bg-green-600"
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${enrollment.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() =>
                    updateProgress(enrollment.id, enrollment.progress + 25)
                  }
                  disabled={enrollment.progress >= 100}
                  className="flex-1 bg-green-600 text-white py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  +25%
                </button>
                <button
                  onClick={() => updateProgress(enrollment.id, 100)}
                  disabled={enrollment.progress >= 100}
                  className="flex-1 bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  Complete
                </button>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  Enrolled:{" "}
                  {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </span>
                {enrollment.completed && (
                  <button
                    onClick={() => setShowCertificate(enrollment.id)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                  >
                    🎓 Get Certificate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
