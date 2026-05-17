import { useContext, useMemo } from 'react';
import { AIContext } from '../context/AIContext';

export const useDreamEngine = () => {
  const { dreamGoal, setDreamGoal } = useContext(AIContext);

  const price = Number(dreamGoal.price) || 0;
  const savings = Number(dreamGoal.savings) || 0;
  const allowance = Number(dreamGoal.allowance) || 0;
  const deadlineMonths = Number(dreamGoal.deadlineMonths) || 0;

  const isGoalActive = dreamGoal.item.trim() !== "" && price > 0 && allowance > 0 && deadlineMonths > 0;

  const { requiredMonthly, feasibilityScore, deficit, monthsNeeded, status } = useMemo(() => {
    if (!isGoalActive) {
      return { requiredMonthly: 0, feasibilityScore: 0, deficit: 0, monthsNeeded: 0, status: 'UNKNOWN' };
    }

    const reqMonthly = (price - savings) / Math.max(1, deadlineMonths);
    const needed = (price - savings) / allowance;
    
    // Feasibility calculation as requested:
    // Math.min(100, Math.round((deadline / monthsNeeded) * 100))
    const score = Math.min(100, Math.round((deadlineMonths / Math.max(1, needed)) * 100));
    
    let verdict = 'STRETCH GOAL';
    if (score >= 80) verdict = 'ACHIEVABLE';
    else if (score >= 50) verdict = 'CHALLENGING';

    return {
      requiredMonthly: reqMonthly,
      feasibilityScore: score,
      deficit: reqMonthly > allowance ? reqMonthly - allowance : 0,
      monthsNeeded: needed,
      status: verdict
    };
  }, [price, savings, allowance, deadlineMonths, isGoalActive]);

  const applySimulation = (amount) => {
    setDreamGoal(prev => ({
      ...prev,
      allowance: (Number(prev.allowance) || 0) + amount
    }));
  };

  const updateGoal = (e) => {
    const { name, value } = e.target;
    setDreamGoal(prev => ({ 
      ...prev, 
      [name]: value === '' ? '' : isNaN(value) ? value : Number(value) 
    }));
  };

  return {
    dreamGoal,
    updateGoal,
    isGoalActive,
    price,
    savings,
    allowance,
    deadlineMonths,
    requiredMonthly,
    feasibilityScore,
    deficit,
    monthsNeeded,
    status,
    applySimulation
  };
};
