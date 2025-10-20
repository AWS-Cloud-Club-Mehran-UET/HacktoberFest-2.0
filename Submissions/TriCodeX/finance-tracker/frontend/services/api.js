// Add these to your existing API functions

// Achievements & Gamification
export const getLeaderboard = async () => {
  const response = await api.get("/leaderboard");
  return response.data;
};

export const getUserProgress = async () => {
  const response = await api.get("/user/progress");
  return response.data;
};

// Export data
export const exportData = async (format) => {
  const response = await api.get(`/export/${format}`);
  return response.data;
};
