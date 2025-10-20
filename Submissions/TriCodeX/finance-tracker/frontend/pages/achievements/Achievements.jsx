import { useState, useEffect } from "react";
import {
  getAchievements,
  getLeaderboard,
  getUserProgress,
} from "../../services/api";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("achievements");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [achievementsData, leaderboardData, progressData] =
        await Promise.all([
          getAchievements(),
          getLeaderboard(),
          getUserProgress(),
        ]);
      setAchievements(achievementsData);
      setLeaderboard(leaderboardData);
      setUserProgress(progressData);
    } catch (error) {
      console.error("Error loading achievements data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      savings: "bg-green-100 text-green-800",
      budgeting: "bg-blue-100 text-blue-800",
      tracking: "bg-purple-100 text-purple-800",
      goals: "bg-yellow-100 text-yellow-800",
      consistency: "bg-orange-100 text-orange-800",
      mastery: "bg-red-100 text-red-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">Loading your achievements...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gamification Hub
        </h1>
        <p className="text-gray-600">
          Earn achievements, climb the leaderboard, and master your finances!
        </p>
      </div>

      {/* Progress Overview */}
      {userProgress && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-lg text-center">
            <div className="text-2xl mb-2">🔥</div>
            <p className="text-sm text-gray-600">Current Streak</p>
            <p className="text-xl font-bold text-gray-900">
              {userProgress.streak} days
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-lg text-center">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm text-gray-600">Transactions</p>
            <p className="text-xl font-bold text-gray-900">
              {userProgress.totalTransactions}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-lg text-center">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-sm text-gray-600">Total Saved</p>
            <p className="text-xl font-bold text-gray-900">
              ${userProgress.totalSaved}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-lg text-center">
            <div className="text-2xl mb-2">🏆</div>
            <p className="text-sm text-gray-600">Achievements</p>
            <p className="text-xl font-bold text-gray-900">
              {userProgress.goalsCompleted}/{userProgress.totalAchievements}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("achievements")}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === "achievements"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              🏆 Achievements
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === "leaderboard"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              📈 Leaderboard
            </button>
            <button
              onClick={() => setActiveTab("rewards")}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === "rewards"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              🎁 Rewards
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Achievements</h2>
                <div className="text-sm text-gray-500">
                  {achievements.filter((a) => a.achieved).length} of{" "}
                  {achievements.length} unlocked
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      achievement.achieved
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg"
                        : "bg-gray-50 border-gray-200 opacity-75"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`text-2xl p-3 rounded-xl ${
                          achievement.achieved ? "bg-green-100" : "bg-gray-200"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3
                            className={`font-semibold ${
                              achievement.achieved
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            {achievement.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              achievement.achieved
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 text-gray-600"
                            }`}
                          >
                            +{achievement.points} pts
                          </span>
                        </div>
                        <p
                          className={`text-sm mb-3 ${
                            achievement.achieved
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          {achievement.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span
                            className={`px-2 py-1 rounded text-xs ${getCategoryColor(
                              achievement.category
                            )}`}
                          >
                            {achievement.category}
                          </span>
                          {achievement.achieved ? (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Unlocked{" "}
                              {new Date(achievement.date).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === "leaderboard" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Global Leaderboard</h2>

              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div
                    key={user.userId}
                    className={`flex items-center justify-between p-4 rounded-2xl ${
                      user.rank === 1
                        ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200"
                        : user.rank === 2
                        ? "bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200"
                        : user.rank === 3
                        ? "bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1
                            ? "bg-yellow-400 text-white"
                            : user.rank === 2
                            ? "bg-gray-400 text-white"
                            : user.rank === 3
                            ? "bg-orange-400 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {user.rank}
                      </div>
                      <div>
                        <h3
                          className={`font-semibold ${
                            user.userId === 1
                              ? "text-green-600"
                              : "text-gray-900"
                          }`}
                        >
                          {user.name} {user.userId === 1 && "(You)"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Level {user.level}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {user.points} pts
                      </p>
                      <p className="text-sm text-gray-500">Total Score</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leaderboard Legend */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">How to Earn Points:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span>Log transactions: +5 pts each</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span>Stay under budget: +10 pts/day</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                    <span>Complete goals: +25 pts each</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span>Maintain streak: +15 pts/day</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === "rewards" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Available Rewards</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Level Up Rewards */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                  <div className="text-4xl mb-4">⭐</div>
                  <h3 className="font-semibold text-lg mb-2">Level Up Bonus</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Reach new levels to unlock exclusive features and bonuses
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Level 5</span>
                      <span className="text-green-600">✓ Unlocked</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Level 10</span>
                      <span className="text-blue-600">Advanced Analytics</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Level 20</span>
                      <span className="text-purple-600">Premium Features</span>
                    </div>
                  </div>
                </div>

                {/* Streak Rewards */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border-2 border-orange-200">
                  <div className="text-4xl mb-4">🔥</div>
                  <h3 className="font-semibold text-lg mb-2">Streak Rewards</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Maintain your saving streak for bonus points
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>7 days</span>
                      <span className="text-green-600">+50 pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>30 days</span>
                      <span className="text-blue-600">+200 pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>90 days</span>
                      <span className="text-purple-600">+500 pts</span>
                    </div>
                  </div>
                </div>

                {/* Achievement Rewards */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-green-200">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="font-semibold text-lg mb-2">
                    Achievement Hunt
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Complete achievement sets for massive point bonuses
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget Master Set</span>
                      <span className="text-green-600">+300 pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Saving Pro Set</span>
                      <span className="text-blue-600">+400 pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Complete All</span>
                      <span className="text-purple-600">+1000 pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Progress */}
              <div className="mt-8 p-6 bg-white border border-gray-200 rounded-2xl">
                <h3 className="font-semibold mb-4">Your Reward Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Next Level Bonus (Level 6)</span>
                      <span>250/500 pts</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "50%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Current Streak</span>
                      <span>7 days 🔥</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: "23%" }}
                      ></div>
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
