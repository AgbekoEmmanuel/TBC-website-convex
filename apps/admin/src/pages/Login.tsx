import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeartHandshake, Loader2, Delete } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../components/AuthProvider";

const KEYPAD_DATA = [
  { num: "1", letters: "" },
  { num: "2", letters: "A B C" },
  { num: "3", letters: "D E F" },
  { num: "4", letters: "G H I" },
  { num: "5", letters: "J K L" },
  { num: "6", letters: "M N O" },
  { num: "7", letters: "P Q R S" },
  { num: "8", letters: "T U V" },
  { num: "9", letters: "W X Y Z" },
  { num: "", letters: "" },
  { num: "0", letters: "" },
  { num: "delete", letters: "" },
];

export function Login() {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const CORRECT_PASSCODE = "1234";

  const { login } = useAuth();

  useEffect(() => {
    hiddenInputRef.current?.focus();
    
    // Maintain focus
    const handleFocus = () => hiddenInputRef.current?.focus();
    document.addEventListener("click", handleFocus);
    return () => document.removeEventListener("click", handleFocus);
  }, []);

  useEffect(() => {
    if (passcode.length === 4) {
      handleVerify(passcode);
    }
  }, [passcode]);

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (code === CORRECT_PASSCODE) {
      login();
      navigate("/");
    } else {
      setError(true);
      setPasscode("");
      setTimeout(() => {
        setError(false);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPasscode(val);
  };

  const handleKeypadPress = (val: string) => {
    if (val === "delete") {
      setPasscode(prev => prev.slice(0, -1));
    } else if (val && passcode.length < 4) {
      setPasscode(prev => prev + val);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#011C40] text-white font-sans overflow-hidden select-none">
      {/* iOS Style Blurred Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#011C40] via-[#023859] to-[#011C40]" />
      <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-[#26658C]/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] bg-[#d4af37]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />

      <input
        ref={hiddenInputRef}
        type="text"
        inputMode="numeric"
        value={passcode}
        onChange={handleInputChange}
        className="absolute opacity-0 pointer-events-none"
        autoFocus
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-[280px] transform scale-95 sm:scale-100">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 border border-white/20 shadow-xl">
            <HeartHandshake className="w-6 h-6 text-[#d4af37]" />
          </div>
          <h2 className="text-lg font-medium tracking-tight mb-0.5">Enter Passcode</h2>
          <p className="text-white/40 text-[11px] font-medium tracking-wide">Balance Church Admin</p>
        </motion.div>

        {/* Indicators */}
        <motion.div 
          animate={error ? { x: [-15, 15, -15, 15, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-5 mb-16"
        >
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-2.5 h-2.5 rounded-full border border-white/40 transition-all duration-300 ${
                passcode.length > i ? "bg-white border-white scale-110" : "bg-transparent scale-100"
              }`}
            />
          ))}
        </motion.div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-x-5 gap-y-3.5 w-full">
          {KEYPAD_DATA.map((item, index) => {
            if (item.num === "") return <div key={index} />;
            
            const isDelete = item.num === "delete";
            
            return (
              <motion.button
                key={index}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                whileTap={{ scale: 0.9, backgroundColor: "rgba(255,255,255,0.4)" }}
                onClick={() => handleKeypadPress(item.num)}
                className={`flex flex-col items-center justify-center rounded-full transition-colors duration-200 ${
                  isDelete 
                    ? "bg-transparent w-full aspect-square" 
                    : "bg-white/10 backdrop-blur-md border border-white/5 w-full aspect-square"
                }`}
              >
                {isDelete ? (
                  <Delete className="w-5 h-5 text-white/60" />
                ) : (
                  <>
                    <span className="text-2xl font-light leading-none">{item.num}</span>
                    {item.letters && (
                      <span className="text-[8px] font-bold tracking-[0.1em] mt-0.5 opacity-60">
                        {item.letters}
                      </span>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-[#011C40]/40 backdrop-blur-sm rounded-[40px]"
            >
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] mb-3" />
                <span className="text-[10px] font-medium tracking-widest uppercase opacity-60">Verifying</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Emergency / Cancel Links */}
      <div className="absolute bottom-10 flex justify-between w-full max-w-[280px] px-4 text-[12px] font-medium text-white/60">
        <button className="hover:text-white transition-colors">Emergency</button>
        <button className="hover:text-white transition-colors" onClick={() => setPasscode("")}>Cancel</button>
      </div>
    </div>
  );
}
