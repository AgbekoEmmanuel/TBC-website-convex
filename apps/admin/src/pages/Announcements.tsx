import React, { useState, useEffect } from "react";
import { Mail, Clock, FileEdit, Radio, Smartphone, MessageSquare, Search, Filter, MailPlus, Users, Circle, PlayCircle, Plus, Loader2, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { Card } from "../components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { cn } from "../lib/utils";
import { Doc } from "@convex/_generated/dataModel";
import { CreateAnnouncementModal } from "../components/CreateAnnouncementModal";

export function Announcements() {
  const [activeTopTab, setActiveTopTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const announcements = useQuery(api.announcements.getAll);
  const stats = useQuery(api.dashboard.getStats);
  const remove = useMutation(api.announcements.remove);
  const [showActionsId, setShowActionsId] = useState<string | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Doc<"announcements"> | undefined>(undefined);

  const handleEdit = (announcement: Doc<"announcements">) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(undefined);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setShowActionsId(null);
      }
    }
    if (showActionsId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showActionsId]);

  const filteredAnnouncements = announcements?.filter(a => {
    if (activeTopTab === "All") return true;
    if (activeTopTab === "Scheduled") return false; // Schema doesn't support scheduled yet
    if (activeTopTab === "Drafts") return !a.isActive;
    return true;
  });

  const scheduledCount = 0;
  const draftCount = announcements?.filter(a => !a.isActive).length || 0;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto px-1 sm:px-2 md:px-0 text-[#112a46] dark:text-white mb-20 animate-in fade-in duration-300 pt-2">
      
      <CreateAnnouncementModal 
        isOpen={isModalOpen} 
        onClose={handleClose} 
        initialAnnouncement={editingAnnouncement} 
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-[36px] md:text-[44px] font-serif text-[#112a46] dark:text-white tracking-tight leading-[1.1] font-bold">Announcements</h1>
          <p className="text-[#648496] dark:text-[#8ba4b3] text-[15px] font-medium mt-3">Manage and monitor communications across all congregation channels.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-[#071d33] p-1.5 rounded-full shadow-inner border border-transparent dark:border-white/5">
           {["All", "Scheduled", "Drafts"].map(tab => (
             <button
                key={tab}
                onClick={() => setActiveTopTab(tab)}
                className={cn(
                   "px-6 py-2.5 rounded-full text-[14px] font-medium transition-all",
                   activeTopTab === tab 
                     ? "bg-[#112a46] text-white dark:bg-[#103a64]/80 shadow-md"
                     : "text-slate-500 hover:text-[#112a46] dark:text-[#8ba4b3] dark:hover:text-white"
                )}
             >
                {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         <Card className="p-6 flex flex-col justify-between min-h-[170px] dark:bg-[#0a2744]/60 dark:backdrop-blur-xl dark:border-white/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-white border-slate-100 shadow-sm rounded-3xl transition-all duration-300 relative overflow-hidden group">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
               <MailPlus className="w-48 h-48" />
            </div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#103a64]/50 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#288096] dark:text-[#85c9d8]" />
               </div>
               <span className="text-[12px] font-bold text-[#8ba4b3] dark:text-[#648496] tracking-widest uppercase">Total Sent</span>
            </div>
            <div>
               <div className="flex items-end gap-3 mb-1.5">
                   <span className="text-[36px] font-serif font-bold text-[#112a46] dark:text-white leading-none">
                    {announcements?.filter(a => a.isActive).length || 0}
                  </span>
                  <span className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400 mb-1">↑ 0%</span>
               </div>
               <p className="text-[13px] font-medium text-slate-500 dark:text-[#648496]">In catalog</p>
            </div>
         </Card>

         <Card className="p-6 flex flex-col justify-between min-h-[170px] dark:bg-[#0a2744]/60 dark:backdrop-blur-xl dark:border-white/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-white border-slate-100 shadow-sm rounded-3xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#103a64]/50 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#288096] dark:text-[#85c9d8]" />
               </div>
               <span className="text-[12px] font-bold text-[#8ba4b3] dark:text-[#648496] tracking-widest uppercase">Scheduled</span>
            </div>
            <div>
               <div className="text-[36px] font-serif font-bold text-[#112a46] dark:text-white leading-none mb-2">
                 {scheduledCount}
               </div>
               <p className="text-[13px] font-medium text-slate-500 dark:text-[#648496]">Next 7 days</p>
            </div>
         </Card>

         <Card className="p-6 flex flex-col justify-between min-h-[170px] dark:bg-[#0a2744]/60 dark:backdrop-blur-xl dark:border-white/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-white border-slate-100 shadow-sm rounded-3xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#103a64]/50 flex items-center justify-center">
                  <FileEdit className="w-4 h-4 text-[#288096] dark:text-[#85c9d8]" />
               </div>
               <span className="text-[12px] font-bold text-[#8ba4b3] dark:text-[#648496] tracking-widest uppercase">Drafts</span>
            </div>
            <div>
               <div className="text-[36px] font-serif font-bold text-[#112a46] dark:text-white leading-none mb-2">
                 {draftCount}
               </div>
               <p className="text-[13px] font-medium text-slate-500 dark:text-[#648496]">Pending review</p>
            </div>
         </Card>

         <Card className="p-6 flex flex-col justify-between min-h-[170px] dark:bg-[#0a2744]/60 dark:backdrop-blur-xl dark:border-white/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-white border-slate-100 shadow-sm rounded-3xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#103a64]/50 flex items-center justify-center">
                  <Radio className="w-4 h-4 text-[#288096] dark:text-[#85c9d8]" />
               </div>
               <span className="text-[12px] font-bold text-[#8ba4b3] dark:text-[#648496] tracking-widest uppercase">Active Channels</span>
            </div>
            <div className="flex items-center justify-between px-2">
               <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-[#8ba4b3]">
                     <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">Email</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-[#8ba4b3] bg-slate-100 dark:bg-white/5 shadow-sm">
                     <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">Mobile</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-[#8ba4b3]">
                     <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">SMS</span>
               </div>
            </div>
         </Card>
      </div>

      <Card className="flex flex-col dark:bg-[#0a2744]/40 dark:backdrop-blur-xl dark:border-white/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-white border-slate-100 shadow-sm rounded-3xl transition-all duration-300 min-h-[500px] overflow-visible">
         
         <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 dark:border-white/5">
            <h2 className="text-[24px] font-serif text-[#112a46] dark:text-white font-bold leading-none tracking-tight">Recent Communications</h2>
            <div className="flex items-center gap-4">
               <button 
                  onClick={() => {}} // Create mutation should go here
                  className="flex items-center gap-2 bg-[#1f4b73] hover:bg-[#153450] text-white px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
               >
                  <Plus className="w-4 h-4" /> New Announcement
               </button>
            </div>
         </div>

         <div className="flex flex-col w-full overflow-x-auto">
            <div className="grid grid-cols-12 gap-4 px-6 md:px-8 py-5 border-b border-slate-100 dark:border-white/5 min-w-[800px]">
               <div className="col-span-4 text-[12px] font-bold text-[#8ba4b3] dark:text-[#648496] uppercase tracking-widest pl-2">Announcement</div>
               <div className="col-span-3 text-[12px] font-bold text-[#8ba4b3] dark:text-[#648496] uppercase tracking-widest">Date & Time</div>
               <div className="col-span-2 text-[12px] font-bold text-[#8ba4b3] dark:text-[#648496] uppercase tracking-widest">Audience</div>
               <div className="col-span-2 text-[12px] font-bold text-[#8ba4b3] dark:text-[#648496] uppercase tracking-widest">Status</div>
               <div className="col-span-1 text-[12px] font-bold text-[#8ba4b3] dark:text-[#648496] uppercase tracking-widest text-right">Actions</div>
            </div>

            {announcements === undefined ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#1f4b73]" />
              </div>
            ) : filteredAnnouncements?.length === 0 ? (
              <div className="text-center p-12 text-slate-500">No announcements found.</div>
            ) : (
              filteredAnnouncements?.map((item) => (
                <div key={item._id} className={cn(
                  "grid grid-cols-12 gap-4 px-6 md:px-8 py-6 border-b border-slate-100 dark:border-white/5 min-w-[800px] hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group relative",
                  showActionsId === item._id ? "z-30" : "z-10"
                )}>
                   
                   <div className="col-span-4 flex items-start gap-4 pl-2 pr-4">
                      <div>
                         <h4 className={cn(
                            "text-[16px] font-serif font-bold text-[#112a46] dark:text-white mb-1.5 leading-tight",
                            !item.isActive && "italic opacity-70"
                         )}>{item.title}</h4>
                         <p className="text-[13px] font-medium text-slate-500 dark:text-[#648496] line-clamp-1">{item.body}</p>
                      </div>
                   </div>

                   <div className="col-span-3 flex flex-col justify-center pr-4">
                      <div className={cn(
                         "text-[14px] font-medium text-[#112a46] dark:text-white mb-1",
                         !item.isActive && "text-slate-400 dark:text-[#648496]"
                      )}>Active</div>
                   </div>

                   <div className="col-span-2 flex items-center">
                      <span className="text-[13px] italic font-medium text-slate-400 dark:text-[#648496]">Broadcasting</span>
                   </div>

                   <div className="col-span-2 flex items-center">
                      {item.isActive ? (
                         <div className="flex items-center gap-2 text-[#0f172a] dark:text-white font-bold text-[14px]">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                            Active
                         </div>
                      ) : (
                         <div className="flex items-center gap-2 text-slate-500 dark:text-[#8ba4b3] font-medium text-[14px]">
                            <Circle className="w-2.5 h-2.5" />
                            Inactive
                         </div>
                      )}
                   </div>

                   <div className="col-span-1 flex items-center justify-end relative" data-dropdown>
                      <button 
                         onClick={() => setShowActionsId(showActionsId === item._id ? null : item._id)}
                         className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-400 transition-colors"
                      >
                         <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {showActionsId === item._id && (
                        <div className="absolute right-0 top-12 z-50 bg-white dark:bg-[#07243c] border border-slate-200 dark:border-[#103a64] rounded-xl shadow-xl py-1 min-w-[140px] overflow-hidden">
                           <button 
                              onClick={() => { handleEdit(item); setShowActionsId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-slate-600 dark:text-[#8ba4b3] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                           >
                              <Edit className="w-3.5 h-3.5" /> Edit Details
                           </button>
                           <button 
                              onClick={() => { if(confirm("Delete this announcement?")) remove({ id: item._id }); setShowActionsId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                           >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                           </button>
                        </div>
                      )}
                   </div>
                </div>
              ))
            )}
         </div>

         <div className="flex items-center justify-between mt-auto p-6 md:px-8 md:py-6 text-[13px] font-medium text-slate-500 dark:text-[#648496]">
            <div>Showing {filteredAnnouncements?.length || 0} communications</div>
            <div className="flex items-center gap-2">
               <button className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-400">
                  <span className="text-[16px] leading-none mb-0.5">‹</span>
               </button>
               <button className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-400">
                  <span className="text-[16px] leading-none mb-0.5">›</span>
               </button>
            </div>
         </div>

      </Card>
    </div>
  );
}
