import React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

export function Settings() {
  const navItems = [
    "General", "Security", "Notifications", "Branding", "Integrations"
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-1 sm:px-2 md:px-0 text-[#112a46] dark:text-white mb-20 animate-in fade-in duration-300 pt-2 w-full">
      <div className="flex flex-col mb-10 w-full">
         <h1 className="text-[32px] md:text-[38px] font-serif text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-2">
            Platform Settings
         </h1>
         <p className="text-[14px] font-medium text-slate-500 dark:text-[#648496] leading-relaxed">
            Manage your ministry's digital presence and configuration.
         </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full items-start">
         {/* Left Nav Pane */}
         <div className="w-full md:w-[260px] shrink-0 bg-transparent dark:bg-[#061b30] rounded-2xl p-3 border border-transparent dark:border-white/5">
            {navItems.map((item, i) => {
              const isActive = item === "General";
              return (
                <button
                  key={i}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-medium transition-colors mb-1 last:mb-0",
                    isActive 
                      ? "bg-blue-600 dark:bg-[#2b6ba3] text-white" 
                      : "text-slate-500 dark:text-[#648496] hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {item}
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
         </div>

         {/* Right Form Pane */}
         <div className="flex-1 w-full">
            <div className="mb-6">
               <h2 className="text-[22px] font-serif tracking-tight text-slate-900 dark:text-white mb-1.5">General Information</h2>
               <p className="text-[14px] text-slate-500 dark:text-[#648496]">Basic details about your church organization.</p>
            </div>

            <div className="border border-slate-200 bg-white dark:bg-transparent dark:border-[#1a365d] rounded-[24px] p-6 md:p-8 w-full max-w-3xl shadow-sm dark:shadow-none">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                     <label className="block text-[13px] font-medium text-slate-700 dark:text-[#f8fafc] mb-2.5">Church Name</label>
                     <input 
                       type="text" 
                       defaultValue="Balance Church"
                       className="w-full bg-slate-50 dark:bg-[#061b30] border border-slate-200 dark:border-transparent rounded-lg px-4 py-3 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-600/50"
                     />
                  </div>
                  <div>
                     <label className="block text-[13px] font-medium text-slate-700 dark:text-[#f8fafc] mb-2.5">Contact Email</label>
                     <input 
                       type="email" 
                       defaultValue="admin@balancechurch.org"
                       className="w-full bg-slate-50 dark:bg-[#061b30] border border-slate-200 dark:border-transparent rounded-lg px-4 py-3 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-600/50"
                     />
                  </div>
               </div>

               <div className="mb-6">
                  <label className="block text-[13px] font-medium text-slate-700 dark:text-[#f8fafc] mb-2.5">Physical Address</label>
                  <input 
                    type="text" 
                    defaultValue="123 Sanctuary Blvd, Cityville, ST 12345"
                    className="w-full bg-slate-50 dark:bg-[#061b30] border border-slate-200 dark:border-transparent rounded-lg px-4 py-3 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-600/50"
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="relative">
                     <label className="block text-[13px] font-medium text-slate-700 dark:text-[#f8fafc] mb-2.5">Timezone</label>
                     <select className="w-full appearance-none bg-slate-50 dark:bg-[#061b30] border border-slate-200 dark:border-transparent rounded-lg pl-4 pr-10 py-3 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-600/50 cursor-pointer">
                        <option>Eastern Time (ET)</option>
                     </select>
                     <ChevronDown className="absolute right-4 bottom-3.5 w-[18px] h-[18px] text-slate-400 dark:text-[#648496] pointer-events-none" />
                  </div>
                  <div className="relative">
                     <label className="block text-[13px] font-medium text-slate-700 dark:text-[#f8fafc] mb-2.5">Language</label>
                     <select className="w-full appearance-none bg-slate-50 dark:bg-[#061b30] border border-slate-200 dark:border-transparent rounded-lg pl-4 pr-10 py-3 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-600/50 cursor-pointer">
                        <option>English (US)</option>
                     </select>
                     <ChevronDown className="absolute right-4 bottom-3.5 w-[18px] h-[18px] text-slate-400 dark:text-[#648496] pointer-events-none" />
                  </div>
               </div>

               <div className="flex justify-end">
                  <button className="bg-blue-600 dark:bg-[#85c9d8] text-white dark:text-[#0a2239] hover:bg-blue-700 dark:hover:bg-[#7bc0cf] transition-colors rounded-[10px] px-6 py-2.5 text-[14px] font-medium shadow-sm">
                     Save Changes
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
