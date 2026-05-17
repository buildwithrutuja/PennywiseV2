import React, { useContext } from 'react';
import { Target, UploadCloud, Shield, Settings, Activity, Calculator, User } from 'lucide-react';
import { AIContext } from '../context/AIContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Logo from './Logo';

const Sidebar = () => {
  const { activeTab, setActiveTab } = useContext(AIContext);
  const { currentUser } = useAuth();
  const { getFinancialHealthScore } = useData();

  const healthScore = getFinancialHealthScore();

  const navItems = [
    { name: "Dashboard", icon: <Activity size={18} /> },
    { name: "Budget Planner", icon: <Calculator size={18} /> },
    { name: "Upload Statement", icon: <UploadCloud size={18} /> },
    { name: "Dream Engine", icon: <Target size={18} /> },
    { name: "Auditor Mode", icon: <Shield size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
    { name: "Profile", icon: <User size={18} /> },
  ];

  return (
    <div className="w-[240px] bg-pw-surface border-r border-pw-border flex flex-col h-full shrink-0 transition-colors duration-300">
      {/* Header */}
      <div className="p-6 flex flex-col items-start gap-3">
        <Logo variant="full" height="h-11" />
        <div className="space-y-0.5 mt-1 pl-1">
          <p className="text-[9px] font-bold text-pw-text-muted tracking-widest uppercase">
            System OS V3.0
          </p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar pb-4">
        {navItems.map((item) => {
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] ${
                isActive 
                  ? "bg-pw-primary-light text-pw-primary border-pw-primary" 
                  : "text-pw-text-muted border-transparent hover:bg-pw-card hover:text-pw-text hover:border-pw-border"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Financial Health Widget */}
      {currentUser && (
        <div className="mx-4 mb-4 p-4 rounded-xl bg-pw-card border border-pw-border pw-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-pw-text-muted tracking-wider uppercase">Health Score</span>
            <span className={`text-sm font-bold ${healthScore ? 'text-pw-green' : 'text-pw-text-hint'}`}>
              {healthScore ? `${healthScore}/100` : '—'}
            </span>
          </div>
          <div className="w-full bg-pw-surface h-1.5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${healthScore ? 'bg-pw-green' : 'bg-transparent'}`} style={{ width: `${healthScore || 0}%` }}></div>
          </div>
        </div>
      )}
      
      {/* Footer Security */}
      <div className="p-6 border-t border-pw-border text-[10px] font-medium text-pw-text-muted space-y-2 uppercase tracking-widest bg-pw-surface">
        <p className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-pw-green glow-primary"></div> SECURE ENCLAVE
        </p>
        <p className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-pw-green glow-primary"></div> LOCAL COMPUTE
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
