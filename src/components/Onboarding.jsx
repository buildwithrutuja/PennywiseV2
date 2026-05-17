import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { AIContext } from '../context/AIContext';
import { useAuth } from '../context/AuthContext';
import fullLogo from '../assets/logo_full.png';

const Onboarding = () => {
  const { setUserProfile } = useContext(AIContext);
  const { currentUser } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    primaryGoal: ""
  });
  const [isFinishing, setIsFinishing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    finishOnboarding();
  };

  const finishOnboarding = () => {
    setIsFinishing(true);
    setTimeout(() => {
      setUserProfile({
        ...formData,
        onboardingCompleted: true
      });
    }, 2500); // 2.5s cinematic fade
  };

  if (isFinishing) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="w-screen h-screen flex flex-col items-center justify-center bg-pw-surface text-pw-text"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-8"
        >
          <img src={fullLogo} alt="PennyWise Logo" className="h-20 w-auto object-contain" />
        </motion.div>
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-3xl font-bold tracking-tight mb-2"
        >
          Welcome to PennyWise, {currentUser?.name?.split(' ')[0]}.
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-pw-text-muted font-medium text-sm flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-pw-green animate-pulse glow-primary"></span>
          Financial operating system initialized.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="w-screen h-screen flex bg-pw-surface text-pw-text relative overflow-hidden transition-colors duration-300">
      {/* Decorative background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pw-primary opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex-1 flex flex-col justify-center items-center p-8 z-10">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <img src={fullLogo} alt="PennyWise" className="h-14 w-auto object-contain" />
            </motion.div>
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-pw-text-muted mb-2">System Initialization</h2>
            <div className="flex gap-2">
              <div className="h-1.5 rounded-full transition-all duration-300 w-8 bg-pw-primary" />
            </div>
          </div>

          <div className="bg-pw-card rounded-2xl border border-pw-border p-8 pw-shadow min-h-[300px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Initialize your mission.</h1>
                    <p className="text-sm text-pw-text-muted font-medium">What is your primary financial goal right now?</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-pw-text-muted tracking-widest uppercase mb-1.5">Primary Goal</label>
                    <input 
                      type="text" 
                      name="primaryGoal" 
                      autoFocus
                      value={formData.primaryGoal} 
                      onChange={handleChange} 
                      placeholder="e.g. Save for a new laptop" 
                      className="w-full bg-pw-surface border border-pw-border rounded-lg px-4 py-3 text-pw-text text-base font-medium focus:border-pw-primary focus:ring-1 focus:ring-pw-primary focus:outline-none transition-all placeholder-pw-text-hint" 
                      onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    />
                  </div>
                </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleNext}
                className="flex items-center gap-2 bg-pw-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-pw-primary-muted transition-colors duration-300 pw-shadow"
              >
                Initialize OS <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
