import { useState, useEffect } from "react";
import { api } from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadStats();
    loadUsers();
    loadCourses();
  }, []);

  const loadStats = async () => {
    const response = await api.get("/admin/stats");
    setStats(response.data);
  };

  const loadUsers = async () => {
    const response = await api.get("/admin/users");
    setUsers(response.data);
  };

  const loadCourses = async () => {
    const response = await api.get("/admin/courses");
    setCourses(response.data);
  };

  const approveUser = async (userId) => {
    await api.patch(`/admin/users/${userId}/approve`);
    loadUsers(); // Refresh users list
  };

  if (!stats)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        Loading admin dashboard...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Courses</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalCourses}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">
            Total Students
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalStudents}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">
            Total Enrollments
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.totalEnrollments}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">
            Completion Rate
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats.completionRate}%
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {["overview", "users", "courses", "analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Courses</h3>
                <div className="space-y-3">
                  {stats.recentCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <span className="font-medium">{course.title}</span>
                      <span className="text-sm text-gray-500">
                        {course.students} students
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Course Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats.categories).map(([category, count]) => (
                    <div
                      key={category}
                      className="text-center p-4 bg-blue-50 rounded-lg"
                    >
                      <div className="text-2xl font-bold text-blue-600">
                        {count}
                      </div>
                      <div className="text-sm text-gray-600">{category}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">User Management</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.role === "instructor"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.joined}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.status === "pending" && (
                            <button
                              onClick={() => approveUser(user.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Course Management</h3>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">{course.title}</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {course.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{course.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Enrollments:</span>
                        <span className="font-medium ml-2">
                          {course.totalEnrollments}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Completed:</span>
                        <span className="font-medium ml-2">
                          {course.completedEnrollments}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Progress:</span>
                        <span className="font-medium ml-2">
                          {course.averageProgress}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Popular Categories</h4>
                  {Object.entries(stats.categories).map(([category, count]) => (
                    <div key={category} className="flex justify-between mb-2">
                      <span>{category}</span>
                      <span className="font-medium">{count} courses</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Course Completion Rate</span>
                      <span className="font-medium text-green-600">
                        {stats.completionRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Students per Course</span>
                      <span className="font-medium">
                        {stats.totalCourses > 0
                          ? Math.round(
                              stats.totalEnrollments / stats.totalCourses
                            )
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
