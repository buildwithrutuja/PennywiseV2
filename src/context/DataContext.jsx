import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { mockTransactions, getCategoryBreakdown } from '../data/mockTransactions';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);

  useEffect(() => {
    if (currentUser) {
      // Load user-specific transactions
      const txs = mockTransactions[currentUser.id] || [];
      setTransactions(txs);
      
      const breakdown = getCategoryBreakdown(currentUser.id);
      setCategoryBreakdown(breakdown);
    } else {
      setTransactions([]);
      setCategoryBreakdown([]);
    }
  }, [currentUser]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    // In a real app we'd update the breakdown too
  };

  const getFinancialHealthScore = () => {
    return currentUser?.financials?.financialHealthScore || 0;
  };

  const value = {
    transactions,
    categoryBreakdown,
    addTransaction,
    getFinancialHealthScore
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
