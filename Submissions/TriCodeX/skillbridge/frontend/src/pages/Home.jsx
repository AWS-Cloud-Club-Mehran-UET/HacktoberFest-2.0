import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">SkillBridge</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Master new skills with our short, practical courses. Learn from
          industry experts and advance your career.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link
            to="/courses"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 text-lg font-semibold"
          >
            Start Learning Today
          </Link>
          {!user && (
            <Link
              to="/login"
              className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 text-lg font-semibold"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🎓</div>
          <h3 className="text-xl font-semibold mb-2">Expert-Led Courses</h3>
          <p className="text-gray-600">
            Learn from industry professionals with real-world experience
          </p>
        </div>

        <div className="text-center p-6">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Short & Practical</h3>
          <p className="text-gray-600">
            Focus on practical skills with courses designed for busy learners
          </p>
        </div>

        <div className="text-center p-6">
          <div className="text-4xl mb-4">📜</div>
          <h3 className="text-xl font-semibold mb-2">Get Certified</h3>
          <p className="text-gray-600">
            Earn certificates to showcase your new skills
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-50 rounded-2xl p-8 my-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-gray-600">Courses</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">1,000+</div>
            <div className="text-gray-600">Students</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">25+</div>
            <div className="text-gray-600">Instructors</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">98%</div>
            <div className="text-gray-600">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="text-gray-600 mb-6">
          Join thousands of students advancing their careers
        </p>
        <Link
          to="/courses"
          className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 text-lg font-semibold"
        >
          Browse All Courses
        </Link>
      </div>
    </div>
  );
}
