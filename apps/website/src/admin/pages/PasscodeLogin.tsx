import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { Delete, AlertCircle } from "lucide-react";
import logo from "../images/logoblack.png";

export function PasscodeLogin() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleNumberClick = (num: string) => {
    if (passcode.length < 4) {
      const nextPasscode = passcode + num;
      setPasscode(nextPasscode);
      
      // Auto-trigger login when 4 digits are reached
      if (nextPasscode.length === 4) {
        // Use a small timeout for visual feedback (dots filling up)
        setTimeout(() => {
          const success = login(nextPasscode);
          if (success) {
            navigate("/admin", { replace: true });
          } else {
            setError(true);
            setPasscode("");
            // Reset error after a shake animation
            setTimeout(() => setError(false), 500);
          }
        }, 300); // 300ms is enough for a smooth feel
      }
    }
  };

  const handleDelete = () => {
    setPasscode(prev => prev.slice(0, -1));
  };

  // Keyboard support for numeric input and backspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumberClick(e.key);
      } else if (e.key === "Backspace") {
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [passcode]); // Depends on passcode to ensure handleNumberClick has current state if needed (though nextPasscode uses local var)

  const dots = [0, 1, 2, 3];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center font-sans overflow-hidden bg-black">
      {/* Background with Glassmorphism potential */}
      <div className="absolute inset-0 z-0 bg-[#0a192f]/40 backdrop-blur-3xl" />
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6 py-4">
        {/* Church Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-3 shadow-2xl mb-3">
            <img src={logo} alt="Church Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight">The Balance Church</h1>
          <p className="text-white/60 text-[11px] font-medium mt-1 uppercase tracking-widest">Admin Portal</p>
        </motion.div>

        {/* Passcode Title */}
        <motion.h2 
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className={`text-white text-lg font-medium mb-8 ${error ? "text-red-400" : ""}`}
        >
          {error ? "Passcode Incorrect" : "Enter Passcode"}
        </motion.h2>

        {/* Passcode Dots */}
        <div className="flex gap-4 mb-8">
          {dots.map((dot) => (
            <motion.div
              key={dot}
              initial={false}
              animate={{
                scale: passcode.length > dot ? 1.1 : 1,
                backgroundColor: passcode.length > dot ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.1)"
              }}
              className="w-4 h-4 rounded-full border border-white/20"
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-3 w-fit">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <KeypadButton key={num} label={num} onClick={() => handleNumberClick(num)} />
          ))}
          <div /> {/* Empty space */}
          <KeypadButton label="0" onClick={() => handleNumberClick("0")} />
          <motion.button 
            whileTap={{ scale: 0.9, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            onClick={handleDelete}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white/80 transition-colors"
          >
            <Delete size={20} />
          </motion.button>
        </div>

        {/* Error notification if wrong passcode */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex items-center gap-2 text-red-500 font-medium"
            >
              <AlertCircle size={18} />
              <span>Incorrect. Please try again.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function KeypadButton({ label, onClick }: { label: string; onClick: () => void; key?: any }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
      onClick={onClick}
      className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex flex-col items-center justify-center text-white text-[24px] font-normal transition-colors border border-white/5 shadow-lg"
    >
      {label}
      <span className="text-[10px] font-bold text-white/40 tracking-[0.2em] -mt-1">
        {label === "2" && "ABC"}
        {label === "3" && "DEF"}
        {label === "4" && "GHI"}
        {label === "5" && "JKL"}
        {label === "6" && "MNO"}
        {label === "7" && "PQRS"}
        {label === "8" && "TUV"}
        {label === "9" && "WXYZ"}
      </span>
    </motion.button>
  );
}
