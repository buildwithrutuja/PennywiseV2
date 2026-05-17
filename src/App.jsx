import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, X, Minus, Square } from "lucide-react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";
import { AIContextProvider, AIContext } from "./context/AIContext";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";

import Sidebar from "./components/Sidebar";
import AuditorPanel from "./components/AuditorPanel";
import Dashboard from "./components/Dashboard";
import UploadStatement from "./components/UploadStatement";
import DreamEngine from "./components/DreamEngine";
import Onboarding from "./components/Onboarding";
import Settings from "./components/Settings";
import StartupAnimation from "./components/StartupAnimation";
import Profile from "./components/Profile"; // Make sure to create this
import BudgetPlanner from "./components/BudgetPlanner"; // Make sure to create this

const AuthenticatedLayout = () => {
  const { currentUser } = useAuth();
  const { activeTab, userProfile } = React.useContext(AIContext);
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
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.8 }}
      className="relative w-screen h-screen overflow-hidden flex flex-col bg-pw-surface text-pw-text font-sans"
    >
      
      {/* Title Bar (Tauri style) */}
      <div data-tauri-drag-region className="h-8 bg-[#1A1A1A] dark:bg-black flex items-center justify-between px-3 select-none shrink-0 z-50 transition-colors">
        <div className="flex items-center gap-2 pointer-events-none text-white/70">
          <div className="w-4 h-4 rounded bg-pw-primary flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">PW</span>
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

const AppRoutes = () => {
  const [showStartup, setShowStartup] = useState(true);

  if (showStartup) {
    return <StartupAnimation onComplete={() => setShowStartup(false)} />;
  }

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