import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { HeartHandshake, Loader2, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

export function Login() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@tbc.com");
  const [password, setPassword] = useState("admin@123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn("password", { email, password, flow: "signIn" });
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#011C40] p-4 text-white font-sans">
      <Card className="w-full max-w-md border-transparent bg-[#023859] p-8 shadow-2xl rounded-[32px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#1e130c] flex items-center justify-center mb-4">
            <HeartHandshake className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h1 className="text-[28px] font-serif font-bold text-white tracking-tight mb-1">Balance Church</h1>
          <p className="text-[#85c9d8] text-[14px] font-medium uppercase tracking-[0.2em]">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-[13.5px] px-4 py-3 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#648496] uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#031c34] border-transparent rounded-xl px-4 py-3.5 text-[15px] focus:ring-2 focus:ring-[#26658C] outline-none transition-all placeholder:text-slate-600"
              placeholder="admin@thebalancechurch.org"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#648496] uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#031c34] border-transparent rounded-xl px-4 py-3.5 text-[15px] focus:ring-2 focus:ring-[#26658C] outline-none transition-all placeholder:text-slate-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#26658C] hover:bg-[#3478b5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}
