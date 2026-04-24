import React, { useState, useEffect } from "react";
import { X, Youtube, Loader2, Radio } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface LiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveStreamModal({ isOpen, onClose }: LiveStreamModalProps) {
  const currentLive = useQuery(api.liveStream.get);
  const updateLive = useMutation(api.liveStream.update);
  
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentLive) {
      setYoutubeLink(currentLive.youtubeLink);
      setIsLive(currentLive.isLive);
    }
  }, [currentLive, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateLive({ youtubeLink, isLive });
      onClose();
    } catch (error) {
      console.error("Failed to update live stream:", error);
      alert("Failed to update live stream settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#112a46]/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-serif font-semibold text-[#112a46]">Live Stream Settings</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="font-bold text-[#112a46]">{isLive ? 'Stream is LIVE' : 'Stream is Offline'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLive(!isLive)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isLive 
                    ? 'bg-red-100 text-red-600 border border-red-200' 
                    : 'bg-slate-200 text-slate-600 border border-slate-300'
                }`}
              >
                {isLive ? 'Go Offline' : 'Go Live'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">YouTube Link</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Youtube className="h-4 w-4 text-red-500" />
                </div>
                <input 
                  type="url" 
                  value={youtubeLink} 
                  onChange={(e) => setYoutubeLink(e.target.value)} 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  required={isLive}
                  className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1f4b73] focus:ring-1 focus:ring-[#1f4b73] outline-none transition-shadow" 
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Paste the link to your YouTube live broadcast here.</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-bold text-white bg-[#1f4b73] hover:bg-[#153450] rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:bg-slate-400"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Stream
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
