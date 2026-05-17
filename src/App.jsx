import { useState, useEffect, useContext, createContext, useCallback, useRef } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Use AI context's userProfile if onboarding not done, else use the mock auth user
  // For V2, we might want to consolidate this. For now, let's just check if it's a new user
  if (currentUser.persona === "New User" && !userProfile?.onboardingCompleted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <Onboarding />
      </motion.div>
    );
  }

  return (
    <div className="w-56 bg-white border-r border-gray-100 flex flex-col h-full shrink-0" style={{ boxShadow: "1px 0 4px rgba(0,0,0,0.04)" }}>
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: "#E8692A" }}>₹</div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">PennyWise</h2>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Student OS v4.0</p>
          </div>
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
          <span className="text-[11px] font-medium tracking-wide">PennyWise OS</span>
        </div>
        <div className="flex items-center gap-3 text-white/50">
          <Minus size={14} className="hover:text-white cursor-pointer transition-colors" />
          <Square size={12} className="hover:text-white cursor-pointer transition-colors" />
          <X size={16} className="hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Main Workspace */}
        <div className="flex-1 flex flex-col bg-pw-surface transition-colors duration-300">
          {/* Top Header */}
          <header className="px-8 py-5 flex justify-between items-center border-b border-pw-border shrink-0 bg-pw-card">
            <div>
              <p className="text-[10px] font-semibold text-pw-primary tracking-widest uppercase mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pw-green animate-pulse"></span>
                Secure Session Active
              </p>
              <h1 className="text-[22px] tracking-tight font-bold text-pw-text">
                {currentUser.name ? `${currentUser.name.split(' ')[0]}'s Workspace` : 'My Workspace'}
              </h1>
              <p className="text-xs text-pw-text-muted mt-1 font-medium">AI-powered financial insights and goal tracking.</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium bg-pw-card px-4 py-2.5 rounded-xl border border-pw-border pw-shadow">
              <span className="flex items-center gap-1.5 text-pw-green font-bold">
                <Activity size={12} />
                All Systems Online
              </span>
              <span className="w-px h-3 bg-pw-border"></span>
              <span className="text-pw-text-muted font-pw-mono tracking-widest">{time}</span>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === "Dashboard" && <Dashboard />}
                {activeTab === "Budget Planner" && <BudgetPlanner />}
                {activeTab === "Dream Engine" && <DreamEngine />}
                {activeTab === "Upload Statement" && <UploadStatement />}
                {activeTab === "Settings" && <Settings />}
                {activeTab === "Profile" && <Profile />}
                
                {/* Fallback for other tabs */}
                {activeTab === "Auditor Mode" && (
                  <div className="h-full flex flex-col items-center justify-center gap-3">
                    <p className="text-sm font-medium text-pw-text-muted">Open the Diagnostics panel on the right sidebar.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel - Auditor Mode */}
        <AuditorPanel />
      </div>
    </motion.div>
  );
};

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  return React.cloneElement(children, { onNavigate: navigate });
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
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto text-2xl">📂</div>
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
    <Routes>
      <Route path="/login" element={<AuthWrapper><Login /></AuthWrapper>} />
      <Route path="/signup" element={<AuthWrapper><Signup /></AuthWrapper>} />
      <Route path="/forgot-password" element={<AuthWrapper><ForgotPassword /></AuthWrapper>} />
      <Route path="/dashboard" element={<AuthenticatedLayout />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AIContextProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AIContextProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;