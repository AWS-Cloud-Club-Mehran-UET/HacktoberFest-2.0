import { useState, useEffect } from "react";
import { getGoals, addGoal, getBudgets, addBudget } from "../../services/api";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("goals");
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const [goalForm, setGoalForm] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });

  const [budgetForm, setBudgetForm] = useState({
    category: "Food",
    limit: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [goalsData, budgetsData] = await Promise.all([
        getGoals(),
        getBudgets(),
      ]);
      setGoals(goalsData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      await addGoal(goalForm);
      await loadData();
      setShowGoalForm(false);
      setGoalForm({ title: "", targetAmount: "", deadline: "" });
      alert("Goal created successfully! 🎯");
    } catch (error) {
      alert("Error creating goal");
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBudget(budgetForm);
      await loadData();
      setShowBudgetForm(false);
      setBudgetForm({ category: "Food", limit: "" });
      alert("Budget set successfully! 💰");
    } catch (error) {
      alert("Error setting budget");
    }
  };

  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Utilities",
    "Shopping",
    "Healthcare",
    "Education",
    "Other",
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">Loading your financial goals...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Financial Goals & Budgets
        </h1>
        <p className="text-gray-600">
          Plan your financial future and track your progress
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("goals")}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === "goals"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              🎯 Savings Goals
            </button>
            <button
              onClick={() => setActiveTab("budgets")}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === "budgets"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              💰 Monthly Budgets
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Goals Tab */}
          {activeTab === "goals" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Savings Goals</h2>
                <button
                  onClick={() => setShowGoalForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  + New Goal
                </button>
              </div>

              {goals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
                  <p className="text-gray-600 mb-4">
                    Set your first savings goal to get started!
                  </p>
                  <button
                    onClick={() => setShowGoalForm(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                  >
                    Create Goal
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {goals.map((goal) => {
                    const progress =
                      (goal.savedAmount / goal.targetAmount) * 100;
                    const daysLeft = Math.ceil(
                      (new Date(goal.deadline) - new Date()) /
                        (1000 * 60 * 60 * 24)
                    );

                    return (
                      <div
                        key={goal.id}
                        className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-2xl border border-blue-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {goal.title}
                          </h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {daysLeft > 0
                              ? `${daysLeft} days left`
                              : "Deadline passed"}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-green-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between text-sm">
                          <div>
                            <p className="text-gray-500">Saved</p>
                            <p className="font-semibold text-green-600">
                              ${goal.savedAmount.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500">Target</p>
                            <p className="font-semibold">
                              ${goal.targetAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <p className="text-xs text-gray-500">
                            Target date:{" "}
                            {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Budgets Tab */}
          {activeTab === "budgets" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Monthly Budgets</h2>
                <button
                  onClick={() => setShowBudgetForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  + Set Budget
                </button>
              </div>

              {budgets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold mb-2">No budgets set</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first budget to track spending!
                  </p>
                  <button
                    onClick={() => setShowBudgetForm(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                  >
                    Set Budget
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {budgets.map((budget) => {
                    const progress = (budget.spent / budget.limit) * 100;
                    const isOverBudget = budget.spent > budget.limit;

                    return (
                      <div
                        key={budget.id}
                        className="bg-white border border-gray-200 rounded-2xl p-6"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">
                            {budget.category}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              isOverBudget
                                ? "bg-red-100 text-red-800"
                                : progress > 80
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {isOverBudget
                              ? "Over Budget"
                              : progress > 80
                              ? "Near Limit"
                              : "On Track"}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Spent: ${budget.spent.toFixed(2)}</span>
                            <span>Limit: ${budget.limit.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-300 ${
                                isOverBudget
                                  ? "bg-red-500"
                                  : progress > 80
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            {isOverBudget
                              ? `$${(budget.spent - budget.limit).toFixed(
                                  2
                                )} over budget`
                              : `$${(budget.limit - budget.spent).toFixed(
                                  2
                                )} remaining`}
                          </span>
                          <span className="font-semibold">
                            {progress.toFixed(1)}% used
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Create New Goal</h3>
              <button
                onClick={() => setShowGoalForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={goalForm.title}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, title: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., New Laptop, Vacation Fund"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount
                </label>
                <input
                  type="number"
                  value={goalForm.targetAmount}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, targetAmount: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={goalForm.deadline}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, deadline: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget Form Modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Set Monthly Budget</h3>
              <button
                onClick={() => setShowBudgetForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBudgetSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={budgetForm.category}
                  onChange={(e) =>
                    setBudgetForm({ ...budgetForm, category: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Limit
                </label>
                <input
                  type="number"
                  value={budgetForm.limit}
                  onChange={(e) =>
                    setBudgetForm({ ...budgetForm, limit: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  Set Budget
                </button>
                <button
                  type="button"
                  onClick={() => setShowBudgetForm(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
