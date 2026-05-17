import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Rocket, Plus, Crosshair, Calendar, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import mascotLogo from '../assets/logo_mascot.png';

const DreamEngine = () => {
  const { currentUser } = useAuth();
  const [dreams, setDreams] = useState(currentUser?.dreams || []);
  const [isAdding, setIsAdding] = useState(false);
  const [newDream, setNewDream] = useState({ name: '', price: '', deadline: '', priority: 'Medium' });

  const handleAddDream = (e) => {
    e.preventDefault();
    if (newDream.name && newDream.price) {
      setDreams([...dreams, {
        id: `d_${Date.now()}`,
        name: newDream.name,
        price: Number(newDream.price),
        saved: 0,
        deadline: newDream.deadline || '2025-01-01',
        priority: newDream.priority
      }]);
      setIsAdding(false);
      setNewDream({ name: '', price: '', deadline: '', priority: 'Medium' });
    }
  };

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold font-sans flex items-center gap-2 text-pw-text">
            <Target className="w-6 h-6 text-pw-primary" /> Dream Engine
          </h2>
          <p className="text-pw-text-muted text-sm mt-1">Accelerate your savings to achieve your goals.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-pw-primary hover:bg-pw-primary-muted text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm pw-shadow"
        >
          {isAdding ? <Crosshair className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'New Dream'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-pw-card p-6 rounded-2xl border border-pw-primary/30 pw-shadow glow-primary">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-pw-primary" /> Initialize New Dream
              </h3>
              <form onSubmit={handleAddDream} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-pw-text-muted uppercase mb-1">Item Name</label>
                  <input type="text" value={newDream.name} onChange={(e)=>setNewDream({...newDream, name: e.target.value})} className="w-full bg-pw-surface border border-pw-border rounded-lg py-2 px-3 text-sm focus:border-pw-primary focus:outline-none" required placeholder="MacBook Pro" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-pw-text-muted uppercase mb-1">Target Price (₹)</label>
                  <input type="number" value={newDream.price} onChange={(e)=>setNewDream({...newDream, price: e.target.value})} className="w-full bg-pw-surface border border-pw-border rounded-lg py-2 px-3 text-sm focus:border-pw-primary focus:outline-none" required placeholder="120000" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-pw-text-muted uppercase mb-1">Deadline</label>
                  <input type="date" value={newDream.deadline} onChange={(e)=>setNewDream({...newDream, deadline: e.target.value})} className="w-full bg-pw-surface border border-pw-border rounded-lg py-2 px-3 text-sm focus:border-pw-primary focus:outline-none" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-pw-text-muted uppercase mb-1">Priority</label>
                  <select value={newDream.priority} onChange={(e)=>setNewDream({...newDream, priority: e.target.value})} className="w-full bg-pw-surface border border-pw-border rounded-lg py-2 px-3 text-sm focus:border-pw-primary focus:outline-none">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div className="md:col-span-4 flex justify-end mt-2">
                  <button type="submit" className="bg-pw-primary text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-pw-primary-muted transition-colors">
                    Lock Target
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-2 no-scrollbar">
        {dreams.length === 0 && !isAdding ? (
          <div className="col-span-2 flex flex-col items-center justify-center p-12 text-center bg-pw-card rounded-2xl border border-pw-border pw-shadow">
            <img src={mascotLogo} alt="No Dreams" className="h-20 opacity-50 mb-4" />
            <h3 className="text-xl font-bold text-pw-text">No active dreams detected.</h3>
            <p className="text-pw-text-muted mt-2">Initialize a new dream to let PennyWise calculate your optimal savings path.</p>
          </div>
        ) : (
          dreams.map((dream, idx) => {
            const progress = Math.min((dream.saved / dream.price) * 100, 100);
            return (
              <motion.div 
                key={dream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-pw-card rounded-2xl border border-pw-border p-6 pw-shadow relative overflow-hidden group"
              >
                {/* Priority Indicator */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl ${dream.priority === 'High' ? 'bg-pw-red/10 text-pw-red' : dream.priority === 'Medium' ? 'bg-pw-amber/10 text-pw-amber' : 'bg-pw-green/10 text-pw-green'}`}>
                  {dream.priority} Priority
                </div>

                <h3 className="text-xl font-bold mb-1 mt-2">{dream.name}</h3>
                <div className="flex items-center gap-4 text-sm text-pw-text-muted mb-6">
                  <span className="flex items-center gap-1"><Target className="w-4 h-4 text-pw-primary" /> ₹{dream.price.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-pw-primary" /> {dream.deadline}</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-widest text-pw-text-muted">
                  <span>Progress</span>
                  <span className="text-pw-primary">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-pw-surface rounded-full overflow-hidden mb-6">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-pw-primary"
                  />
                </div>

                {/* AI Coaching */}
                <div className="p-4 rounded-xl bg-pw-primary/5 border border-pw-primary/20">
                  <h4 className="text-xs font-bold text-pw-primary flex items-center gap-1 mb-1">
                    <Zap className="w-3 h-3" /> AI Acceleration Plan
                  </h4>
                  <p className="text-sm leading-relaxed">
                    Based on your current burn rate, save <strong className="text-pw-text">₹{(dream.price / 6).toFixed(0)}</strong> per month to reach this goal by the deadline. 
                    Consider cutting down <strong>Food & Dining</strong> by 15% to accelerate this!
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default DreamEngine;
