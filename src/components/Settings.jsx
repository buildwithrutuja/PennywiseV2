import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Monitor, Shield, Trash2, RotateCcw, FileDown, Save, ChevronRight, Check, Lock, Moon, Sun } from 'lucide-react';
import { AIContext } from '../context/AIContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-pw-card rounded-2xl border border-pw-border pw-shadow overflow-hidden">
    <div className="px-6 py-4 border-b border-pw-border flex items-center gap-2.5">
      <Icon size={15} className="text-pw-primary" />
      <h3 className="text-xs font-bold tracking-widest uppercase text-pw-text">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-bold text-pw-text-muted tracking-widest uppercase mb-1.5">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full bg-pw-surface border border-pw-border rounded-lg px-3.5 py-2.5 text-pw-text text-sm font-medium focus:border-pw-primary focus:ring-1 focus:ring-pw-primary focus:outline-none transition-all";

const DangerButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-pw-border bg-pw-surface hover:border-pw-red/50 hover:bg-pw-red/10 group transition-all duration-200"
  >
    <span className="flex items-center gap-2.5 text-sm font-medium text-pw-text-muted group-hover:text-pw-red transition-colors">
      <Icon size={14} />
      {label}
    </span>
    <ChevronRight size={14} className="text-pw-text-hint group-hover:text-pw-red transition-colors" />
  </button>
);

const Toggle = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-pw-border last:border-0">
    <div>
      <p className="text-sm font-medium text-pw-text">{label}</p>
      {description && <p className="text-xs text-pw-text-muted mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-300 flex-shrink-0 ${value ? 'bg-pw-primary' : 'bg-pw-border'}`}
      style={{ width: 40, height: 22 }}
    >
      <motion.span
        className="absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm"
        style={{ width: 18, height: 18, top: 2 }}
        animate={{ left: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  </div>
);

const StatusBadge = ({ label, active = true }) => (
  <div className="flex items-center justify-between py-3 border-b border-pw-border last:border-0">
    <span className="text-sm font-medium text-pw-text">{label}</span>
    <span className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${active ? 'text-pw-green' : 'text-pw-red'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-pw-green' : 'bg-pw-red'} animate-pulse`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  </div>
);

const Settings = () => {
  const { setUploadedStatement, setAiInsights, setUploadState } = useContext(AIContext);
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({ 
    firstName: currentUser?.name?.split(' ')[0] || '',
    coachTone: currentUser?.preferences?.coachTone || 'Friendly'
  });
  const [saved, setSaved] = useState(false);
  const [motionEffects, setMotionEffects] = useState(true);

  const handleChange = (e) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = () => {
    // In real app, update DB
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClearData = () => {
    if (window.confirm('Clear all uploaded financial data? This cannot be undone.')) {
      setUploadedStatement(null);
      setAiInsights('');
      setUploadState('idle');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto pb-10 space-y-5"
    >
      {/* Header */}
      <div className="pb-2">
        <h2 className="text-lg font-bold text-pw-text tracking-tight flex items-center gap-2">
          Settings
        </h2>
        <p className="text-xs text-pw-text-muted mt-0.5 font-medium">Manage your profile, preferences and system controls.</p>
      </div>

      {/* ── SECTION 1: Profile ── */}
      <SectionCard title="Preferences" icon={User}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Display Name">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="AI Coach Tone">
              <select name="coachTone" value={formData.coachTone} onChange={handleChange} className={inputCls}>
                <option>Friendly</option>
                <option>Strict</option>
                <option>Professional</option>
                <option>Motivational</option>
              </select>
            </Field>
          </div>
          
          <div className="pt-2 flex justify-end items-center gap-3">
            <AnimatePresence>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs font-bold text-pw-green"
                >
                  <Check size={13} /> Saved
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-pw-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-pw-primary-muted transition-colors duration-300"
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      </SectionCard>

      {/* ── SECTION 2: Appearance ── */}
      <SectionCard title="Appearance & Theme" icon={Monitor}>
        <div>
          <div className="flex items-center justify-between py-3 border-b border-pw-border">
            <div>
              <p className="text-sm font-medium text-pw-text">Dark Mode</p>
              <p className="text-xs text-pw-text-muted mt-0.5">Toggle Turkish Blue dark mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-pw-surface border border-pw-border hover:border-pw-primary text-pw-text transition-colors"
            >
              {theme === 'dark' ? <Moon size={18} className="text-pw-primary" /> : <Sun size={18} className="text-pw-amber" />}
            </button>
          </div>
          <Toggle
            label="Motion Effects"
            description="Smooth animations throughout the app"
            value={motionEffects}
            onChange={setMotionEffects}
          />
        </div>
      </SectionCard>

      {/* ── SECTION 3: System ── */}
      <SectionCard title="System Controls" icon={Briefcase}>
        <div className="space-y-2">
          <DangerButton icon={RotateCcw} label="Reset App State" onClick={() => window.location.reload()} />
          <DangerButton icon={Trash2} label="Clear Uploaded Financial Data" onClick={handleClearData} />
          <DangerButton icon={FileDown} label="Export Financial Report" onClick={() => {}} />
        </div>
      </SectionCard>

      {/* ── SECTION 4: Security ── */}
      <SectionCard title="Privacy & Security" icon={Shield}>
        <div>
          <StatusBadge label="Local-first processing" active />
          <StatusBadge label="No cloud financial storage" active />
          <StatusBadge label="AI analysis processed on-device" active />
          <div className="pt-3 mt-1 flex items-start gap-2.5 text-xs text-pw-text-muted bg-pw-surface rounded-xl p-3.5">
            <Lock size={13} className="text-pw-green mt-0.5 shrink-0" />
            <p>Your financial data never leaves your device. All AI analysis is performed locally and securely before any network transmission.</p>
          </div>
        </div>
      </SectionCard>
    </motion.div>
  );
};

export default Settings;
