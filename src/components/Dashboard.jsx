import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Coins, PieChart, Flame, Settings, Download, Bell, CreditCard } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AIContext } from '../context/AIContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StructuredReport from './StructuredReport';
import Logo from './Logo';

const StatCard = ({ title, value, icon, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="bg-pw-card border border-pw-border rounded-xl p-5 relative overflow-hidden group hover:pw-shadow transition-all duration-300"
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:text-pw-primary transition-all duration-300 transform group-hover:scale-110">
      {icon}
    </div>
    <h4 className="text-[10px] font-bold tracking-widest text-pw-text-muted mb-3 uppercase">{title}</h4>
    <div className="text-2xl font-bold text-pw-text">{value}</div>
    <div className="absolute bottom-0 left-0 h-1 bg-pw-primary w-0 group-hover:w-full transition-all duration-500"></div>
  </motion.div>
);

const Dashboard = () => {
  const { setActiveTab } = useContext(AIContext);
  const { currentUser } = useAuth();
  const { transactions, categoryBreakdown } = useData();

  const totalSpent = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const burnRate = currentUser?.financials?.monthlyAllowance ? totalSpent : 0;
  const subscriptions = categoryBreakdown.find(c => c.name === 'Subscriptions')?.value || 0;
  const food = categoryBreakdown.find(c => c.name === 'Food')?.value || 0;

  const COLORS = ['#17A2B8', '#F59E0B', '#10B981', '#85D4E0', '#EF4444', '#8B5CF6'];

  const mockAlerts = [
    { type: 'warning', message: 'You have spent 60% of your budget in the first 10 days.' },
    { type: 'success', message: 'Great job! You saved ₹500 on subscriptions this month.' }
  ];

  const hasData = transactions.length > 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard index={0} title="TOTAL SPENT" value={hasData ? `₹${totalSpent.toLocaleString()}` : "—"} icon={<Coins size={24} />} />
        <StatCard index={1} title="MONTHLY BURN RATE" value={hasData ? `₹${burnRate.toLocaleString()}` : "—"} icon={<Flame size={24} />} />
        <StatCard index={2} title="SUBSCRIPTIONS" value={hasData ? `₹${subscriptions.toLocaleString()}` : "—"} icon={<Settings size={24} />} />
        <StatCard index={3} title="FOOD & DINING" value={hasData ? `₹${food.toLocaleString()}` : "—"} icon={<PieChart size={24} />} />
      </div>

      {hasData ? (
        <div className="grid grid-cols-3 gap-6">
          {/* Chart & Alerts Area */}
          <div className="col-span-1 space-y-6">
            <div className="bg-pw-card border border-pw-border rounded-xl p-6 pw-shadow">
               <h3 className="text-xs font-bold text-pw-text-muted uppercase tracking-widest mb-6">Spending Distribution</h3>
               <div className="h-[220px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <RechartsPieChart>
                     <Pie
                       data={categoryBreakdown}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {categoryBreakdown.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                       formatter={(value) => `₹${value}`}
                       contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-pw-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                     />
                   </RechartsPieChart>
                 </ResponsiveContainer>
               </div>
               <div className="space-y-3 mt-4">
                  {categoryBreakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        <span className="font-medium text-pw-text">{item.name}</span>
                      </div>
                      <span className="font-bold text-pw-text">₹{item.value.toLocaleString()}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Smart Alerts */}
            {mockAlerts && mockAlerts.length > 0 && (
              <div className="bg-pw-card border border-pw-border rounded-xl p-6 pw-shadow">
                <h3 className="text-xs font-bold text-pw-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Bell size={14} className="text-pw-primary" /> Smart Alerts
                </h3>
                <div className="space-y-3">
                  {mockAlerts.map((alert, idx) => {
                    const bgColor = alert.type === 'warning' ? 'bg-pw-amber/10' : alert.type === 'danger' ? 'bg-pw-red/10' : 'bg-pw-green/10';
                    const textColor = alert.type === 'warning' ? 'text-pw-amber' : alert.type === 'danger' ? 'text-pw-red' : 'text-pw-green';
                    const icon = alert.type === 'success' ? '✓' : '⚠';
                    return (
                      <div key={idx} className={`p-3 rounded-lg border border-pw-border ${bgColor} flex gap-3 items-start`}>
                        <span className={`font-bold ${textColor}`}>{icon}</span>
                        <p className={`text-sm font-medium ${textColor} leading-tight`}>{alert.message}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="col-span-2 flex flex-col gap-6">
              {/* Transactions List */}
              <div className="bg-pw-card border border-pw-border rounded-xl p-6 pw-shadow">
                 <h3 className="text-sm font-bold flex items-center gap-2 text-pw-text tracking-tight mb-4">
                   <CreditCard size={16} className="text-pw-primary"/> RECENT TRANSACTIONS
                 </h3>
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                     <thead className="text-[10px] text-pw-text-muted uppercase tracking-widest border-b border-pw-border">
                       <tr>
                         <th className="px-2 py-3 font-bold">Date</th>
                         <th className="px-2 py-3 font-bold">Description</th>
                         <th className="px-2 py-3 font-bold">Category</th>
                         <th className="px-2 py-3 font-bold text-right">Amount</th>
                       </tr>
                     </thead>
                     <tbody>
                       {transactions?.slice(0, 5).map((tx) => (
                         <tr key={tx.id} className="border-b border-pw-border hover:bg-pw-surface transition-colors">
                           <td className="px-2 py-3 font-medium text-pw-text-muted">{tx.date}</td>
                           <td className="px-2 py-3 font-bold text-pw-text">{tx.description}</td>
                           <td className="px-2 py-3">
                             <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-pw-primary/10 text-pw-primary">
                               {tx.category}
                             </span>
                           </td>
                           <td className={`px-2 py-3 font-bold text-right ${tx.type === 'expense' ? 'text-pw-text' : 'text-pw-green'}`}>
                             {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>

              {/* Mock AI Analysis Output */}
              <div className="bg-pw-card border border-pw-border rounded-xl p-6 pw-shadow flex flex-col gap-4">
                <div className="flex items-center justify-between px-1 border-b border-pw-border pb-4">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-pw-text tracking-tight">
                    <Logo variant="mascot" height="h-4" className="inline-block mr-1" /> AI INTELLIGENCE REPORT
                  </h3>
                  <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-pw-primary hover:text-pw-primary-muted transition-colors">
                    <Download size={14} /> Export Report
                  </button>
                </div>
                
                <div className="text-sm text-pw-text space-y-3">
                  <p><strong>Persona Analysis:</strong> Based on your recent transactions, you exhibit a {currentUser.persona} profile.</p>
                  <p><strong>Overspending Detected:</strong> You have spent a significant portion of your budget on {categoryBreakdown.length > 0 ? categoryBreakdown[0].name : "various items"}. Consider cutting back to hit your savings goals.</p>
                  <p><strong>Coach Tip:</strong> Stay focused! You are on track to save ₹{currentUser.financials?.currentSavings || 0} this month.</p>
                </div>
              </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-pw-surface border border-pw-border rounded-2xl p-10 flex flex-col items-center text-center pw-shadow"
          >
              <Logo variant="mascot" height="h-16" className="opacity-80 mb-6" />
            <h2 className="text-xl font-bold text-pw-text mb-2 tracking-tight">No Transactions Found</h2>
            <p className="text-sm text-pw-text-muted mb-8 font-medium">Upload your bank statement or use a Demo Account to see your insights.</p>
            
            <button 
              onClick={() => setActiveTab("Upload Statement")}
              className="w-full py-3 bg-pw-primary border border-pw-border text-white rounded-xl font-bold shadow-sm hover:bg-pw-primary-muted transition-colors duration-300"
            >
              Upload Statement
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
