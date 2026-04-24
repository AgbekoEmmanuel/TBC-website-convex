import React, { useState, useRef, useEffect } from "react";
import { Plus, Filter, CalendarDays, Clock, MapPin, ArrowRight, UserPlus, MoreHorizontal, Loader2, Trash2, Eye, EyeOff, Star, Edit } from "lucide-react";
import { Card } from "../components/ui/card";
import { CreateEventModal } from "../components/CreateEventModal";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "../lib/utils";
import { Doc, Id } from "../../convex/_generated/dataModel";

function FeaturedEventCard({ event }: { event: Doc<"events"> | null | undefined }) {
  const toggleFeatured = useMutation(api.events.toggleFeatured);

  if (event === undefined) return <div className="h-[380px] bg-slate-100 dark:bg-white/5 animate-pulse rounded-[24px]" />;
  if (!event) return (
     <Card className="flex flex-col items-center justify-center dark:bg-[#0a2744]/60 p-8 border border-slate-100 dark:border-white/5 rounded-[24px] min-h-[380px] transition-all">
        <Star className="w-12 h-12 text-slate-300 dark:text-[#1a365d] mb-4" />
        <h3 className="text-xl font-medium text-slate-800 dark:text-white">No featured event</h3>
        <p className="text-sm text-slate-500 dark:text-[#8ba4b3] text-center mt-2">Highlight an event to show it here.</p>
     </Card>
  );

  return (
     <Card className="flex flex-col dark:bg-[#0a2744]/60 dark:backdrop-blur-xl overflow-hidden p-0 border border-slate-100 dark:border-white/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] shadow-sm rounded-[24px] min-h-[380px] relative transition-all duration-300">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.4] dark:opacity-30 dark:mix-blend-overlay border-none" style={{ backgroundImage: `url(${event.imageUrl || 'https://images.unsplash.com/photo-1544427920-c49ccdaf8c48?auto=format&fit=crop&q=80&w=1200'})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent dark:from-[#031c34]/95 dark:via-[#031c34]/80 dark:to-transparent"></div>
        
        <div className="relative z-10 p-8 flex flex-col justify-between h-full w-full sm:w-[85%] lg:w-[75%]">
           
           <div>
             <div className="mb-6">
               <span className="bg-[#e0f2fe] text-[#0284c7] dark:bg-[#85c9d8]/20 dark:text-[#85c9d8] text-[10px] uppercase font-bold px-3.5 py-1.5 rounded-full tracking-widest border border-transparent dark:border-[#85c9d8]/30 shadow-sm">
                 FEATURED
               </span>
             </div>
             
             <div className="flex flex-wrap items-center text-slate-500 dark:text-[#8ba4b3] font-medium mb-4 text-[13px] gap-6">
                <div className="flex items-center">
                  <CalendarDays className="w-3.5 h-3.5 mr-2" /> 
                  {event.date ? new Date(event.date).toLocaleDateString() : "Date TBA"}
                </div>
                <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-2" /> {event.time || "TBA"}</div>
                <div className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-2" /> {event.location || "TBD"}</div>
             </div>

             <h2 className="text-3xl sm:text-4xl md:text-[40px] font-serif text-[#112a46] dark:text-white mb-4 leading-[1.15] tracking-tight font-bold">{event.title}</h2>
             <p className="text-slate-600 dark:text-[#8ba4b3] text-[15px] font-medium leading-[1.6] max-w-xl">
               {event.description || "Join us for our upcoming event!"}
             </p>
           </div>
           
           <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200/60 dark:border-white/10">
              <div className="flex -space-x-2">
                 <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#031c34] bg-[#0284c7] dark:bg-[#346b85] text-white text-[10px] font-bold flex items-center justify-center z-10 shadow-sm relative">
                    BC
                 </div>
              </div>
              
              <button className="text-[#112a46] hover:text-[#0284c7] dark:text-white dark:hover:text-[#85c9d8] text-[15px] font-semibold transition-colors flex items-center">
                 Manage <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
           </div>
        </div>
     </Card>
  )
}

function ListEventCard({ ev, onEdit }: { ev: Doc<"events">, onEdit: (ev: Doc<"events">) => void }) {
  const togglePublished = useMutation(api.events.togglePublished);
  const toggleFeatured = useMutation(api.events.toggleFeatured);
  const remove = useMutation(api.events.remove);
  const [showActions, setShowActions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    }
    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showActions]);

  const dateObj = ev.date ? new Date(ev.date) : null;
  const month = dateObj && !isNaN(dateObj.getTime()) ? dateObj.toLocaleString('default', { month: 'short' }).toUpperCase() : "---";
  const day = dateObj && !isNaN(dateObj.getTime()) ? dateObj.getDate().toString() : "--";

  return (
    <Card className={cn(
      "flex flex-col md:flex-row md:items-center p-3 pr-4 md:p-5 dark:bg-[#0a2744]/40 dark:backdrop-blur-xl dark:border-white/5 hover:dark:bg-[#0a2744]/60 transition-all duration-300 bg-white shadow-sm hover:shadow-md border border-slate-100 rounded-[24px] gap-5 relative overflow-visible",
      showActions ? "z-30" : "z-10"
    )}>
      <div className="w-[72px] h-[72px] flex-shrink-0 flex flex-col items-center justify-center rounded-[18px] bg-[#f8fafc] dark:bg-transparent dark:border dark:border-[#103a64]/80 border border-slate-100/60 shadow-sm">
        <span className="text-[10px] font-bold text-slate-500 dark:text-[#648496] uppercase tracking-widest mb-0.5">{month}</span>
        <span className="text-[22px] font-bold font-serif text-[#112a46] dark:text-white leading-none">{day}</span>
      </div>
      
      <div className="flex-1 min-w-0 mt-2 md:mt-0 px-2 md:px-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-[18px] font-bold font-serif text-[#112a46] dark:text-white truncate">{ev.title}</h3>
          {!ev.isPublished && (
            <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Draft</span>
          )}
          {ev.isFeatured && (
            <Star className="w-3 h-3 text-amber-500 fill-current" />
          )}
        </div>
        <div className="flex flex-wrap items-center text-[13px] font-medium text-slate-500 dark:text-[#8ba4b3] gap-x-4 gap-y-2">
           <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400 dark:text-[#648496]"/>{ev.time || "TBA"}</div>
           <div className="hidden sm:block text-slate-300 dark:text-slate-700">•</div>
           <div className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 dark:text-[#648496]"/>{ev.location || "TBD"}</div>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-0">
         <div className="flex flex-col items-end justify-center w-[120px] lg:w-[140px] flex-shrink-0 border-r border-slate-100 dark:border-white/5 pr-6 h-10">
           <span className="text-[15px] font-bold text-[#112a46] dark:text-white leading-tight mb-[2px]">0</span>
           <span className="text-[11px] font-medium text-slate-500 dark:text-[#648496]">Registered</span>
         </div>

         <div className="flex flex-col items-end justify-center w-[140px] lg:w-[160px] flex-shrink-0 pr-6 h-10">
           <span className="text-[14px] font-medium text-[#112a46] dark:text-white leading-tight mb-[2px]">Service</span>
           <span className="text-[11px] font-medium text-slate-500 dark:text-[#648496]">Category</span>
         </div>
      </div>

      <div className="flex items-center justify-end md:justify-center flex-shrink-0 pl-2 relative" ref={dropdownRef}>
        <button 
          onClick={() => setShowActions(!showActions)}
          className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-[#112a46] hover:bg-slate-50 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
        >
          <MoreHorizontal className="w-[18px] h-[18px]" />
        </button>

        {showActions && (
          <div className="absolute right-0 top-12 z-50 bg-white dark:bg-[#07243c] border border-slate-200 dark:border-[#103a64] rounded-xl shadow-xl py-2 min-w-[160px] overflow-hidden">
             <button 
                onClick={() => { onEdit(ev); setShowActions(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-[#8ba4b3] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
             >
                <Edit className="w-4 h-4"/> Edit Details
             </button>
             <button 
                onClick={() => { togglePublished({ id: ev._id, isPublished: !ev.isPublished }); setShowActions(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-[#8ba4b3] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
             >
                {ev.isPublished ? <><EyeOff className="w-4 h-4"/> Unpublish</> : <><Eye className="w-4 h-4"/> Publish</>}
             </button>
             <button 
                onClick={() => { toggleFeatured({ id: ev._id, isFeatured: !ev.isFeatured }); setShowActions(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-[#8ba4b3] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
             >
                <Star className={cn("w-4 h-4", ev.isFeatured && "fill-current text-amber-500")} /> {ev.isFeatured ? "Unfeature" : "Feature"}
             </button>
             <button 
                onClick={() => { if(confirm("Are you sure?")) remove({ id: ev._id }); setShowActions(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
             >
                <Trash2 className="w-4 h-4" /> Delete Event
             </button>
          </div>
        )}
      </div>
    </Card>
  )
}

export function Events() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Doc<"events"> | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("All");
  const events = useQuery(api.events.getAll);
  const featuredEvent = useQuery(api.events.getFeatured);
  const stats = useQuery(api.dashboard.getStats);

  const filteredEvents = events?.filter(ev => {
    if (activeTab === "All") return true;
    return ev.category?.toLowerCase() === activeTab.toLowerCase() || 
           (activeTab === "Special Programs" && ev.category === "special");
  });

  const handleEdit = (ev: Doc<"events">) => {
    setEditingEvent(ev);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingEvent(undefined);
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto px-1 sm:px-2 md:px-0 text-[#112a46] dark:text-white mb-20 animate-in fade-in duration-300 pt-2">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-[36px] md:text-[44px] font-serif text-[#112a46] dark:text-white tracking-tight leading-[1.1] font-bold">Upcoming Gatherings</h1>
          <p className="text-[#648496] dark:text-[#8ba4b3] text-[15px] font-medium mt-3">Manage and schedule church events, services, and community outreach.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button className="flex items-center gap-2 bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-[#103a64]/80 dark:text-white dark:hover:bg-[#103a64]/30 px-5 text-[14px] py-2.5 rounded-xl font-medium transition-colors shadow-sm">
            <Filter className="w-4 h-4"/> Filter
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#1f4b73] hover:bg-[#153450] text-white dark:bg-[#346b85] dark:hover:bg-[#285b73] px-5 py-2.5 text-[14px] rounded-xl font-semibold transition-colors shadow-sm"
          >
             <Plus className="w-[18px] h-[18px]"/> Create Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 mb-12">
        <div className="lg:col-span-12 xl:col-span-8">
          <FeaturedEventCard event={featuredEvent} />
        </div>
        <div className="lg:col-span-12 xl:col-span-4 flex flex-col">
          <div className="h-full flex flex-col basis-full bg-white dark:bg-transparent rounded-[24px]">
             <h3 className="font-serif text-[22px] font-bold text-[#112a46] dark:text-white mb-4 leading-none flex items-center h-[32px] pt-1 ml-1">This Week</h3>
             <div className="flex flex-col gap-4 flex-1">
                <Card className="p-5 flex items-center gap-5 dark:bg-[#0a2744]/40 dark:backdrop-blur-xl dark:border-white/5 hover:dark:bg-[#0a2744]/60 transition-colors bg-white shadow-sm border-slate-100 rounded-3xl flex-1">
                   <div className="w-[52px] h-[52px] rounded-2xl bg-[#f0f9ff] dark:bg-[#071d33]/80 border border-[#e0f2fe] dark:border-[#103a64]/50 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-5 h-5 text-[#0284c7] dark:text-[#85c9d8]" />
                   </div>
                   <div>
                      <div className="text-[28px] font-serif font-bold text-[#112a46] dark:text-white leading-none mb-1.5 tracking-tight">{stats?.upcomingEvents ?? 0}</div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-[#648496] uppercase tracking-widest">Events Scheduled</div>
                   </div>
                </Card>

                <Card className="p-5 flex items-center gap-5 dark:bg-[#0a2744]/40 dark:backdrop-blur-xl dark:border-white/5 hover:dark:bg-[#0a2744]/60 transition-colors bg-white shadow-sm border-slate-100 rounded-3xl flex-1">
                   <div className="w-[52px] h-[52px] rounded-2xl bg-[#f0f9ff] dark:bg-[#071d33]/80 border border-[#e0f2fe] dark:border-[#103a64]/50 flex items-center justify-center flex-shrink-0">
                      <UserPlus className="w-5 h-5 text-[#0284c7] dark:text-[#85c9d8]" />
                   </div>
                   <div>
                      <div className="text-[28px] font-serif font-bold text-[#112a46] dark:text-white leading-none mb-1.5 tracking-tight">0</div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-[#648496] uppercase tracking-widest">Total RSVPS</div>
                   </div>
                </Card>

                <button className="w-full mt-2 py-[14px] rounded-2xl text-[14px] font-medium transition-all border border-slate-200 dark:border-white/10 dark:text-[#8ba4b3] dark:hover:text-white dark:hover:bg-white/5 text-[#112a46] hover:bg-slate-50 shadow-sm bg-white dark:bg-[#0a2744]/20 dark:backdrop-blur-md">
                   View Full Calendar
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-white/5 pb-5 mb-6 gap-4">
            <h2 className="text-[26px] font-serif text-[#112a46] dark:text-white font-bold leading-none tracking-tight">Upcoming List</h2>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
               {["All", "Sunday", "Midweek", "Prayers", "Special Programs"].map((tab) => (
                 <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                       "text-[13px] font-semibold px-4 py-1.5 rounded-full transition-colors",
                       activeTab === tab 
                         ? "bg-[#112a46] text-white shadow-sm dark:border dark:border-[#103a64] dark:bg-[#103a64]/60 dark:text-[#85c9d8]"
                         : "text-slate-500 hover:text-[#112a46] hover:bg-slate-100 dark:text-[#8ba4b3] dark:hover:text-white bg-transparent border border-transparent dark:hover:bg-white/5"
                    )}
                 >
                    {tab}
                 </button>
               ))}
            </div>
         </div>

         <div className="flex flex-col gap-4">
            {events === undefined ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#1f4b73]" />
              </div>
            ) : filteredEvents?.length === 0 ? (
              <div className="text-center p-12 text-slate-500">No events found in this category.</div>
            ) : (
              filteredEvents?.map((ev) => (
                <React.Fragment key={ev._id}>
                  <ListEventCard ev={ev} onEdit={handleEdit} />
                </React.Fragment>
              ))
            )}
         </div>

         <div className="flex justify-center mt-12 mb-8">
            <button className="text-[14px] font-medium text-slate-500 hover:text-[#112a46] dark:text-[#8ba4b3] dark:hover:text-white transition-colors pb-1.5 border-b-2 border-transparent hover:border-[#112a46] dark:hover:border-white">
               Load More Events
            </button>
         </div>
      </div>

      <CreateEventModal 
        isOpen={isModalOpen} 
        onClose={handleClose} 
        initialEvent={editingEvent} 
      />
    </div>
  );
}
