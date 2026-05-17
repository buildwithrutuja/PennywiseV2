import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, GraduationCap, Building2, Wallet, Target, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Signup({ onNavigate }) {
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
    branch: '',
    allowance: '',
    savings: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
      setError('Please fill out all required fields.');
      return;
    }
    if (step === 2 && (!formData.university || !formData.branch)) {
      setError('Please fill out your academic details.');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.allowance || !formData.savings) {
      setError('Please enter your financial details.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await signup(formData);
      onNavigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pw-surface flex items-center justify-center p-6 relative overflow-hidden text-pw-text">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pw-primary-muted/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-pw-primary/20 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl pw-glass rounded-3xl p-8 md:p-12 pw-shadow glow-primary relative z-10"
      >
        <button onClick={() => onNavigate('/login')} className="absolute top-8 left-8 text-pw-text-muted hover:text-pw-primary transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl font-bold mb-2">Create Student Account</h2>
          <p className="text-pw-text-muted">Step {step} of 3: {step === 1 ? 'Basic Info' : step === 2 ? 'Academic Details' : 'Financial Setup'}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-pw-surface/50 rounded-full h-2 mb-8 overflow-hidden">
          <div 
            className="bg-pw-primary h-2 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-lg bg-pw-red/10 border border-pw-red/20 text-pw-red text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()} className="space-y-5">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pw-text-hint" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-pw-surface/50 border border-pw-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-pw-primary focus:ring-1" placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 ml-1">Student Email (.edu, .ac.in)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pw-text-hint" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-pw-surface/50 border border-pw-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-pw-primary focus:ring-1" placeholder="john.doe@college.edu" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pw-text-hint" />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-pw-surface/50 border border-pw-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-pw-primary focus:ring-1" placeholder="••••••••" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 ml-1">University / College</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pw-text-hint" />
                    <input type="text" name="university" value={formData.university} onChange={handleChange} className="w-full bg-pw-surface/50 border border-pw-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-pw-primary focus:ring-1" placeholder="e.g. IIT Bombay" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 ml-1">Course / Branch</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pw-text-hint" />
                    <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full bg-pw-surface/50 border border-pw-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-pw-primary focus:ring-1" placeholder="e.g. B.Tech Computer Science" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 ml-1">Monthly Allowance / Income (₹)</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pw-text-hint" />
                    <input type="number" name="allowance" value={formData.allowance} onChange={handleChange} className="w-full bg-pw-surface/50 border border-pw-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-pw-primary focus:ring-1" placeholder="8000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 ml-1">Current Savings (₹)</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pw-text-hint" />
                    <input type="number" name="savings" value={formData.savings} onChange={handleChange} className="w-full bg-pw-surface/50 border border-pw-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-pw-primary focus:ring-1" placeholder="2500" />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-pw-primary/10 border border-pw-primary/20 text-sm mt-4">
                  <p className="text-pw-primary font-medium text-center">You can set up your Dream Goals inside the app!</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button type="button" onClick={handlePrev} className="px-6 py-3 rounded-xl border border-pw-border text-pw-text font-medium hover:bg-pw-surface transition-colors">
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="flex-1 bg-pw-primary hover:bg-pw-primary-muted text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 pw-shadow">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={isLoading} className="flex-1 bg-pw-primary hover:bg-pw-primary-muted text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 pw-shadow">
                {isLoading ? 'Creating Account...' : 'Complete Setup'} <ShieldCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
