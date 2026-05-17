export const mockUsers = [
  {
    id: "user_001",
    name: "Rohan Sharma",
    email: "rohan.sharma@vit.edu.in",
    password: "password123", // Simple mock password
    university: "Vellore Institute of Technology",
    branch: "B.Tech Computer Science",
    role: "Primary Student",
    persona: "Balanced Planner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
    financials: {
      monthlyAllowance: 8000,
      currentSavings: 14500,
      financialHealthScore: 82,
    },
    dreams: [
      { id: "d1", name: "Sony WH-1000XM5", price: 29990, saved: 14500, deadline: "2024-12-01", priority: "High" },
      { id: "d2", name: "Mechanical Keyboard", price: 6500, saved: 2000, deadline: "2024-09-15", priority: "Medium" }
    ],
    preferences: {
      theme: "dark",
      notifications: true,
      coachTone: "Friendly",
    }
  },
  {
    id: "user_002",
    name: "Aditi Verma",
    email: "aditi.verma@du.ac.in",
    password: "password123",
    university: "Delhi University",
    branch: "B.Com Honors",
    role: "Demo Student",
    persona: "Careful Saver",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditi",
    financials: {
      monthlyAllowance: 6000,
      currentSavings: 32000,
      financialHealthScore: 95,
    },
    dreams: [
      { id: "d3", name: "MacBook Air M2", price: 99900, saved: 32000, deadline: "2025-06-01", priority: "High" }
    ],
    preferences: {
      theme: "light",
      notifications: false,
      coachTone: "Professional",
    }
  },
  {
    id: "user_003",
    name: "Kabir Singh",
    email: "kabir.s@nift.ac.in",
    password: "password123",
    university: "NIFT Mumbai",
    branch: "Fashion Design",
    role: "Demo Student",
    persona: "Impulsive Spender",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir",
    financials: {
      monthlyAllowance: 12000,
      currentSavings: 1500,
      financialHealthScore: 45,
    },
    dreams: [
      { id: "d4", name: "Sneakers (Jordan 1)", price: 18000, saved: 1500, deadline: "2024-08-01", priority: "High" }
    ],
    preferences: {
      theme: "dark",
      notifications: true,
      coachTone: "Strict",
    }
  },
  {
    id: "user_004",
    name: "Priya Das",
    email: "priya.das@iitb.ac.in",
    password: "password123",
    university: "IIT Bombay",
    branch: "Electrical Engineering",
    role: "Demo Student",
    persona: "Subscription Heavy",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    financials: {
      monthlyAllowance: 10000,
      currentSavings: 5000,
      financialHealthScore: 68,
    },
    dreams: [
      { id: "d5", name: "iPad Pro", price: 79900, saved: 5000, deadline: "2025-01-01", priority: "Medium" }
    ],
    preferences: {
      theme: "dark",
      notifications: true,
      coachTone: "Friendly",
    }
  }
];
