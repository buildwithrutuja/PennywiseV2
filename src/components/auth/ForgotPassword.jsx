import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-pw-surface flex items-center justify-center p-6 relative overflow-hidden text-pw-text">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pw-primary-muted/20 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md pw-glass rounded-3xl p-8 pw-shadow glow-primary relative z-10"
      >
        <button onClick={() => onNavigate('/login')} className="absolute top-6 left-6 text-pw-text-muted hover:text-pw-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center mb-8 mt-6">
          <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
          <p className="text-sm text-pw-text-muted">Enter your student email and we'll send you a recovery link.</p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pw-text-hint" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-pw-surface/50 border border-pw-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-pw-primary focus:ring-1" 
                  placeholder="your.name@college.edu" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full bg-pw-primary hover:bg-pw-primary-muted text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 pw-shadow disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Recovery Link'}
            </button>
          </form>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <div className="w-16 h-16 bg-pw-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-pw-green" />
            </div>
            <h3 className="font-bold text-lg mb-2">Email Sent!</h3>
            <p className="text-pw-text-muted text-sm mb-6">If an account exists for {email}, you will receive a password reset link shortly.</p>
            <button onClick={() => onNavigate('/login')} className="text-pw-primary hover:underline font-medium text-sm">
              Return to Login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
