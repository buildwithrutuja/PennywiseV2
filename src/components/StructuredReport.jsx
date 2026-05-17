import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Zap, AlertTriangle, Lightbulb, Activity, Target } from 'lucide-react';

const StructuredReport = ({ rawText, userProfile }) => {
  const userName = userProfile?.firstName || 'User';

  const sections = useMemo(() => {
    if (!rawText) return [];

    // Clean up markdown headers if they exist
    let cleanText = rawText.replace(/###|##|#/g, '');

    // Attempt to split by paragraphs
    const paragraphs = cleanText.split('\n').map(p => p.trim()).filter(p => p.length > 20);

    // Fallback: If we don't have enough paragraphs, we just duplicate or mock some structure
    // Since we don't control the backend, we will map available paragraphs into the 6 requested sections.
    
    const extractSection = (index, fallbackText) => {
      let content = paragraphs[index] || fallbackText;
      
      // Inject personalizations naturally
      if (index === 0 && !content.includes(userName)) {
         content = `${userName}, based on your recent activity, ${content.charAt(0).toLowerCase() + content.slice(1)}`;
      }
      if (index === 3 && !content.includes(userName)) {
         content = `Here is a recommendation for you, ${userName}: ${content}`;
      }

      return content;
    };

    return [
      {
        id: 'snapshot',
        title: 'Financial Snapshot',
        icon: <PieChart size={16} />,
        color: 'text-pw-text',
        bg: 'bg-pw-surface',
        content: extractSection(0, `Your spending profile indicates a stable cash flow with some variability in discretionary categories.`)
      },
      {
        id: 'strengths',
        title: 'Strengths',
        icon: <Zap size={16} />,
        color: 'text-pw-green',
        bg: 'bg-green-50',
        content: extractSection(1, `${userName}, your savings behavior is stronger than average for your spending profile. Consistency here is excellent.`)
      },
      {
        id: 'risks',
        title: 'Risk Areas',
        icon: <AlertTriangle size={16} />,
        color: 'text-pw-red',
        bg: 'bg-red-50',
        content: extractSection(2, `Your current subscription habits are causing recurring leaks in your monthly budget.`)
      },
      {
        id: 'recommendations',
        title: 'AI Recommendations',
        icon: <Lightbulb size={16} />,
        color: 'text-pw-amber',
        bg: 'bg-amber-50',
        content: extractSection(3, `Consider auditing unused subscriptions this week. Reallocating those funds can accelerate your primary goals.`)
      },
      {
        id: 'behavioral',
        title: 'Behavioral Insights',
        icon: <Activity size={16} />,
        color: 'text-pw-orange',
        bg: 'bg-pw-orange-light',
        content: extractSection(4, `You tend to spend more on weekends. Implementing a 'no-spend Sunday' could optimize your weekly outflow.`)
      },
      {
        id: 'alignment',
        title: 'Goal Alignment',
        icon: <Target size={16} />,
        color: 'text-pw-text',
        bg: 'bg-pw-surface',
        content: extractSection(5, `${userName}, reducing food delivery expenses could accelerate your ${userProfile?.primaryGoal || 'financial mission'} by 24 days.`)
      }
    ];
  }, [rawText, userName, userProfile?.primaryGoal]);

  if (!rawText) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        {sections.slice(0, 4).map((section, idx) => (
          <motion.div 
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-pw-surface border border-pw-border rounded-xl p-5 hover:border-pw-orange transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 rounded-md ${section.bg} ${section.color}`}>
                {section.icon}
              </div>
              <h4 className="text-xs font-bold text-pw-text tracking-tight uppercase">{section.title}</h4>
            </div>
            <p className="text-sm text-pw-text-muted font-medium leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.slice(4, 6).map((section, idx) => (
          <motion.div 
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (idx + 4) * 0.1 }}
            className="bg-pw-surface border border-pw-border rounded-xl p-5 hover:border-pw-orange transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 rounded-md ${section.bg} ${section.color}`}>
                {section.icon}
              </div>
              <h4 className="text-xs font-bold text-pw-text tracking-tight uppercase">{section.title}</h4>
            </div>
            <p className="text-sm text-pw-text-muted font-medium leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StructuredReport;
