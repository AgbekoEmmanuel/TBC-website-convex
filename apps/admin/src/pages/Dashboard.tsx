import React from "react";
import { Card } from "../components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { CalendarDays, PlayCircle, ShoppingBag, ClipboardList, Heart, BarChart3, ChevronDown, ChevronLeft, ChevronRight, Clock, Loader2, Star } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { cn } from "../lib/utils";

const monthlyData = [
  { name: "Jan", events: 20, donations: 30 },
  { name: "Feb", events: 35, donations: 20 },
  { name: "Mar", events: 25, donations: 40 },
  { name: "Apr", events: 39, donations: 28 },
  { name: "May", events: 19, donations: 48 },
  { name: "Jun", events: 24, donations: 38 }
];

function StatCard({ value, label, icon: Icon, isLoading }: { value: string | React.ReactNode, label: string, icon: any, isLoading?: boolean }) {
  return (
    <Card className="flex flex-col p-6 h-[170px] bg-white dark:bg-[#081a30] border border-transparent dark:border-[#1a365d] shadow-sm dark:shadow-none rounded-[20px] justify-center transition-colors">
        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-[#0e2c45] flex items-center justify-center mb-5">
            <Icon className="w-[18px] h-[18px] text-[#288096] dark:text-[#8bcbd8]" />
        </div>
        <div>
            {isLoading ? (
              <div className="h-9 w-16 bg-slate-100 dark:bg-white/5 animate-pulse rounded-md mb-1.5" />
            ) : (
              <div className="text-[32px] md:text-[34px] font-serif text-slate-800 dark:text-white leading-none mb-1.5">{value}</div>
            )}
            <div className="text-[13px] text-slate-600 dark:text-[#8ba4b3] font-medium tracking-wide">{label}</div>
        </div>
    </Card>
  );
}

function DonationsCard({ amount, isLoading }: { amount?: number, isLoading?: boolean }) {
  return (
      <Card className="flex flex-col p-6 h-[170px] overflow-hidden relative bg-[#1f5f8b] dark:bg-[#123956] border border-transparent dark:border-[#1a365d] shadow-sm dark:shadow-none rounded-[20px] justify-center text-white transition-colors">
          <div className="absolute right-[-20px] top-4 text-white/5 pointer-events-none transition-transform hover:scale-105 duration-700">
              <Heart className="w-[150px] h-[150px] fill-current" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-5 relative z-10 text-white">
              <Heart className="w-4 h-4 fill-current" />
          </div>
          <div className="relative z-10 pt-1">
              {isLoading ? (
                <div className="h-9 w-32 bg-white/10 animate-pulse rounded-md mb-1.5" />
              ) : (
                <div className="text-[32px] md:text-[34px] font-serif leading-none mb-1.5 text-white">
                  GH₵ {amount?.toLocaleString() ?? "0"}
                </div>
              )}
              <div className="text-[13px] font-medium tracking-wide text-blue-100">Donations</div>
          </div>
      </Card>
  );
}

function FeaturedEventFlyer({ event }: { event: any }) {
  return (
    <div className="relative w-full h-full rounded-[20px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300">
      <img 
        src={event.imageUrl || "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=800"} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        alt={event.title} 
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#8bcbd8]/90 backdrop-blur-sm text-slate-800 dark:text-[#081a30] text-[10px] font-bold px-2.5 py-1 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        {event.title}
      </div>
    </div>
  );
}

function FeaturedEventsSection({ featuredEvents, nextEvent, isLoading }: { featuredEvents?: any[], nextEvent?: any, isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="h-full min-h-[364px] w-full bg-slate-100 dark:bg-white/5 animate-pulse rounded-[20px]" />
    );
  }

  const eventsToShow = featuredEvents && featuredEvents.length > 0 
    ? featuredEvents 
    : nextEvent 
      ? [nextEvent] 
      : [];

  if (eventsToShow.length === 0) {
    return (
      <Card className="flex flex-col h-full items-center justify-center bg-white dark:bg-[#081a30] p-8 border border-transparent dark:border-[#1a365d] shadow-sm dark:shadow-none rounded-[20px] transition-colors min-h-[364px]">
        <Star className="w-10 h-10 text-slate-300 dark:text-[#1a365d] mb-4" />
        <h3 className="text-lg font-medium text-slate-800 dark:text-white">No featured events</h3>
        <p className="text-sm text-slate-500 dark:text-[#8ba4b3] text-center mt-2">Star an event to feature it here.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto no-scrollbar">
      {eventsToShow.map((event) => (
        <div key={event._id} className={cn("shrink-0 w-full", eventsToShow.length === 1 ? "h-full" : "h-[174px]")}>
          <FeaturedEventFlyer event={event} />
        </div>
      ))}
    </div>
  );
}

function CalendarWidget() {
  const daysRow = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const now = new Date();
  const calendarDays = Array.from({ length: 31 }, (_, i) => ({
    d: i + 1,
    current: i + 1 === now.getDate(),
    hasEvent: [8, 15, 22, 27, 29].includes(i + 1) // Static for now as requested
  }));

  const monthName = now.toLocaleString('default', { month: 'long' });

  return (
    <Card className="h-full p-6 md:p-8 flex flex-col bg-white dark:bg-[#081a30] border border-transparent dark:border-[#1a365d] shadow-sm dark:shadow-none rounded-[20px] transition-colors w-full">
        <div className="flex justify-between items-center mb-8">
            <h3 className="font-serif text-[20px] text-slate-800 dark:text-white font-medium tracking-tight">{monthName} {now.getFullYear()}</h3>
            <div className="flex gap-2">
                <button className="text-slate-400 dark:text-[#648496] hover:text-slate-800 dark:hover:text-white transition-colors p-1"><ChevronLeft className="w-[16px] h-[16px]"/></button>
                <button className="text-slate-400 dark:text-[#648496] hover:text-slate-800 dark:hover:text-white transition-colors p-1"><ChevronRight className="w-[16px] h-[16px]"/></button>
            </div>
        </div>
        
        <div className="grid grid-cols-7 gap-y-5">
            {daysRow.map(day => (
               <div key={day} className="text-center text-[12px] font-semibold text-slate-400 dark:text-[#648496] mb-3">{day}</div>
            ))}
            {calendarDays.map((day, i) => (
                <div key={i} className="flex flex-col items-center justify-center relative w-full h-[36px]">
                   <div className={cn(
                      "w-[34px] h-[34px] flex items-center justify-center rounded-full text-[13.5px] font-medium transition-colors",
                      day.current ? "bg-[#1f5f8b] text-white dark:bg-[#85c9d8] dark:text-[#081a30] font-bold" : "text-slate-800 dark:text-[#e2e8f0] hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                   )}>
                      {day.d}
                   </div>
                   {day.hasEvent && !day.current && (
                      <div className="absolute bottom-[-4px] w-1 h-1 rounded-full bg-[#1f5f8b] dark:bg-[#8bcbd8]"></div>
                   )}
                </div>
            ))}
        </div>
    </Card>
  )
}

function GraphWidget() {
  return (
    <Card className="p-6 md:p-8 flex flex-col h-full bg-white dark:bg-[#081a30] border border-transparent dark:border-[#1a365d] shadow-sm dark:shadow-none rounded-[20px] min-h-[380px] transition-colors w-full">
      <div className="flex items-center justify-between mb-8">
         <h3 className="font-serif text-[20px] md:text-[22px] text-slate-800 dark:text-white font-medium tracking-tight">Monthly Events & Donations</h3>
         <button className="flex items-center text-[13px] font-medium text-slate-600 hover:text-slate-900 dark:text-[#8ba4b3] dark:hover:text-white transition-colors border-none bg-transparent">
            This Year <ChevronDown className="w-[14px] h-[14px] ml-1.5" />
         </button>
      </div>
      
      <div className="flex-1 w-full min-h-[220px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="stroke-slate-200 dark:stroke-[#103a64]" strokeOpacity={0.4} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8ba4b3' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8ba4b3' }} tickFormatter={(val) => `${val}%`} />
            
            <Area type="monotone" dataKey="events" stroke="#7bc0cf" strokeWidth={2} fillOpacity={0} />
            <Area type="monotone" dataKey="donations" stroke="#bae6fd" strokeWidth={2} fillOpacity={0} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-8 mt-6 pt-2">
         <div className="flex items-center gap-2">
            <div className="w-[10px] h-[10px] rounded-full bg-[#7bc0cf]"></div>
            <span className="text-[13px] font-medium text-slate-600 dark:text-[#8ba4b3]">Events</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-[10px] h-[10px] rounded-full bg-[#bae6fd]"></div>
            <span className="text-[13px] font-medium text-slate-600 dark:text-[#8ba4b3]">Donations</span>
         </div>
      </div>
    </Card>
  )
}

export function Dashboard() {
  const stats = useQuery(api.dashboard.getStats);
  const isLoading = stats === undefined;
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-[1400px] mx-auto px-1 sm:px-2 md:px-0 text-[#112a46] dark:text-white mb-20 animate-in fade-in duration-300 pt-2 w-full">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-10 w-full border-b border-transparent">
          <div>
              <h1 className="text-[32px] md:text-[38px] font-serif text-slate-800 dark:text-white tracking-tight leading-[1.1] mb-2 md:mb-1">
                 Welcome back, Administrator
              </h1>
              <p className="text-slate-600 dark:text-[#8ba4b3] text-[15.5px] font-medium">
                 Here is the overview of your ministry today.
              </p>
          </div>
          <div className="text-left md:text-right hidden sm:block">
              <p className="text-[11px] font-bold text-slate-500 dark:text-[#648496] uppercase tracking-widest mb-1.5">TODAY'S DATE</p>
              <p className="text-[18px] text-slate-800 dark:text-white font-medium">{today}</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full mb-6">
         <div className="lg:row-span-2 h-full">
            <FeaturedEventsSection 
              featuredEvents={stats?.featuredEvents} 
              nextEvent={stats?.nextEvent} 
              isLoading={isLoading} 
            />
         </div>
         
         <StatCard icon={CalendarDays} value={stats?.upcomingEvents.toString()} label="Upcoming Events" isLoading={isLoading} />
         <StatCard icon={PlayCircle} value={stats?.publishedSermons.toString()} label="Published Sermons" isLoading={isLoading} />
         <StatCard icon={ShoppingBag} value={stats?.totalProducts.toString()} label="Total Products" isLoading={isLoading} />
         
         <StatCard icon={ClipboardList} value={stats?.totalOrders.toString()} label="New Orders" isLoading={isLoading} />
         <DonationsCard amount={stats?.totalDonationsThisMonth} isLoading={isLoading} />
         <StatCard icon={BarChart3} value="156" label="Visitors" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
         <div className="lg:col-span-3 h-full">
            <GraphWidget />
         </div>
         <div className="lg:col-span-2 h-full min-h-[380px]">
            <CalendarWidget />
         </div>
      </div>
    </div>
  );
}
