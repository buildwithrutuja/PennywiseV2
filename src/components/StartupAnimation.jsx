import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mascotImg from '../assets/pennywise_mascot.png';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const INIT_LINES = [
  "Initializing PennyWise OS...",
  "Calibrating Financial Intelligence...",
  "Loading Dream Engine...",
  "Secure Local Environment Ready...",
];

const TypewriterLine = ({ text, speed = 16 }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return <>{displayed}</>;
};

export default function StartupAnimation({ onComplete }) {
  const [step, setStep]               = useState(0);
  const [visibleLines, setVisibleLines] = useState([]);
  const [exiting, setExiting]         = useState(false);
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setExiting(true);
    setTimeout(onComplete, 650);
  }, [onComplete]);

  // Skip on click / keypress
  useEffect(() => {
    const handler = (e) => {
      if (e.type === 'click' || ['Space','Enter','Escape'].includes(e.code)) finish();
    };
    window.addEventListener('keydown', handler);
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('click', handler);
    };
  }, [finish]);

  // Master timeline
  useEffect(() => {
    const ts = [];
    const at = (fn, ms) => ts.push(setTimeout(fn, ms));

    at(() => setStep(1), 300);   // mascot appears
    at(() => setStep(2), 1100);  // coin flips
    at(() => setStep(3), 2000);  // text starts

    // Reveal each text line
    INIT_LINES.forEach((_, i) => at(() => {
      setVisibleLines(prev => [...prev, i]);
    }, 2000 + i * 650));

    // Auto-finish after last line + buffer
    at(finish, 2000 + INIT_LINES.length * 650 + 600);

    return () => ts.forEach(clearTimeout);
  }, [finish]);

  // Coin animation state
  const coinVisible = step >= 2;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="startup-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at 50% 55%, #0B1120 0%, #000000 70%)',
          }}
        >
          {/* ── Mascot ── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={step >= 1
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 30, scale: 0.92 }
            }
            transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
          >
            <img
              src={mascotImg}
              alt="PennyWise"
              draggable={false}
              style={{ height: 160, width: 'auto', objectFit: 'contain', display: 'block' }}
            />

            {/* ── Independent ₹ Coin overlay ── */}
            <motion.div
              initial={{ opacity: 0, y: 0, rotateY: 0, scale: 0.7 }}
              animate={
                coinVisible
                  ? {
                      opacity: [0, 1, 1, 1],
                      y:       [0, -80, -80, 0],
                      rotateY: [0, 180, 360, 720],
                      scale:   [0.7, 1.1, 1.1, 1.0],
                    }
                  : { opacity: 0 }
              }
              transition={
                coinVisible
                  ? {
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                      times: [0, 0.35, 0.65, 1],
                    }
                  : {}
              }
              style={{
                position: 'absolute',
                right: '-8px',
                top: '44%',
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, #85D4E0, #17A2B8 60%, #0077B6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transformStyle: 'preserve-3d',
                zIndex: 20,
                border: '1.5px solid rgba(23, 162, 184, 0.25)',
                boxShadow: '0 4px 16px rgba(23, 162, 184, 0.45)',
              }}
            >
              <span style={{
                color: 'rgba(255,255,255,0.95)',
                fontWeight: 700,
                fontSize: 14,
                fontFamily: 'system-ui, sans-serif',
                lineHeight: 1,
              }}>₹</span>
            </motion.div>
          </motion.div>

          {/* ── Init text ── */}
          <div style={{
            marginTop: 36,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 7,
            minHeight: 88,
          }}>
            <AnimatePresence>
              {step >= 3 && visibleLines.map((idx) => {
                const isActive = idx === visibleLines[visibleLines.length - 1];
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                    style={{
                      fontFamily: "'JetBrains Mono','Fira Code',monospace",
                      fontSize: 10,
                      letterSpacing: '0.13em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: isActive ? '#17A2B8' : 'rgba(255,255,255,0.28)',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    <TypewriterLine text={INIT_LINES[idx]} speed={isActive ? 15 : 0} />
                    {isActive && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.52 }}
                        style={{
                          display: 'inline-block',
                          width: 5,
                          height: 12,
                          backgroundColor: '#17A2B8',
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Skip hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{
              position: 'absolute',
              bottom: 24,
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 9,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            Click anywhere or press any key to skip
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
