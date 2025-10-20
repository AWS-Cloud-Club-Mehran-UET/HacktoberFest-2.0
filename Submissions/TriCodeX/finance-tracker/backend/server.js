// Add to backend/server.js after existing achievements

// Enhanced achievements data
let achievements = [
  {
    id: 1,
    userId: 1,
    title: 'First Saver',
    description: 'Save your first $100',
    achieved: true,
    date: '2024-01-10',
    points: 50,
    icon: '💰',
    category: 'savings'
  },
  {
    id: 2,
    userId: 1,
    title: 'Budget Master',
    description: 'Stay under budget for 30 days',
    achieved: false,
    points: 100,
    icon: '🎯',
    category: 'budgeting'
  },
  {
    id: 3,
    userId: 1,
    title: 'Transaction Tracker',
    description: 'Log 10 transactions',
    achieved: true,
    date: '2024-01-12',
    points: 25,
    icon: '📝',
    category: 'tracking'
  },
  {
    id: 4,
    userId: 1,
    title: 'Goal Getter',
    description: 'Complete your first savings goal',
    achieved: false,
    points: 75,
    icon: '🏆',
    category: 'goals'
  },
  {
    id: 5,
    userId: 1,
    title: 'Early Bird',
    description: 'Save money for 7 consecutive days',
    achieved: true,
    date: '2024-01-08',
    points: 30,
    icon: '🌅',
    category: 'consistency'
  },
  {
    id: 6,
    userId: 1,
    title: 'Financial Guru',
    description: 'Reach level 10',
    achieved: false,
    points: 200,
    icon: '👑',
    category: 'mastery'
  },
  {
    id: 7,
    userId: 1,
    title: 'Budget Hero',
    description: 'Stay under budget in all categories for a month',
    achieved: false,
    points: 150,
    icon: '🦸',
    category: 'budgeting'
  },
  {
    id: 8,
    userId: 1,
    title: 'Savings Champion',
    description: 'Save $1000 total',
    achieved: false,
    points: 125,
    icon: '💪',
    category: 'savings'
  }
];

// Leaderboard data
let leaderboard = [
  { userId: 1, name: 'You', points: 1250, level: 5, rank: 1 },
  { userId: 2, name: 'Sarah Chen', points: 980, level: 4, rank: 2 },
  { userId: 3, name: 'Mike Johnson', points: 750, level: 3, rank: 3 },
  { userId: 4, name: 'Emma Wilson', points: 620, level: 3, rank: 4 },
  { userId: 5, name: 'Alex Kim', points: 450, level: 2, rank: 5 }
];

// Add leaderboard endpoint
app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboard);
});

// Add user progress endpoint
app.get('/api/user/progress', (req, res) => {
  const userStats = {
    streak: 7,
    totalTransactions: transactions.filter(t => t.userId === 1).length,
    totalSaved: 450,
    goalsCompleted: achievements.filter(a => a.userId === 1 && a.achieved).length,
    totalAchievements: achievements.length
  };
  res.json(userStats);
});

