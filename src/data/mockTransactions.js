export const mockTransactions = {
  user_001: [
    { id: "t1", date: "2024-05-01", description: "Monthly Allowance", amount: 8000, type: "income", category: "Allowance" },
    { id: "t2", date: "2024-05-02", description: "Zomato - Biryani", amount: 350, type: "expense", category: "Food" },
    { id: "t3", date: "2024-05-04", description: "Netflix Subscription", amount: 199, type: "expense", category: "Subscriptions" },
    { id: "t4", date: "2024-05-05", description: "Uber - to College", amount: 120, type: "expense", category: "Transport" },
    { id: "t5", date: "2024-05-08", description: "Amazon - Notebooks", amount: 450, type: "expense", category: "Study Materials" },
    { id: "t6", date: "2024-05-10", description: "Swiggy - Pizza", amount: 400, type: "expense", category: "Food" },
    { id: "t7", date: "2024-05-12", description: "Spotify Premium", amount: 119, type: "expense", category: "Subscriptions" },
  ],
  user_002: [
    { id: "t8", date: "2024-05-01", description: "Monthly Allowance", amount: 6000, type: "income", category: "Allowance" },
    { id: "t9", date: "2024-05-03", description: "Metro Recharge", amount: 500, type: "expense", category: "Transport" },
    { id: "t10", date: "2024-05-05", description: "College Canteen", amount: 80, type: "expense", category: "Food" },
    { id: "t11", date: "2024-05-10", description: "Library Fines", amount: 50, type: "expense", category: "Study Materials" },
    { id: "t12", date: "2024-05-15", description: "Jio Recharge", amount: 299, type: "expense", category: "Recharge" },
  ],
  user_003: [
    { id: "t13", date: "2024-05-01", description: "Monthly Allowance", amount: 12000, type: "income", category: "Allowance" },
    { id: "t14", date: "2024-05-02", description: "Zara - T-Shirt", amount: 1890, type: "expense", category: "Shopping" },
    { id: "t15", date: "2024-05-04", description: "Starbucks", amount: 450, type: "expense", category: "Food" },
    { id: "t16", date: "2024-05-05", description: "BookMyShow - Movie", amount: 600, type: "expense", category: "Entertainment" },
    { id: "t17", date: "2024-05-07", description: "H&M - Jeans", amount: 2200, type: "expense", category: "Shopping" },
    { id: "t18", date: "2024-05-09", description: "Zomato - Burger", amount: 550, type: "expense", category: "Food" },
    { id: "t19", date: "2024-05-11", description: "Uber - Party", amount: 400, type: "expense", category: "Transport" },
  ],
  user_004: [
    { id: "t20", date: "2024-05-01", description: "Monthly Allowance", amount: 10000, type: "income", category: "Allowance" },
    { id: "t21", date: "2024-05-02", description: "Netflix", amount: 649, type: "expense", category: "Subscriptions" },
    { id: "t22", date: "2024-05-03", description: "Amazon Prime", amount: 299, type: "expense", category: "Subscriptions" },
    { id: "t23", date: "2024-05-04", description: "YouTube Premium", amount: 129, type: "expense", category: "Subscriptions" },
    { id: "t24", date: "2024-05-05", description: "Discord Nitro", amount: 850, type: "expense", category: "Subscriptions" },
    { id: "t25", date: "2024-05-06", description: "ChatGPT Plus", amount: 1650, type: "expense", category: "Subscriptions" },
    { id: "t26", date: "2024-05-10", description: "Uber - College", amount: 150, type: "expense", category: "Transport" },
  ]
};

export const getTransactionsByUser = (userId) => {
  return mockTransactions[userId] || [];
};

export const getCategoryBreakdown = (userId) => {
  const txs = mockTransactions[userId] || [];
  const breakdown = {};
  txs.forEach(t => {
    if (t.type === 'expense') {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
    }
  });
  return Object.keys(breakdown).map(k => ({ name: k, value: breakdown[k] }));
};
