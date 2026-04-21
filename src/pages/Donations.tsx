import React from "react";
import { Banknote, TrendingUp, Users, Flag, MoreHorizontal, Download, ChevronRight, ArrowUp, ChevronDown, Plus, Loader2 } from "lucide-react";
import { Card } from "../components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "../lib/utils";
import { Doc } from "../../convex/_generated/dataModel";

function StatCard({ 
  title, value, subtitle, highlight, icon: Icon, isProgress = false, progressValue = 0, subValue = '' 
}: { 
  title: string, value: string, subtitle: string, highlight?: string, icon: any, isProgress?: boolean, progressValue?: number, subValue?: string 
}) {
  return (
    <Card className="p-6 md:p-8 flex flex-col bg-white dark:bg-[#0a2239] border border-slate-200 dark:border-transparent shadow-none rounded-[20px] transition-colors w-full h-full relative">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-[13px] font-medium text-slate-500 dark:text-[#8ba4b3]">{title}</h3>
        <Icon className="w-[18px] h-[18px] text-slate-400 dark:text-[#648496]" />
      </div>
      
      <div className="mt-auto">
        <div className="flex items-baseline gap-2 mb-2">
          <h2 className="font-serif text-[32px] text-[#112a46] dark:text-white leading-none">{value}</h2>
          {subValue && <span className="text-[13px] text-slate-500 dark:text-[#648496]">{subValue}</span>}
        </div>
        
        {isProgress ? (
          <div className="w-full mt-4">
            <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#85c9d8] rounded-full" 
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-[12px] font-medium text-slate-500 dark:text-[#648496] flex items-center gap-1.5 mt-3">
            {highlight && (
              <span className="flex items-center text-[#10b981] dark:text-[#4ade80]">
                {highlight.includes('new') ? <Plus className="w-3 h-3 mr-0.5" /> : <ArrowUp className="w-3 h-3 mr-0.5" />}
                {highlight}
              </span>
            )}
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
}

function GivingTrends() {
  return (
    <Card className="p-6 md:p-8 flex flex-col h-full bg-white dark:bg-[#0a2239] border border-slate-200 dark:border-transparent shadow-none rounded-[20px] min-h-[400px] transition-colors w-full">
      <div className="flex items-start justify-between mb-12">
         <div>
            <h3 className="font-serif text-[22px] text-[#112a46] dark:text-white font-medium tracking-tight mb-1">Giving Trends</h3>
            <p className="text-[13px] text-slate-500 dark:text-[#648496]">Monthly contributions vs historical average</p>
         </div>
         <button className="flex items-center justify-between min-w-[120px] bg-slate-50 dark:bg-[#081a30] border border-slate-200 dark:border-[#1a365d] px-3 py-2 rounded-lg text-[13px] font-medium text-[#112a46] dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            This Year <ChevronDown className="w-4 h-4 ml-2 text-slate-400 dark:text-[#648496]" />
         </button>
      </div>

      <div className="relative flex-1 w-full flex flex-col justify-between mt-auto">
         {['GH₵ 100k', 'GH₵ 50k', 'GH₵ 0'].map((label) => (
            <div key={label} className="relative w-full flex items-end h-[100px] border-b border-slate-100 dark:border-white/5 pb-2">
               <span className="absolute -top-3 left-0 text-[11px] font-medium text-slate-400 dark:text-[#648496]">{label}</span>
            </div>
         ))}
         
         <div className="flex justify-between w-full px-12 pt-4">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => (
               <span key={month} className="text-[12px] font-medium text-slate-400 dark:text-[#648496]">
                  {month}
               </span>
            ))}
         </div>
      </div>
    </Card>
  );
}

function RecentGifts({ donations }: { donations: Doc<"donations">[] | undefined }) {
  return (
    <Card className="p-6 md:p-8 flex flex-col h-full bg-white dark:bg-[#0a2239] border border-slate-200 dark:border-transparent shadow-none rounded-[20px] transition-colors w-full">
      <div className="flex items-center justify-between mb-8">
         <h3 className="font-serif text-[20px] text-[#112a46] dark:text-white font-medium tracking-tight">Recent Gifts</h3>
         <button className="text-slate-400 hover:text-slate-600 dark:text-[#648496] dark:hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
         </button>
      </div>

      <div className="flex flex-col gap-6 mb-8 flex-1">
         {donations === undefined ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#85c9d8]" /></div>
         ) : donations.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm italic">No recent gifts</div>
         ) : (
            donations.map((gift) => (
               <div key={gift._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#081a30] text-[#112a46] dark:text-white flex items-center justify-center text-[13px] font-medium shrink-0 uppercase">
                        {gift.donorName?.slice(0, 2) || "AN"}
                     </div>
                     <div>
                        <h4 className="text-[14px] font-medium text-[#112a46] dark:text-white mb-0.5">{gift.donorName || "Anonymous"}</h4>
                        <p className="text-[12px] text-slate-500 dark:text-[#8ba4b3]">{gift.fund || "General Fund"}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <h4 className="text-[14px] font-bold text-[#112a46] dark:text-white mb-0.5">GH₵ {gift.amount}</h4>
                     <p className="text-[12px] text-slate-400 dark:text-[#648496]">
                        {new Date(gift.date).toLocaleDateString()}
                     </p>
                  </div>
               </div>
            ))
         )}
      </div>

      <button className="w-full py-3 rounded-xl border border-slate-200 dark:border-white/10 text-[13px] font-medium text-[#112a46] dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors mt-auto">
         View All History
      </button>
    </Card>
  );
}

function ActiveFunds() {
   const funds = [
      { name: "General Operations 2024", goal: "GH₵ 1,500,000", raised: "GH₵ 0", percent: 0, statusColor: "bg-[#4ade80]" },
      { name: "Sanctuary Restoration", goal: "GH₵ 500,000", raised: "GH₵ 0", percent: 0, statusColor: "bg-[#85c9d8]" }
   ];

   return (
      <div className="w-full mt-10">
         <div className="flex items-center justify-between mb-6">
            <div>
               <h3 className="font-serif text-[22px] text-[#112a46] dark:text-white font-medium tracking-tight mb-2">Active Funds Performance</h3>
               <p className="text-[13px] text-slate-500 dark:text-[#648496]">Tracking current status against designated goals</p>
            </div>
            <button className="flex items-center gap-2 text-[13px] font-medium text-slate-500 hover:text-slate-700 dark:text-[#8ba4b3] dark:hover:text-white transition-colors">
               <Download className="w-4 h-4" /> Export
            </button>
         </div>

         <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
               <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5">
                     <th className="pb-4 text-[11px] font-medium text-slate-400 dark:text-[#648496] uppercase tracking-wider pl-4">Fund Name</th>
                     <th className="pb-4 text-[11px] font-medium text-slate-400 dark:text-[#648496] uppercase tracking-wider">Target Goal</th>
                     <th className="pb-4 text-[11px] font-medium text-slate-400 dark:text-[#648496] uppercase tracking-wider">Total Raised</th>
                     <th className="pb-4 text-[11px] font-medium text-slate-400 dark:text-[#648496] uppercase tracking-wider w-[200px]">Status</th>
                     <th className="pb-4 text-[11px] font-medium text-slate-400 dark:text-[#648496] uppercase tracking-wider text-right pr-4">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {funds.map((fund, i) => (
                     <tr key={i} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer">
                        <td className="py-5 pl-4">
                           <div className="flex items-center gap-3">
                              <div className={cn("w-2 h-2 rounded-full", fund.statusColor)} />
                              <span className="text-[14px] font-medium text-[#112a46] dark:text-white">{fund.name}</span>
                           </div>
                        </td>
                        <td className="py-5 text-[14px] text-slate-500 dark:text-[#8ba4b3] font-medium">{fund.goal}</td>
                        <td className="py-5 text-[14px] text-[#112a46] dark:text-white font-medium">{fund.raised}</td>
                        <td className="py-5">
                           <div className="flex items-center gap-4">
                              <div className="h-1.5 flex-1 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                 <div className={cn("h-full rounded-full", fund.statusColor)} style={{ width: `${fund.percent}%` }} />
                              </div>
                              <span className="text-[13px] font-medium text-slate-500 dark:text-[#8ba4b3] w-8">{fund.percent}%</span>
                           </div>
                        </td>
                        <td className="py-5 pr-4 text-right">
                           <button className="text-slate-400 group-hover:text-slate-600 dark:text-[#648496] dark:group-hover:text-white transition-colors">
                              <ChevronRight className="w-5 h-5 ml-auto" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}

export function Donations() {
  const stats = useQuery(api.dashboard.getStats);
  const donations = useQuery(api.donations.getAll);

  return (
    <div className="max-w-[1400px] mx-auto px-1 sm:px-2 md:px-0 text-[#112a46] dark:text-white mb-20 animate-in fade-in duration-300 pt-2 w-full">
      
      <div className="flex flex-col mb-10 w-full">
         <p className="text-[10.5px] font-bold text-slate-500 dark:text-[#648496] uppercase tracking-[0.2em] mb-2">Stewardship Overview</p>
         <h1 className="text-[32px] md:text-[38px] font-serif text-[#112a46] dark:text-white tracking-tight leading-[1.1]">
            Donations Dashboard
         </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-6">
         <StatCard 
            title="Total Giving YTD" 
            value={`GH₵ ${stats?.totalRevenue?.toLocaleString() || "0"}`}
            highlight="0%" 
            subtitle="vs last year" 
            icon={Banknote} 
         />
         <StatCard 
            title="Average Gift Size" 
            value="GH₵ 0" 
            highlight="0%" 
            subtitle="vs last month" 
            icon={TrendingUp} 
         />
         <StatCard 
            title="Recurring Donors" 
            value="0" 
            highlight="0 new" 
            subtitle="this week" 
            icon={Users} 
         />
         <StatCard 
            title="Annual Goal" 
            value="0%" 
            subValue="of GH₵ 2M"
            subtitle="" 
            icon={Flag} 
            isProgress={true}
            progressValue={0}
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
         <div className="lg:col-span-2">
            <GivingTrends />
         </div>
         <div className="lg:col-span-1">
            <RecentGifts donations={donations} />
         </div>
      </div>

      <ActiveFunds />

    </div>
  );
}
