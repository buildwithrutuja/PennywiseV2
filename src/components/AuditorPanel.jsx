import React, { useContext, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Cpu, Lock, Wifi } from 'lucide-react';
import { AIContext } from '../context/AIContext';

// Live animated diagnostic bar
const DiagBar = ({ label, value, color = 'var(--color-pw-primary)', delay = 0 }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-[9px] font-bold text-pw-text-hint uppercase tracking-widest">{label}</span>
      <span className="text-[9px] font-bold text-pw-text-muted">{value}%</span>
    </div>
    <div className="w-full h-1 bg-pw-border rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  </div>
);

// Animated bar chart (activity sparkline)
const Sparkline = () => (
  <div className="flex items-end h-10 gap-[3px]">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="flex-1 rounded-t-[1px]"
        style={{ backgroundColor: i % 4 === 0 ? 'var(--color-pw-primary)' : 'var(--color-pw-primary-light)' }}
        animate={{ height: ['30%', '70%', '45%', '90%', '25%', '60%'][i % 6] }}
        transition={{ repeat: Infinity, duration: 1.8 + i * 0.07, repeatType: 'mirror', ease: 'easeInOut' }}
      />
    ))}
  </div>
);

// Log entry color coding
const getLogStyle = (log) => {
  if (log.includes('[ERROR]'))    return { color: 'text-pw-red',    bold: true };
  if (log.includes('[AI]'))       return { color: 'text-pw-primary', bold: true };
  if (log.includes('[COMPLETE]')) return { color: 'text-pw-green',  bold: true };
  if (log.includes('[SECURE]'))   return { color: 'text-pw-green',  bold: false };
  if (log.includes('[SYSTEM]'))   return { color: 'text-pw-text',   bold: true };
  if (log.includes('[PARSE]'))    return { color: 'text-pw-text-muted', bold: false };
  if (log.includes('[UPLOAD]'))   return { color: 'text-pw-primary', bold: false };
  if (log.includes('[SYNC]'))     return { color: 'text-pw-text-muted', bold: false };
  if (log.includes('[ENGINE]'))   return { color: 'text-pw-amber',  bold: false };
  return { color: 'text-pw-text-muted', bold: false };
};

const STATUS_ITEMS = [
  { icon: Cpu,    label: 'AI Engine',     key: 'ai' },
  { icon: Lock,   label: 'Local Enclave', key: 'secure' },
  { icon: Wifi,   label: 'Data Sync',     key: 'sync' },
];

const AuditorPanel = () => {
  const { auditorLogs, uploadState } = useContext(AIContext);
  const endRef = useRef(null);

  // Auto-scroll as new logs arrive
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [auditorLogs]);

  return (
    <div className="w-[260px] bg-pw-surface border-l border-pw-border flex flex-col h-full shrink-0 transition-colors duration-300">

      {/* ── Header ── */}
      <div className="px-4 py-3.5 border-b border-pw-border bg-pw-card flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-pw-primary" />
          <span className="text-[11px] font-bold tracking-widest text-pw-text uppercase">Diagnostics</span>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-pw-green glow-primary"
            animate={{ opacity: [1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.4, repeatType: 'reverse' }}
          />
          <span className="text-[9px] font-bold text-pw-green uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* ── Engine Status Pills ── */}
      <div className="px-4 py-3 border-b border-pw-border bg-pw-card shrink-0">
        <p className="text-[9px] font-bold text-pw-text-hint uppercase tracking-widest mb-2.5">Engine Status</p>
        <div className="space-y-1.5">
          {STATUS_ITEMS.map(({ icon: Icon, label, key }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] text-pw-text-muted font-medium">
                <Icon size={10} className="text-pw-text-hint" />
                {label}
              </span>
              <span className="flex items-center gap-1 text-[9px] font-bold text-pw-green">
                <span className="w-1 h-1 rounded-full bg-pw-green glow-primary" />
                Online
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Live Logs ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 font-pw-mono text-[10px] leading-relaxed">
        <p className="text-[9px] font-bold text-pw-text-hint uppercase tracking-widest mb-2.5">Activity Log</p>
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {auditorLogs.map((log, i) => {
              const { color, bold } = getLogStyle(log);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`${color} ${bold ? 'font-semibold' : 'font-normal'} leading-snug break-words`}
                >
                  {log}
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
      </div>

      {/* ── Diagnostics Section ── */}
      <div className="border-t border-pw-border px-4 py-4 bg-pw-card shrink-0 space-y-3.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Activity size={11} className="text-pw-text-hint" />
          <span className="text-[9px] font-bold text-pw-text-hint uppercase tracking-widest">System Load</span>
        </div>

        {/* Sparkline chart */}
        <Sparkline />

        {/* Labeled bars */}
        <div className="space-y-2.5 pt-1">
          <DiagBar label="AI Processing" value={uploadState === 'processing' ? 88 : 12} color="var(--color-pw-primary)" delay={0} />
          <DiagBar label="Memory Usage"  value={34} color="var(--color-pw-green)" delay={0.1} />
          <DiagBar label="Enclave Load"  value={uploadState === 'processing' ? 64 : 8} color="var(--color-pw-amber)" delay={0.2} />
        </div>
      </div>

    </div>
  );
};

export default AuditorPanel;
