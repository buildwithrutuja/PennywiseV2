import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCircle, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockUsers } from '../../data/mockUsers';
import Logo from '../Logo';

export default function Login({ onNavigate }) {
  const { login, loginWithDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      onNavigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (userId) => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithDemo(userId);
      onNavigate('/dashboard');
    } catch (err) {
      setError("Failed to load demo user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pw-surface flex items-center justify-center p-6 relative overflow-hidden text-pw-text transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-pw-primary-muted/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pw-primary/20 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10"
      >
        {/* Left Side: Login Form */}
        <div className="pw-glass rounded-3xl p-8 md:p-12 pw-shadow glow-primary relative overflow-hidden">
          {/* Subtle OS decoration */}
          <div className="absolute top-0 right-0 p-4 opacity-30 pointer-events-none">
            <Cpu className="w-24 h-24 text-pw-primary" />
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Logo variant="full" height="h-9" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome Back.</h2>
            <p className="text-pw-text-muted">Access your student financial operating system.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 ml-1">Student Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pw-text-hint" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-pw-surface/50 border border-pw-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-pw-primary focus:ring-1 focus:ring-pw-primary transition-all text-pw-text"
                  placeholder="your.name@college.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pw-text-hint" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-pw-surface/50 border border-pw-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-pw-primary focus:ring-1 focus:ring-pw-primary transition-all text-pw-text"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end mt-2">
                <button type="button" className="text-xs text-pw-primary hover:underline" onClick={() => onNavigate('/forgot-password')}>
                  Forgot Password?
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-pw-red/10 border border-pw-red/20 text-pw-red text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-pw-primary hover:bg-pw-primary-muted text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 pw-shadow mt-4"
            >
              {isLoading ? 'Authenticating...' : 'Secure Login'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-pw-text-muted">
              New to PennyWise? <button onClick={() => onNavigate('/signup')} className="text-pw-primary hover:underline font-medium">Create Student Account</button>
            </p>
          </div>
        </div>

        {/* Right Side: Demo Mode */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-pw-primary" />
              Demo Modes
            </h3>
            <p className="text-sm text-pw-text-muted mt-1">Try out PennyWise with pre-configured student personas.</p>
          </div>

          <div className="grid gap-4">
            {mockUsers.map(user => (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={user.id}
                onClick={() => handleDemoLogin(user.id)}
                disabled={isLoading}
                className="flex items-center p-4 bg-pw-card border border-pw-border rounded-2xl hover:border-pw-primary transition-colors text-left pw-shadow"
              >
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full bg-pw-surface" />
                <div className="ml-4 flex-1">
                  <h4 className="font-bold text-sm">{user.name}</h4>
                  <p className="text-xs text-pw-text-muted">{user.persona} • {user.branch}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-pw-text-hint" />
              </motion.button>
            ))}
          </div>
          
          <div className="mt-8 p-4 rounded-xl bg-pw-primary/10 border border-pw-primary/20 text-sm">
            <h4 className="font-bold text-pw-primary mb-1">Privacy First</h4>
            <p className="text-pw-text-muted text-xs">Your financial data is processed locally. We do not store your bank statements on our servers.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
