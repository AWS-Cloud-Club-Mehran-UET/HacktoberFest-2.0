import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getDashboardStats, getTransactions } from "../../services/api";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, transactionsData] = await Promise.all([
        getDashboardStats(),
        getTransactions(),
      ]);
      setStats(statsData);
      setTransactions(transactionsData.slice(0, 5)); // Last 5 transactions
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading your financial dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please login to view your dashboard
          </h2>
        </div>
      </div>
    );
  }

  // Chart data
  const categoryData = {
    labels: Object.keys(stats.categorySpending || {}),
    datasets: [
      {
        data: Object.values(stats.categorySpending || {}),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const spendingData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Income",
        data: [3000, 3200, 3100, 3300, 3400, 3500],
        borderColor: "#10B981",
        backgroundColor: "#10B981",
      },
      {
        label: "Expenses",
        data: [2200, 2400, 2100, 2300, 2500, 2400],
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600">Here's your financial overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.balance?.toFixed(2)}
          </p>
          <p className="text-sm text-green-600">+12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.totalIncome?.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600">This month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.totalExpenses?.toFixed(2)}
          </p>
          <p className="text-sm text-red-600">This month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500">Savings Rate</h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalIncome
              ? ((stats.balance / stats.totalIncome) * 100).toFixed(1)
              : 0}
            %
          </p>
          <p className="text-sm text-purple-600">Of income saved</p>
        </div>
      </div>

      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
          <h3 className="text-lg font-semibold mb-2">Level Progress</h3>
          <div className="flex items-center justify-between mb-2">
            <span>Level {user.level}</span>
            <span>{user.points} XP</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full"
              style={{ width: `${(user.points % 1000) / 10}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-2xl text-white">
          <h3 className="text-lg font-semibold mb-2">Current Streak</h3>
          <p className="text-3xl font-bold mb-2">7 days 🔥</p>
          <p className="text-sm opacity-90">Keep going!</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-2xl text-white">
          <h3 className="text-lg font-semibold mb-2">Achievements</h3>
          <p className="text-3xl font-bold mb-2">3/12</p>
          <p className="text-sm opacity-90">Badges unlocked</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Spending by Category */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <div className="h-64">
            <Doughnut
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Income vs Expenses */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
          <div className="h-64">
            <Line
              data={spendingData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "income"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "⬆️" : "⬇️"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>
              </div>
              <p
                className={`font-semibold ${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}$
                {Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
