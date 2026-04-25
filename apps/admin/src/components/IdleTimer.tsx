import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Timer, MousePointer2 } from 'lucide-react';
import { useAuth } from './AuthProvider';

const IDLE_TIME = 5 * 60 * 1000; // 5 minutes
const WARNING_THRESHOLD = 30 * 1000; // 30 seconds

export function IdleTimer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, isAuthenticated } = useAuth();
  const [timeLeft, setTimeLeft] = useState(IDLE_TIME);
  const lastActivityRef = useRef(Date.now());

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (timeLeft !== IDLE_TIME) {
        setTimeLeft(IDLE_TIME);
    }
  }, [timeLeft]);

  useEffect(() => {
    // Only run if authenticated and not on login page
    if (!isAuthenticated || location.pathname === '/login') return;

    const handleActivity = () => resetTimer();
    
    // Activity listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - lastActivityRef.current;
      const remaining = Math.max(0, IDLE_TIME - diff);
      
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        signOut();
        navigate('/login');
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      clearInterval(interval);
    };
  }, [isAuthenticated, location.pathname, navigate, resetTimer, signOut]);

  // UI logic
  const isWarning = timeLeft <= WARNING_THRESHOLD;
  const seconds = Math.ceil(timeLeft / 1000);

  return (
    <AnimatePresence>
      {isAuthenticated && isWarning && timeLeft > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-[100] group"
        >
          <div className="relative">
            {/* Pulsing ring */}
            <div className="absolute inset-0 bg-red-500/20 rounded-2xl animate-ping" />
            
            <div className="relative bg-[#031c34]/95 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-5 min-w-[280px]">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center relative overflow-hidden">
                <Timer className="w-6 h-6 text-red-500 relative z-10" />
                <motion.div 
                   className="absolute bottom-0 left-0 w-full bg-red-500/30"
                   initial={{ height: "100%" }}
                   animate={{ height: "0%" }}
                   transition={{ duration: 30, ease: "linear" }}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">Security Alert</span>
                  <span className="text-[10px] font-mono text-white/40">{seconds}s</span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">Session Expiring</h4>
                <p className="text-[11px] text-white/50 leading-tight">
                  Move your mouse to stay logged in
                </p>
              </div>

              <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                <MousePointer2 className="w-4 h-4 text-white animate-bounce" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
