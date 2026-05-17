import { useState, useEffect, useContext, createContext, useCallback, useRef } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Logo from "./components/Logo";

// ────────────────────────────────────────────────────────────
// DATA LAYER — Realistic student finance data
// ────────────────────────────────────────────────────────────
const generateTransactions = () => {
  const merchants = [
    { name: "Zomato", cat: "Food", amt: () => Math.floor(Math.random() * 400 + 120), color: "#E8692A" },
    { name: "Swiggy", cat: "Food", amt: () => Math.floor(Math.random() * 350 + 80), color: "#E8692A" },
    { name: "Spotify", cat: "Subscriptions", amt: () => 119, color: "#1DB954" },
    { name: "Netflix", cat: "Subscriptions", amt: () => 649, color: "#E50914" },
    { name: "Amazon", cat: "Shopping", amt: () => Math.floor(Math.random() * 2000 + 300), color: "#FF9900" },
    { name: "Uber", cat: "Transport", amt: () => Math.floor(Math.random() * 300 + 50), color: "#000000" },
    { name: "College Fees", cat: "Education", amt: () => Math.floor(Math.random() * 5000 + 2000), color: "#6366F1" },
    { name: "Blinkit", cat: "Groceries", amt: () => Math.floor(Math.random() * 600 + 100), color: "#FCD34D" },
    { name: "Rapido", cat: "Transport", amt: () => Math.floor(Math.random() * 150 + 30), color: "#F59E0B" },
    { name: "PhonePe", cat: "UPI Transfer", amt: () => Math.floor(Math.random() * 1000 + 200), color: "#5F259F" },
  ];
  const dates = ["May 17", "May 16", "May 15", "May 14", "May 13", "May 12", "May 11", "May 10", "May 9", "May 8", "May 7", "May 6"];
  return dates.flatMap((date, di) =>
    Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => {
      const m = merchants[Math.floor(Math.random() * merchants.length)];
      return { id: di * 10 + i, date, merchant: m.name, category: m.cat, amount: m.amt(), color: m.color, type: "debit" };
    })
  ).slice(0, 20);
};

const MONTHLY_DATA = [
  { month: "Dec", food: 6200, transport: 1100, subs: 3200, shopping: 2100, education: 4500, income: 15000 },
  { month: "Jan", food: 7100, transport: 1400, subs: 3400, shopping: 1800, education: 8000, income: 15000 },
  { month: "Feb", food: 6800, transport: 900, subs: 3400, shopping: 3200, education: 2000, income: 15000 },
  { month: "Mar", food: 8200, transport: 1600, subs: 4100, shopping: 2700, education: 4500, income: 17000 },
  { month: "Apr", food: 7400, transport: 1200, subs: 3900, shopping: 1900, education: 2000, income: 17000 },
  { month: "May", food: 8700, transport: 1350, subs: 4200, shopping: 3400, education: 2000, income: 18000 },
];

const INITIAL_GOALS = [
  { id: 1, name: "MacBook Pro", target: 129900, saved: 24000, monthly: 3000, priority: 1, deadline: 36, color: "#E8692A", icon: "💻" },
  { id: 2, name: "Goa Trip", target: 25000, saved: 8500, monthly: 2000, priority: 2, deadline: 9, color: "#1D9E75", icon: "🏖️" },
  { id: 3, name: "Emergency Fund", target: 50000, saved: 12000, monthly: 2500, priority: 3, deadline: 16, color: "#6366F1", icon: "🛡️" },
];

const NOTIFICATIONS = [
  { id: 1, type: "warning", msg: "Food delivery up 18% this month", time: "2m ago" },
  { id: 2, type: "info", msg: "Spotify subscription due tomorrow ₹119", time: "1h ago" },
  { id: 3, type: "success", msg: "Saved ₹1,200 more than last week!", time: "3h ago" },
  { id: 4, type: "warning", msg: "You've spent 80% of your food budget", time: "5h ago" },
];

// ────────────────────────────────────────────────────────────
// CONTEXT
// ────────────────────────────────────────────────────────────
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [tab, setTab] = useState("dashboard");
  const [transactions, setTransactions] = useState(() => generateTransactions());
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [sipPlans, setSipPlans] = useState([]);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [userName] = useState("Arjun");
  const [balance, setBalance] = useState(18420);
  const [auditorRunning, setAuditorRunning] = useState(false);
  const [auditorLogs, setAuditorLogs] = useState([]);
  const [auditorDone, setAuditorDone] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [healthScore] = useState(72);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Live balance simulation
  useEffect(() => {
    const t = setInterval(() => {
      setBalance(b => b + (Math.random() > 0.7 ? Math.floor(Math.random() * -200) : 0));
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const totalSpent = MONTHLY_DATA[5].food + MONTHLY_DATA[5].transport + MONTHLY_DATA[5].subs + MONTHLY_DATA[5].shopping;
  const burnRate = Math.floor(totalSpent / 30 * 30);
  const savingsRate = Math.floor(((MONTHLY_DATA[5].income - totalSpent) / MONTHLY_DATA[5].income) * 100);

  return (
    <AppContext.Provider value={{
      tab, setTab, transactions, setTransactions, goals, setGoals,
      sipPlans, setSipPlans, notifications, setNotifications,
      beginnerMode, setBeginnerMode, userName, balance, setBalance,
      auditorRunning, setAuditorRunning, auditorLogs, setAuditorLogs,
      auditorDone, setAuditorDone, showNotifPanel, setShowNotifPanel,
      healthScore, time, totalSpent, burnRate, savingsRate,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// ────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-100 rounded-2xl p-5 ${className}`} style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    {children}
  </div>
);

const Badge = ({ children, color = "orange" }) => {
  const colors = {
    orange: "bg-orange-50 text-orange-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    blue: "bg-indigo-50 text-indigo-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${colors[color]}`}>{children}</span>;
};

const Pill = ({ label, tooltip, beginnerMode }) => (
  <span className="relative group">
    <span className="text-[11px] font-medium text-gray-500 border-b border-dashed border-gray-400 cursor-help">{label}</span>
    {beginnerMode && tooltip && (
      <span className="absolute bottom-full left-0 mb-1 w-52 bg-gray-900 text-white text-[11px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
        {tooltip}
      </span>
    )}
  </span>
);

const ProgressBar = ({ value, max, color = "#E8692A", height = 6 }) => (
  <div className="w-full rounded-full overflow-hidden" style={{ height, background: "#F3F4F6" }}>
    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: color }} />
  </div>
);

const StatCard = ({ title, value, sub, icon, color = "#E8692A", tooltip, beginnerMode }) => (
  <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300">
    <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">{icon}</div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
      {beginnerMode && tooltip ? <Pill label={title} tooltip={tooltip} beginnerMode={beginnerMode} /> : title}
    </p>
    <div className="text-2xl font-bold text-gray-900 tracking-tight">{value}</div>
    {sub && <p className="text-[11px] text-gray-400 mt-1 font-medium">{sub}</p>}
    <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background: color }} />
  </Card>
);

// ────────────────────────────────────────────────────────────
// SIDEBAR
// ────────────────────────────────────────────────────────────
const Sidebar = () => {
  const { tab, setTab, healthScore, userName, beginnerMode } = useContext(AppContext);
  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "sip", icon: "📈", label: "SIP Planner" },
    { id: "goals", icon: "🎯", label: "Dream Engine" },
    { id: "auditor", icon: "🔍", label: "Auditor Mode" },
    { id: "upload", icon: "📂", label: "Statements" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="w-56 bg-white border-r border-gray-100 flex flex-col h-full shrink-0" style={{ boxShadow: "1px 0 4px rgba(0,0,0,0.04)" }}>
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col items-start gap-3 mb-1">
          <Logo variant="full" height="h-11" />
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider pl-1">Student OS v4.0</p>
        </div>
        {beginnerMode && (
          <div className="mt-2 text-[10px] font-semibold px-2 py-1 rounded-lg" style={{ background: "#FFF4EF", color: "#E8692A" }}>
            🎓 Beginner Mode ON
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
              tab === item.id
                ? "text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
            style={tab === item.id ? { background: "#E8692A" } : {}}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Health Score</span>
            <span className="text-sm font-bold" style={{ color: healthScore > 70 ? "#1D9E75" : "#E8692A" }}>{healthScore}%</span>
          </div>
          <ProgressBar value={healthScore} max={100} color={healthScore > 70 ? "#1D9E75" : "#E8692A"} />
          {beginnerMode && <p className="text-[10px] text-gray-400 mt-1.5">Your overall money health. Aim for 80%+</p>}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-700">{userName[0]}</div>
          <div>
            <p className="text-xs font-bold text-gray-800">{userName}</p>
            <p className="text-[10px] text-gray-400">Student Account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// DASHBOARD
// ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { transactions, balance, totalSpent, burnRate, savingsRate, beginnerMode, notifications, setNotifications } = useContext(AppContext);
  const [liveBalance, setLiveBalance] = useState(balance);
  const [balancePulse, setBalancePulse] = useState(false);

  useEffect(() => {
    setLiveBalance(balance);
    setBalancePulse(true);
    const t = setTimeout(() => setBalancePulse(false), 600);
    return () => clearTimeout(t);
  }, [balance]);

  const spendingPie = [
    { name: "Food", value: 8700, color: "#E8692A" },
    { name: "Transport", value: 1350, color: "#F59E0B" },
    { name: "Subscriptions", value: 4200, color: "#6366F1" },
    { name: "Shopping", value: 3400, color: "#1D9E75" },
  ];

  const recentTxns = transactions.slice(0, 8);

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="col-span-1 relative overflow-hidden">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Live Balance</p>
          <div className={`text-2xl font-bold transition-colors duration-300 ${balancePulse ? "text-orange-500" : "text-gray-900"}`}>
            ₹{liveBalance.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-600 font-semibold">Live</span>
          </div>
          {beginnerMode && <p className="text-[10px] text-gray-400 mt-2">Money currently in your account</p>}
        </Card>
        <StatCard title="Monthly Spent" value={`₹${totalSpent.toLocaleString("en-IN")}`} icon="💸" tooltip="Total money you spent this month across all categories" beginnerMode={beginnerMode} />
        <StatCard title="Burn Rate" value={`₹${burnRate.toLocaleString("en-IN")}/mo`} icon="🔥" color="#F59E0B" tooltip="How fast you're spending money. Lower is better!" beginnerMode={beginnerMode} />
        <StatCard title="Savings Rate" value={`${savingsRate}%`} icon="💰" color="#1D9E75" tooltip="% of income you're saving. Aim for 20%+ as a student" beginnerMode={beginnerMode} sub="of income saved" />
      </div>

      {/* Notifications strip */}
      {notifications.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {notifications.map(n => (
            <div key={n.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 ${
              n.type === "warning" ? "bg-amber-50 text-amber-800" :
              n.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-blue-50 text-blue-800"
            }`}>
              <span>{n.type === "warning" ? "⚠️" : n.type === "success" ? "✅" : "ℹ️"}</span>
              {n.msg}
              <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="ml-1 opacity-60 hover:opacity-100">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Monthly Spending Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="foodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8692A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E8692A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} />
              <Area type="monotone" dataKey="food" stroke="#E8692A" strokeWidth={2} fill="url(#foodGrad)" name="Food" />
              <Area type="monotone" dataKey="subs" stroke="#6366F1" strokeWidth={2} fill="none" name="Subscriptions" />
              <Area type="monotone" dataKey="transport" stroke="#F59E0B" strokeWidth={2} fill="none" name="Transport" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={spendingPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {spendingPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} contentStyle={{ borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {spendingPie.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: s.color }} /><span className="text-gray-600">{s.name}</span></span>
                <span className="font-semibold text-gray-800">₹{s.value.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Recent Transactions</h3>
        <div className="space-y-1">
          {recentTxns.map((t, i) => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 group hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ background: t.color + "DD" }}>
                  {t.merchant[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.merchant}</p>
                  <p className="text-[11px] text-gray-400">{t.date} · {t.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-800">-₹{t.amount.toLocaleString("en-IN")}</span>
                <Badge color={t.category === "Food" ? "orange" : t.category === "Subscriptions" ? "blue" : "amber"}>
                  {t.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// SIP PLANNER
// ────────────────────────────────────────────────────────────
const SIPPlanner = () => {
  const { beginnerMode, sipPlans, setSipPlans } = useContext(AppContext);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);
  const [skipMonths, setSkipMonths] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [saved, setSaved] = useState(false);

  const calcFV = (m, r, y, skip = 0) => {
    const n = y * 12 - skip;
    const monthlyRate = r / 100 / 12;
    if (monthlyRate === 0) return m * n;
    return m * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
  };

  const fv = Math.floor(calcFV(monthly, rate, years));
  const fvSkip = Math.floor(calcFV(monthly, rate, years, skipMonths));
  const invested = monthly * years * 12;
  const gain = fv - invested;
  const riskLevel = rate <= 8 ? { label: "Low", color: "#1D9E75", bg: "#F0FDF4" } : rate <= 14 ? { label: "Medium", color: "#F59E0B", bg: "#FFFBEB" } : { label: "High", color: "#EF4444", bg: "#FEF2F2" };

  const chartData = Array.from({ length: years }, (_, i) => ({
    year: `Yr ${i + 1}`,
    value: Math.floor(calcFV(monthly, rate, i + 1)),
    invested: monthly * (i + 1) * 12,
  }));

  const handleSave = () => {
    setSipPlans(prev => [...prev, { id: Date.now(), monthly, rate, years, fv, name: `SIP Plan ${prev.length + 1}` }]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">SIP Investment Planner</h2>
          {beginnerMode && <p className="text-sm text-gray-500 mt-0.5">SIP = Systematic Investment Plan — invest a fixed amount every month 📅</p>}
        </div>
        <button onClick={handleSave} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${saved ? "bg-green-500 text-white" : "text-white"}`} style={saved ? {} : { background: "#E8692A" }}>
          {saved ? "✓ Saved!" : "Save Plan"}
        </button>
      </div>

      {beginnerMode && (
        <Card className="border-orange-100" style={{ background: "#FFF4EF" }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-orange-900 mb-1">What is SIP?</p>
              <p className="text-sm text-orange-800 leading-relaxed">
                A SIP lets you invest a small fixed amount (like ₹500) every month into mutual funds. 
                Over time, your money grows through <strong>compounding</strong> — earning returns on your returns!
                Even ₹500/month at 12% return can become ₹{Math.floor(calcFV(500, 12, 5)).toLocaleString("en-IN")} in 5 years.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Controls */}
        <Card className="col-span-1 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Monthly Investment</label>
              <span className="text-sm font-bold text-orange-600">₹{monthly.toLocaleString("en-IN")}</span>
            </div>
            <input type="range" min="100" max="10000" step="100" value={monthly} onChange={e => setMonthly(+e.target.value)} className="w-full accent-orange-500" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>₹100</span><span>₹10,000</span></div>
            {beginnerMode && <p className="text-[11px] text-gray-400 mt-1">Start small! Even ₹200/month adds up over years.</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expected Annual Return</label>
              <span className="text-sm font-bold" style={{ color: riskLevel.color }}>{rate}%</span>
            </div>
            <input type="range" min="4" max="20" step="1" value={rate} onChange={e => setRate(+e.target.value)} className="w-full accent-orange-500" />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: riskLevel.bg, color: riskLevel.color }}>
                Risk: {riskLevel.label}
              </span>
              {beginnerMode && <span className="text-[11px] text-gray-400">{rate <= 8 ? "🏦 Like FD returns" : rate <= 14 ? "📊 Mutual fund returns" : "⚡ Stocks/crypto"}</span>}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</label>
              <span className="text-sm font-bold text-gray-800">{years} years</span>
            </div>
            <input type="range" min="1" max="30" step="1" value={years} onChange={e => setYears(+e.target.value)} className="w-full accent-orange-500" />
          </div>

          <div className="pt-2 border-t border-gray-100">
            <button onClick={() => setShowSkip(!showSkip)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              {showSkip ? "▼" : "▶"} Simulate skipping months
            </button>
            {showSkip && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">Months skipped</span>
                  <span className="text-xs font-bold text-red-500">{skipMonths} months</span>
                </div>
                <input type="range" min="0" max={years * 12 - 1} step="1" value={skipMonths} onChange={e => setSkipMonths(+e.target.value)} className="w-full accent-red-500" />
                <div className="mt-2 p-2 rounded-xl text-xs" style={{ background: "#FEF2F2" }}>
                  <span className="font-bold text-red-700">Loss from skipping: ₹{(fv - fvSkip).toLocaleString("en-IN")}</span>
                  {beginnerMode && <p className="text-red-600 mt-0.5">Skipping just a few months can cost you thousands in the long run!</p>}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Results */}
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center" style={{ background: "#FFF4EF", borderColor: "#FDDFC8" }}>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">You Invest</p>
              <p className="text-xl font-bold text-orange-800">₹{invested.toLocaleString("en-IN")}</p>
            </Card>
            <Card className="text-center" style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">You Earn</p>
              <p className="text-xl font-bold text-green-800">+₹{gain.toLocaleString("en-IN")}</p>
            </Card>
            <Card className="text-center border-2" style={{ borderColor: "#E8692A" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#E8692A" }}>Future Value</p>
              <p className="text-xl font-bold text-gray-900">₹{fv.toLocaleString("en-IN")}</p>
            </Card>
          </div>

          <Card>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Wealth Growth Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="sipGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8692A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E8692A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                <Area type="monotone" dataKey="invested" stroke="#D1D5DB" strokeWidth={2} fill="none" name="Invested" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="value" stroke="#E8692A" strokeWidth={2.5} fill="url(#sipGrad)" name="Total Value" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {beginnerMode && (
            <Card className="border-indigo-100" style={{ background: "#EEF2FF" }}>
              <p className="text-xs font-bold text-indigo-800 mb-1">🧠 Key Insight</p>
              <p className="text-sm text-indigo-700">
                If you invest ₹{monthly.toLocaleString("en-IN")}/month for {years} years at {rate}% returns,
                your ₹{invested.toLocaleString("en-IN")} investment could become ₹{fv.toLocaleString("en-IN")} — 
                a gain of ₹{gain.toLocaleString("en-IN")} ({Math.floor((gain / invested) * 100)}% profit)! 
                This is the magic of <strong>compounding</strong>.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Saved plans */}
      {sipPlans.length > 0 && (
        <Card>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Your Saved SIP Plans</h3>
          <div className="grid grid-cols-3 gap-3">
            {sipPlans.map(plan => (
              <div key={plan.id} className="p-3 rounded-xl border border-orange-100 bg-orange-50">
                <p className="text-xs font-bold text-orange-800">{plan.name}</p>
                <p className="text-sm font-bold text-gray-900 mt-1">₹{plan.monthly}/mo · {plan.rate}% · {plan.years}yr</p>
                <p className="text-xs text-green-700 font-semibold mt-1">→ ₹{plan.fv.toLocaleString("en-IN")}</p>
                <button onClick={() => setSipPlans(prev => prev.filter(p => p.id !== plan.id))} className="text-[10px] text-red-500 hover:text-red-700 mt-1">Delete</button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// DREAM ENGINE
// ────────────────────────────────────────────────────────────
const DreamEngine = () => {
  const { goals, setGoals, beginnerMode } = useContext(AppContext);
  const [newGoal, setNewGoal] = useState({ name: "", target: "", saved: "", monthly: "", icon: "⭐" });
  const [editId, setEditId] = useState(null);
  const [aiPlan, setAiPlan] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const icons = ["💻", "🏖️", "🛡️", "🎓", "🏍️", "✈️", "📱", "🎸", "🏠", "⭐"];

  const totalMonthly = goals.reduce((s, g) => s + g.monthly, 0);

  const getStatus = (g) => {
    const rem = g.target - g.saved;
    const months = Math.ceil(rem / g.monthly);
    if (months <= g.deadline) return { label: "On Track", color: "#1D9E75", bg: "#F0FDF4" };
    if (months <= g.deadline * 1.3) return { label: "Challenging", color: "#F59E0B", bg: "#FFFBEB" };
    return { label: "Behind", color: "#EF4444", bg: "#FEF2F2" };
  };

  const handleAdd = () => {
    if (!newGoal.name || !newGoal.target) return;
    setGoals(prev => [...prev, {
      ...newGoal, id: Date.now(), target: +newGoal.target, saved: +newGoal.saved || 0,
      monthly: +newGoal.monthly || 500, deadline: 12,
      color: ["#E8692A", "#1D9E75", "#6366F1", "#F59E0B"][prev.length % 4],
    }]);
    setNewGoal({ name: "", target: "", saved: "", monthly: "", icon: "⭐" });
  };

  const handleDelete = (id) => setGoals(prev => prev.filter(g => g.id !== id));

  const generateAIPlan = async () => {
    setLoadingAI(true);
    setAiPlan("");
    const prompt = goals.map(g => `${g.icon} ${g.name}: needs ₹${(g.target - g.saved).toLocaleString("en-IN")} more, saving ₹${g.monthly}/month`).join("; ");

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a friendly financial coach for college students in India. A student has these financial goals: ${prompt}. Total monthly savings allocated: ₹${totalMonthly}.

Give a practical, encouraging 150-word plan in simple language. Include:
1. Priority order recommendation
2. One tip to reach goals faster
3. What to do if money is tight
Use bullet points, keep it motivating, use ₹ symbol.`
          }]
        })
      });
      const data = await resp.json();
      setAiPlan(data.content?.[0]?.text || "Could not generate plan. Please try again.");
    } catch {
      setAiPlan("AI advisor is offline. Tip: Focus on your highest-priority goal first, and automate your monthly savings on the 1st of each month!");
    }
    setLoadingAI(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dream Engine</h2>
          {beginnerMode && <p className="text-sm text-gray-500 mt-0.5">Set your financial goals and track your progress 🎯</p>}
        </div>
        <button onClick={generateAIPlan} disabled={loadingAI} className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60" style={{ background: "#6366F1" }}>
          {loadingAI ? "🤔 Thinking..." : "✨ Get AI Plan"}
        </button>
      </div>

      {/* AI Plan */}
      {aiPlan && (
        <Card className="border-indigo-100" style={{ background: "#EEF2FF" }}>
          <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">🤖 AI Financial Roadmap</p>
          <p className="text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap">{aiPlan}</p>
        </Card>
      )}

      {/* Budget summary */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Goals Budget Overview</h3>
          <span className="text-sm font-bold text-gray-800">₹{totalMonthly.toLocaleString("en-IN")}/mo allocated</span>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={goals} layout="vertical" margin={{ top: 0, right: 10, left: 60, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={v => `₹${v}/mo`} contentStyle={{ borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="monthly" radius={[0, 4, 4, 0]}>
              {goals.map((g, i) => <Cell key={i} fill={g.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Goals list */}
      <div className="grid grid-cols-2 gap-4">
        {goals.map(g => {
          const pct = Math.min((g.saved / g.target) * 100, 100);
          const rem = g.target - g.saved;
          const months = Math.ceil(rem / g.monthly);
          const status = getStatus(g);
          const isEditing = editId === g.id;

          return (
            <Card key={g.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{g.icon}</span>
                  <div>
                    {isEditing ? (
                      <input defaultValue={g.name} className="text-sm font-bold border border-orange-300 rounded px-1 py-0.5 w-28"
                        onBlur={e => { setGoals(prev => prev.map(x => x.id === g.id ? { ...x, name: e.target.value } : x)); setEditId(null); }} autoFocus />
                    ) : (
                      <p className="text-sm font-bold text-gray-900">{g.name}</p>
                    )}
                    <p className="text-[11px] text-gray-400">Priority {g.priority}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: status.bg, color: status.color }}>{status.label}</span>
                  <button onClick={() => setEditId(isEditing ? null : g.id)} className="text-gray-300 hover:text-orange-500 transition-colors text-xs">✏️</button>
                  <button onClick={() => handleDelete(g.id)} className="text-gray-300 hover:text-red-500 transition-colors text-xs">🗑️</button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">₹{g.saved.toLocaleString("en-IN")} saved</span>
                  <span className="font-bold text-gray-800">₹{g.target.toLocaleString("en-IN")}</span>
                </div>
                <ProgressBar value={g.saved} max={g.target} color={g.color} height={8} />
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">{pct.toFixed(0)}% complete</span>
                  <span className="font-semibold text-gray-600">{months} months to go</span>
                </div>
              </div>

              {isEditing && (
                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                  {[
                    { label: "Target (₹)", key: "target" },
                    { label: "Saved (₹)", key: "saved" },
                    { label: "Monthly (₹)", key: "monthly" },
                    { label: "Deadline (mo)", key: "deadline" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-[10px] text-gray-400 font-semibold">{f.label}</label>
                      <input type="number" defaultValue={g[f.key]} className="w-full text-xs border border-gray-200 rounded px-2 py-1 mt-0.5"
                        onBlur={e => setGoals(prev => prev.map(x => x.id === g.id ? { ...x, [f.key]: +e.target.value } : x))} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}

        {/* Add new goal */}
        <Card className="border-dashed border-2 border-gray-200" style={{ background: "#FAFAFA" }}>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Add New Goal</h3>
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              {icons.map(ic => (
                <button key={ic} onClick={() => setNewGoal(p => ({ ...p, icon: ic }))}
                  className={`text-xl w-8 h-8 rounded-lg border-2 transition-all ${newGoal.icon === ic ? "border-orange-400 bg-orange-50" : "border-transparent hover:border-gray-200"}`}>
                  {ic}
                </button>
              ))}
            </div>
            {[
              { placeholder: "Goal name (e.g. MacBook)", key: "name", type: "text" },
              { placeholder: "Target amount (₹)", key: "target", type: "number" },
              { placeholder: "Already saved (₹)", key: "saved", type: "number" },
              { placeholder: "Monthly savings (₹)", key: "monthly", type: "number" },
            ].map(f => (
              <input key={f.key} type={f.type} placeholder={f.placeholder} value={newGoal[f.key]}
                onChange={e => setNewGoal(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400 transition-colors" />
            ))}
            <button onClick={handleAdd} className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "#E8692A" }}>
              + Add Goal
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// AUDITOR MODE
// ────────────────────────────────────────────────────────────
const AuditorMode = () => {
  const { auditorRunning, setAuditorRunning, auditorLogs, setAuditorLogs, auditorDone, setAuditorDone } = useContext(AppContext);
  const logRef = useRef(null);

  const AUDIT_SEQUENCE = [
    "[INIT] PennyWise Security Enclave activated...",
    "[SECURE] 256-bit AES encryption layer initialized",
    "[PARSE] Loading transaction database... 847 records found",
    "[ANALYZE] Running spending pattern analysis...",
    "[AI] Behavioral anomaly detection active",
    "[SCAN] Checking subscription duplicates...",
    "[WARN] ⚠ Potential overspend in Food category: 18% above average",
    "[SCAN] Analyzing merchant frequency...",
    "[AI] Top merchant: Zomato (₹4,320 last 30 days)",
    "[DETECT] Recurring charges identified: 4 active subscriptions",
    "[AUDIT] Netflix: ₹649/mo — last watched: 3 days ago ✓",
    "[AUDIT] Spotify: ₹119/mo — daily usage ✓",
    "[AUDIT] Amazon Prime: ₹299/mo — moderate usage ✓",
    "[WARN] ⚠ Unused subscription detected: App X — ₹99/mo (not used in 45 days)",
    "[FORECAST] Burn rate trending +8% month-over-month",
    "[HEALTH] Financial Health Score calculated: 72/100",
    "[RECOMMEND] Reduce food delivery by ₹1,500/mo to hit 80+ health score",
    "[COMPLETE] ✓ Audit complete — 3 action items generated",
  ];

  const startAudit = () => {
    setAuditorLogs([]);
    setAuditorDone(false);
    setAuditorRunning(true);
    AUDIT_SEQUENCE.forEach((log, i) => {
      setTimeout(() => {
        setAuditorLogs(prev => [...prev, log]);
        if (i === AUDIT_SEQUENCE.length - 1) {
          setAuditorRunning(false);
          setAuditorDone(true);
        }
      }, i * 380 + Math.random() * 120);
    });
  };

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [auditorLogs]);

  const getLogStyle = (log) => {
    if (log.includes("[COMPLETE]")) return "text-green-400 font-bold";
    if (log.includes("[WARN]")) return "text-amber-400";
    if (log.includes("[AI]")) return "text-orange-400";
    if (log.includes("[SECURE]")) return "text-emerald-400";
    if (log.includes("[DETECT]")) return "text-blue-400";
    if (log.includes("[RECOMMEND]")) return "text-purple-400";
    return "text-gray-300";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Auditor Mode</h2>
          <p className="text-sm text-gray-500 mt-0.5">AI-powered financial diagnostics engine 🔍</p>
        </div>
        <button onClick={startAudit} disabled={auditorRunning}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
          style={{ background: auditorRunning ? "#6B7280" : "#1A1A1A" }}>
          {auditorRunning ? (<><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Running...</>) : "▶ Run Audit"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Status", value: auditorRunning ? "Scanning" : auditorDone ? "Complete" : "Ready", color: auditorRunning ? "#F59E0B" : auditorDone ? "#1D9E75" : "#6B7280" },
          { label: "Transactions", value: "847", color: "#6366F1" },
          { label: "Issues Found", value: auditorDone ? "3" : "—", color: "#EF4444" },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Terminal */}
      <Card className="p-0 overflow-hidden">
        <div className="bg-gray-900 px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400 text-xs ml-2 font-mono">pennywise-audit — financial-diagnostics</span>
        </div>
        <div ref={logRef} className="bg-gray-950 p-4 h-80 overflow-y-auto font-mono text-xs space-y-1 scroll-smooth">
          {auditorLogs.length === 0 && !auditorRunning && (
            <p className="text-gray-600">$ Run audit to begin financial diagnostics...</p>
          )}
          {auditorLogs.map((log, i) => (
            <div key={i} className={`flex items-start gap-2 ${getLogStyle(log)}`}>
              <span className="text-gray-600 shrink-0">{(i + 1).toString().padStart(2, "0")}</span>
              <span>{log}</span>
            </div>
          ))}
          {auditorRunning && (
            <div className="flex items-center gap-2 text-gray-500 animate-pulse">
              <span>$</span><span className="w-2 h-4 bg-orange-500 inline-block" />
            </div>
          )}
        </div>
      </Card>

      {/* Audit results */}
      {auditorDone && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-700">Action Items</h3>
          {[
            { icon: "⚠️", title: "Reduce food delivery spending", desc: "You're spending ₹8,700/mo on food — ₹1,500 above your budget. Try meal prepping 3 days a week.", severity: "warning" },
            { icon: "💸", title: "Cancel unused subscription", desc: "App X (₹99/mo) hasn't been used in 45 days. That's ₹1,188/year saved!", severity: "danger" },
            { icon: "📈", title: "Increase SIP contribution", desc: "Your savings rate is 18%. If you increase by ₹500/mo, you can reach your MacBook goal 4 months earlier.", severity: "success" },
          ].map((item, i) => (
            <Card key={i} className={`border-l-4 ${item.severity === "warning" ? "border-amber-400" : item.severity === "danger" ? "border-red-400" : "border-green-400"}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// UPLOAD STATEMENTS
// ────────────────────────────────────────────────────────────
const UploadStatements = () => {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => { setUploading(false); setUploaded(file.name); }, 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Upload Bank Statement</h2>
        <p className="text-sm text-gray-500 mt-0.5">Upload your PDF bank statement for AI analysis 📄</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${dragOver ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => document.getElementById("file-input").click()}
      >
        <input id="file-input" type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        {uploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-orange-600">Analyzing statement...</p>
          </div>
        ) : uploaded ? (
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto text-2xl">✅</div>
            <p className="text-sm font-bold text-green-700">{uploaded} uploaded!</p>
            <p className="text-xs text-gray-500">AI analysis complete. Check the Dashboard for insights.</p>
            <button onClick={(e) => { e.stopPropagation(); setUploaded(null); }} className="text-xs text-red-500 hover:text-red-700 mt-1">Remove file</button>
          </div>
        ) : (
          <div className="space-y-3 flex flex-col items-center">
            <Logo variant="mascot" height="h-16" className="mx-auto" />
            <div>
              <p className="text-sm font-bold text-gray-700">Drop your bank statement PDF here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse · PDF format · Max 10MB</p>
            </div>
          </div>
        )}
      </div>

      <Card>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Supported Banks</h3>
        <div className="grid grid-cols-4 gap-3">
          {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB", "BOB", "Canara"].map(b => (
            <div key={b} className="text-center py-2 px-3 rounded-xl border border-gray-100 text-xs font-semibold text-gray-600">{b}</div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// SETTINGS
// ────────────────────────────────────────────────────────────
const Settings = () => {
  const { beginnerMode, setBeginnerMode } = useContext(AppContext);
  const [profile, setProfile] = useState({ name: "Arjun Sharma", income: "18000", college: "IIT Bombay", year: "3rd Year B.Tech" });
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const toggles = [
    { label: "Beginner Mode", desc: "Show tooltips and simple explanations", key: "beginner" },
    { label: "Live Notifications", desc: "Real-time spending alerts", key: "notifs" },
    { label: "Auto-analyze statements", desc: "AI analysis on upload", key: "auto" },
  ];
  const [toggleStates, setToggleStates] = useState({ beginner: beginnerMode, notifs: true, auto: true });

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Settings</h2>

      <Card>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Full Name", key: "name" },
            { label: "Monthly Income (₹)", key: "income" },
            { label: "College", key: "college" },
            { label: "Year", key: "year" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{f.label}</label>
              <input type="text" value={profile[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400 transition-colors" />
            </div>
          ))}
        </div>
        <button onClick={handleSave} className={`mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all ${saved ? "bg-green-500" : ""}`} style={saved ? {} : { background: "#E8692A" }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </Card>

      <Card>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Preferences</h3>
        <div className="space-y-4">
          {toggles.map(t => (
            <div key={t.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">{t.label}</p>
                <p className="text-xs text-gray-400">{t.desc}</p>
              </div>
              <button
                onClick={() => {
                  const next = !toggleStates[t.key];
                  setToggleStates(p => ({ ...p, [t.key]: next }));
                  if (t.key === "beginner") setBeginnerMode(next);
                }}
                className={`w-12 h-6 rounded-full transition-all duration-200 relative ${toggleStates[t.key] ? "bg-orange-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${toggleStates[t.key] ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {beginnerMode && (
        <Card style={{ background: "#EEF2FF", borderColor: "#C7D2FE" }}>
          <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-3">📚 Financial Lesson of the Day</h3>
          <p className="text-sm text-indigo-800 leading-relaxed">
            <strong>The 50-30-20 Rule:</strong> Split your income into three buckets — 
            50% for needs (rent, food, transport), 30% for wants (entertainment, shopping), 
            and 20% for savings and investments. As a student, try to save at least 15-20% of your allowance or income!
          </p>
        </Card>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────────────────
const TABS = { dashboard: Dashboard, sip: SIPPlanner, goals: DreamEngine, auditor: AuditorMode, upload: UploadStatements, settings: Settings };

const AppContent = () => {
  const { tab, time, balance, notifications, showNotifPanel, setShowNotifPanel, beginnerMode } = useContext(AppContext);
  const TabComponent = TABS[tab] || Dashboard;

  const tabLabels = { dashboard: "Dashboard", sip: "SIP Planner", goals: "Dream Engine", auditor: "Auditor Mode", upload: "Statements", settings: "Settings" };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shrink-0" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Secure Session</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">{tabLabels[tab]}</h1>
          </div>
          <div className="flex items-center gap-3">
            {beginnerMode && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                🎓 Beginner Mode
              </span>
            )}
            <div className="relative">
              <button onClick={() => setShowNotifPanel(!showNotifPanel)} className="w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors relative">
                🔔
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifPanel && (
                <div className="absolute right-0 top-11 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-3 space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Notifications</p>
                  {notifications.map(n => (
                    <div key={n.id} className={`p-2.5 rounded-xl text-xs ${n.type === "warning" ? "bg-amber-50" : n.type === "success" ? "bg-emerald-50" : "bg-blue-50"}`}>
                      <p className="font-semibold text-gray-800">{n.msg}</p>
                      <p className="text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="text-xs font-mono font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">{time}</div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <TabComponent />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
