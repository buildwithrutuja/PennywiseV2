import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, GraduationCap, Building2, Wallet, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const { getFinancialHealthScore } = useData();

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold font-sans">Student Profile</h2>
          <p className="text-pw-text-muted text-sm mt-1">Manage your academic and financial identity.</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-pw-red/10 text-pw-red rounded-xl hover:bg-pw-red/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 bg-pw-card rounded-2xl p-6 border border-pw-border pw-shadow flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 rounded-full bg-pw-surface border-4 border-pw-primary/20 p-1 mb-4">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full" />
          </div>
          <h3 className="text-xl font-bold">{currentUser.name}</h3>
          <p className="text-sm text-pw-text-muted mt-1">{currentUser.role}</p>
          
          <div className="mt-6 w-full space-y-3">
            <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-pw-surface/50 border border-pw-border">
              <Mail className="w-4 h-4 text-pw-text-hint" />
              <span className="text-pw-text truncate">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-pw-surface/50 border border-pw-border">
              <Building2 className="w-4 h-4 text-pw-text-hint" />
              <span className="text-pw-text truncate">{currentUser.university}</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-pw-surface/50 border border-pw-border">
              <GraduationCap className="w-4 h-4 text-pw-text-hint" />
              <span className="text-pw-text truncate">{currentUser.branch}</span>
            </div>
          </div>
        </motion.div>

        {/* Financial Persona */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 md:col-span-2 space-y-6"
        >
          <div className="bg-pw-card rounded-2xl p-6 border border-pw-border pw-shadow">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-pw-primary" />
              Financial Identity
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-pw-surface border border-pw-border">
                <p className="text-xs text-pw-text-muted font-medium mb-1">AI Persona Analysis</p>
                <p className="text-lg font-bold text-pw-primary">{currentUser.persona}</p>
              </div>
              <div className="p-4 rounded-xl bg-pw-surface border border-pw-border">
                <p className="text-xs text-pw-text-muted font-medium mb-1">Health Score</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-pw-green">{getFinancialHealthScore()}</p>
                  <p className="text-sm text-pw-text-muted mb-1">/ 100</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-pw-surface border border-pw-border">
                <p className="text-xs text-pw-text-muted font-medium mb-1">Monthly Allowance</p>
                <p className="text-lg font-bold">₹{currentUser.financials?.monthlyAllowance?.toLocaleString() || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-pw-surface border border-pw-border">
                <p className="text-xs text-pw-text-muted font-medium mb-1">Current Savings</p>
                <p className="text-lg font-bold">₹{currentUser.financials?.currentSavings?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-pw-card rounded-2xl p-6 border border-pw-border pw-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-pw-text-hint" />
                Quick Preferences
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border-b border-pw-border">
                <div>
                  <p className="font-medium text-sm">AI Coach Tone</p>
                  <p className="text-xs text-pw-text-muted">How the AI talks to you</p>
                </div>
                <span className="px-3 py-1 bg-pw-primary/10 text-pw-primary text-xs font-bold rounded-lg border border-pw-primary/20">
                  {currentUser.preferences?.coachTone || "Friendly"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3">
                <div>
                  <p className="font-medium text-sm">Data Privacy</p>
                  <p className="text-xs text-pw-text-muted">Local-first processing enabled</p>
                </div>
                <span className="px-3 py-1 bg-pw-green/10 text-pw-green text-xs font-bold rounded-lg border border-pw-green/20">
                  Secured
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
