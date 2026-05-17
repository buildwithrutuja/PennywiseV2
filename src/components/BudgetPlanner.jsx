import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Calculator, Target, Plus, IndianRupee, PieChart as PieChartIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BudgetPlanner() {
  const { currentUser } = useAuth();
  const allowance = currentUser?.financials?.monthlyAllowance || 0;
  
  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Food & Dining', amount: allowance * 0.3, color: '#17A2B8' },
    { id: 2, category: 'Transport', amount: allowance * 0.15, color: '#F59E0B' },
    { id: 3, category: 'Subscriptions', amount: allowance * 0.1, color: '#8B5CF6' },
    { id: 4, category: 'Savings Target', amount: allowance * 0.25, color: '#10B981' },
    { id: 5, category: 'Entertainment', amount: allowance * 0.2, color: '#EF4444' },
  ]);

  const totalAllocated = budgets.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = allowance - totalAllocated;

  const handleAmountChange = (id, newAmount) => {
    setBudgets(budgets.map(b => b.id === id ? { ...b, amount: Number(newAmount) } : b));
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-sans flex items-center gap-2">
          <Calculator className="w-6 h-6 text-pw-primary" />
          Budget Planner
        </h2>
        <p className="text-pw-text-muted text-sm mt-1">Allocate your ₹{allowance.toLocaleString()} monthly allowance effectively.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Col: Setup & Limits */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2 no-scrollbar">
          
          {/* Top Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-pw-card rounded-2xl p-5 border border-pw-border pw-shadow">
              <p className="text-xs text-pw-text-muted font-medium mb-1">Total Income</p>
              <h3 className="text-xl font-bold text-pw-text">₹{allowance.toLocaleString()}</h3>
            </div>
            <div className="bg-pw-card rounded-2xl p-5 border border-pw-border pw-shadow">
              <p className="text-xs text-pw-text-muted font-medium mb-1">Total Allocated</p>
              <h3 className="text-xl font-bold text-pw-primary">₹{totalAllocated.toLocaleString()}</h3>
            </div>
            <div className={`bg-pw-card rounded-2xl p-5 border pw-shadow transition-colors ${remaining < 0 ? 'border-pw-red/50 bg-pw-red/5' : 'border-pw-border'}`}>
              <p className="text-xs text-pw-text-muted font-medium mb-1">Unallocated</p>
              <h3 className={`text-xl font-bold ${remaining < 0 ? 'text-pw-red' : 'text-pw-green'}`}>
                ₹{remaining.toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Budget Categories */}
          <div className="bg-pw-card rounded-2xl p-6 border border-pw-border pw-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Allocations</h3>
              <button className="flex items-center gap-1 text-xs text-pw-primary font-medium px-3 py-1.5 bg-pw-primary/10 rounded-lg hover:bg-pw-primary/20 transition-colors">
                <Plus className="w-3 h-3" /> Add Category
              </button>
            </div>

            <div className="space-y-4">
              {budgets.map(budget => (
                <div key={budget.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-pw-surface transition-colors border border-transparent hover:border-pw-border">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: budget.color }} />
                  <span className="w-1/3 text-sm font-medium">{budget.category}</span>
                  <div className="flex-1 flex items-center gap-2 relative">
                    <IndianRupee className="absolute left-3 w-3 h-3 text-pw-text-hint" />
                    <input 
                      type="number" 
                      value={budget.amount}
                      onChange={(e) => handleAmountChange(budget.id, e.target.value)}
                      className="w-full bg-pw-surface border border-pw-border rounded-lg py-2 pl-8 pr-3 text-sm focus:outline-none focus:border-pw-primary"
                    />
                  </div>
                  <span className="text-xs text-pw-text-muted w-12 text-right">
                    {Math.round((budget.amount / allowance) * 100 || 0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Visualization */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-pw-card rounded-2xl p-6 border border-pw-border pw-shadow flex flex-col h-full min-h-[400px]">
            <h3 className="font-bold flex items-center gap-2 mb-6">
              <PieChartIcon className="w-5 h-5 text-pw-primary" />
              Distribution
            </h3>
            
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgets.filter(b => b.amount > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {budgets.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => `₹${value}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Smart AI Insight */}
            <div className="mt-4 p-4 rounded-xl bg-pw-primary/10 border border-pw-primary/20">
              <h4 className="text-sm font-bold text-pw-primary flex items-center gap-2 mb-2">
                <Target className="w-4 h-4" /> AI Suggestion
              </h4>
              <p className="text-xs text-pw-text leading-relaxed">
                You are allocating {Math.round((budgets.find(b=>b.category==='Food & Dining')?.amount / allowance) * 100 || 0)}% to Food. 
                Consider reducing this to 20% to hit your savings goal faster!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
