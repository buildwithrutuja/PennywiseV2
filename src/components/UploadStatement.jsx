import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Lock, Cpu, CheckCircle } from 'lucide-react';
import { AIContext } from '../context/AIContext';
import mascotLogo from '../assets/logo_mascot.png';

const ProcessingStep = ({ icon: Icon, title, active, completed, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`flex items-center gap-4 p-4 rounded-xl border ${completed ? 'border-pw-green bg-pw-green/10' : active ? 'border-pw-primary bg-pw-primary/10 shadow-sm' : 'border-pw-border bg-pw-surface opacity-50'} transition-all duration-300`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${completed ? 'bg-pw-green text-white' : active ? 'bg-pw-primary text-white' : 'bg-pw-surface text-pw-text-hint border border-pw-border'}`}>
        {completed ? <CheckCircle size={20} /> : <Icon size={20} />}
      </div>
      <div className="flex-1">
        <h4 className={`text-sm font-bold ${completed ? 'text-pw-green' : active ? 'text-pw-primary' : 'text-pw-text-muted'}`}>{title}</h4>
        {active && !completed && (
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: "100%" }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-1 bg-pw-primary mt-2 rounded-full"
          />
        )}
      </div>
    </motion.div>
  );
};

const UploadStatement = () => {
  const { uploadPDF, uploadState, pipelineStep, uploadedStatement } = useContext(AIContext);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        uploadPDF(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        uploadPDF(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        
        <AnimatePresence mode="wait">
          {uploadState === "idle" && (
            <motion.div 
              key="upload-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300 bg-pw-card pw-shadow
                ${dragActive ? 'border-pw-primary bg-pw-primary/5 shadow-md' : 'border-pw-border hover:border-pw-primary hover:shadow-sm'}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mb-6">
                <img src={mascotLogo} alt="Upload" className={`h-24 w-auto object-contain transition-all duration-300 ${dragActive ? 'scale-110' : 'opacity-80'}`} />
              </div>
              <h2 className="text-xl font-bold text-pw-text mb-2 tracking-tight">Upload Bank Statement</h2>
              <p className="text-sm text-pw-text-muted mb-8 max-w-sm font-medium">Drag and drop your PDF statement here, or click to browse. Data is processed locally before secure AI transmission.</p>
              
              <label className="cursor-pointer bg-pw-primary text-white px-8 py-3.5 rounded-xl font-medium hover:bg-pw-primary-muted transition-colors duration-300 shadow-md">
                Browse Files
                <input type="file" className="hidden" accept=".pdf" onChange={handleChange} />
              </label>
              <p className="text-[10px] font-bold text-pw-text-hint mt-6 tracking-widest uppercase">PDF ONLY • SECURE UPLOAD</p>
            </motion.div>
          )}

          {(uploadState === "processing" || uploadState === "complete") && (
            <motion.div 
              key="processing-pipeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pw-card rounded-2xl border border-pw-border p-8 pw-shadow"
            >
              <h2 className="text-lg font-bold text-pw-text mb-2 text-center tracking-tight">AI Processing Pipeline</h2>
              <p className="text-sm text-pw-text-muted mb-8 text-center font-medium">Analyzing {uploadedStatement?.name}...</p>
              
              <div className="space-y-4">
                <ProcessingStep 
                  icon={UploadCloud} 
                  title="Uploading Statement" 
                  active={pipelineStep >= 1} 
                  completed={pipelineStep > 1} 
                  delay={0} 
                />
                <ProcessingStep 
                  icon={FileText} 
                  title="Parsing PDF Document" 
                  active={pipelineStep >= 2} 
                  completed={pipelineStep > 2} 
                  delay={0.1} 
                />
                <ProcessingStep 
                  icon={Lock} 
                  title="Masking Sensitive Data" 
                  active={pipelineStep >= 3} 
                  completed={pipelineStep > 3} 
                  delay={0.2} 
                />
                <ProcessingStep 
                  icon={Cpu} 
                  title="AI Analysis Generation" 
                  active={pipelineStep >= 4} 
                  completed={pipelineStep > 4} 
                  delay={0.3} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default UploadStatement;
