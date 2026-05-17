import React, { createContext, useState, useEffect } from 'react';

export const AIContext = createContext();

export const AIContextProvider = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState("Dashboard");

  // User Profile State
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("pw_userProfile");
    return saved ? JSON.parse(saved) : {
      firstName: "",
      monthlyIncome: "",
      studentType: "",
      primaryGoal: "",
      onboardingCompleted: false
    };
  });

  // Data States
  const [uploadedStatement, setUploadedStatement] = useState(null);
  const [aiInsights, setAiInsights] = useState("");
  const [auditorLogs, setAuditorLogs] = useState([]);
  
  // Intelligence States (Mocked Post-Upload)
  const [mockTransactions, setMockTransactions] = useState([]);
  const [mockAlerts, setMockAlerts] = useState([]);
  const [burnRate, setBurnRate] = useState(null);
  const [healthScore, setHealthScore] = useState(null);

  // Dream Engine States
  const [dreamGoal, setDreamGoal] = useState({
    item: "",
    price: "",
    savings: "",
    allowance: "",
    deadlineMonths: ""
  });

  // Processing States
  const [uploadState, setUploadState] = useState("idle"); // idle, processing, complete
  const [pipelineStep, setPipelineStep] = useState(0); // 0 to 4

  // Sync profile to localStorage and inject initial logs
  useEffect(() => {
    localStorage.setItem("pw_userProfile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (userProfile.onboardingCompleted && auditorLogs.length === 0) {
      const now = new Date().toLocaleTimeString('en-US', { hour12: false });
      setAuditorLogs([
        `${now} [SYSTEM] PennyWise Intelligence Engine Online`,
        `${now} [SECURE] Local financial sandbox active`,
        `${now} [AI] Behavioral analysis engine ready`,
        `${now} [SYNC] Dream Engine synchronized`,
        `${now} [UPLOAD] Awaiting financial statement`,
      ]);
    }
  }, [userProfile.onboardingCompleted, userProfile.firstName]);

  const addLog = (msg) => {
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    setAuditorLogs((prev) => [...prev, `${now} ${msg}`]);
  };

  const uploadPDF = async (file) => {
    if (!file) return;

    setUploadedStatement(file);
    setUploadState("processing");
    setAiInsights("");
    setPipelineStep(1); // Uploading statement
    addLog(`[UPLOAD] PDF received: ${file.name}`);

    // Simulated Pipeline Delays
    await new Promise(resolve => setTimeout(resolve, 800));
    setPipelineStep(2); // Parsing PDF
    addLog("[PARSE] Extracting transactions from document...");

    await new Promise(resolve => setTimeout(resolve, 1000));
    setPipelineStep(3); // Masking sensitive data
    addLog("[SECURE] Redacting sensitive account information...");

    await new Promise(resolve => setTimeout(resolve, 800));
    setPipelineStep(4); // AI analyzing
    addLog("[AI] Generating spending behavior analysis...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setAiInsights(data.analysis);
      
      // Generate intelligent mock data for realism
      setMockTransactions([
        { id: 1, date: "Oct 12", merchant: "ZOMATO", category: "Food & Dining", amount: 480, color: "var(--color-pw-orange)" },
        { id: 2, date: "Oct 11", merchant: "UBER", category: "Transport", amount: 320, color: "var(--color-pw-amber)" },
        { id: 3, date: "Oct 10", merchant: "NETFLIX", category: "Subscriptions", amount: 649, color: "var(--color-pw-green)" },
        { id: 4, date: "Oct 08", merchant: "SWIGGY", category: "Food & Dining", amount: 550, color: "var(--color-pw-orange)" },
        { id: 5, date: "Oct 05", merchant: "AMAZON", category: "Shopping", amount: 2499, color: "var(--color-pw-orange-muted)" },
        { id: 6, date: "Oct 02", merchant: "SPOTIFY", category: "Subscriptions", amount: 119, color: "var(--color-pw-green)" },
      ]);
      setMockAlerts([
        { type: "warning", message: "Food delivery spending increased 18% this month." },
        { type: "danger", message: "Subscription burden exceeds healthy threshold." },
        { type: "success", message: "Savings discipline improved compared to last month." }
      ]);
      setBurnRate(14200);
      setHealthScore(68);

      addLog("[ENGINE] Goal-alignment simulation active");
      addLog("[COMPLETE] Financial intelligence report generated.");
      setPipelineStep(5);
      
      setTimeout(() => {
        setUploadState("complete");
        setActiveTab("Dashboard");
      }, 1500);

    } catch (error) {
      addLog(`[ERROR] Connection failed: ${error.message}`);
      setAiInsights("[ERROR] Secure connection to AI enclave failed. Please verify the local backend is running.\n\n" + error.message);
      setUploadState("idle");
      setPipelineStep(0);
    }
  };

  return (
    <AIContext.Provider value={{
      activeTab, setActiveTab,
      userProfile, setUserProfile,
      uploadedStatement, setUploadedStatement,
      aiInsights, setAiInsights,
      auditorLogs, addLog,
      dreamGoal, setDreamGoal,
      uploadState, setUploadState,
      pipelineStep,
      mockTransactions, mockAlerts, burnRate, healthScore,
      uploadPDF
    }}>
      {children}
    </AIContext.Provider>
  );
};
