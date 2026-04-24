import React, { useState } from "react";
import { ChevronDown, Plus, Clock, User, Loader2, MoreHorizontal, Eye, EyeOff, Trash2, PlayCircle } from "lucide-react";
import { Card } from "../components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { cn } from "../lib/utils";
import { Doc } from "@convex/_generated/dataModel";
import { CreateSermonModal } from "../components/CreateSermonModal";

function SermonCard({ sermon }: { sermon: Doc<"sermons">, key?: any }) {
  const togglePublished = useMutation(api.sermons.togglePublished);
  const remove = useMutation(api.sermons.remove);
  const [showActions, setShowActions] = useState(false);

  return (
    <Card className="flex flex-col h-full bg-white dark:bg-[#081a30] overflow-hidden p-0 border border-slate-200 dark:border-[#1a365d] shadow-none rounded-[24px] relative transition-colors">
      <div className="h-[220px] w-full relative shrink-0 bg-[#f8fafc] dark:bg-[#0a2239]">
        {sermon.thumbnailUrl ? (
          <>
            <img src={sermon.thumbnailUrl} alt={sermon.title} className="w-full h-full object-cover opacity-80 dark:opacity-60 mix-blend-luminosity dark:mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent dark:from-[#081a30] dark:via-[#081a30]/40 dark:to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-[#0a2239]">
             <PlayCircle className="w-12 h-12 text-slate-300 dark:text-[#1a365d]" />
          </div>
        )}
        
        <div className="absolute top-5 left-5 z-10 flex gap-2">
          <span className={cn(
             "text-[10px] uppercase font-bold px-3 py-1.5 rounded-full tracking-widest border shadow-sm",
             sermon.isPublished 
               ? "bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd] dark:bg-[#85c9d8]/10 dark:text-[#85c9d8] dark:border-[#85c9d8]/20"
               : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-transparent dark:text-[#648496] dark:border-[#1a365d]"
          )}>
            {sermon.isPublished ? "PUBLISHED" : "DRAFT"}
          </span>
        </div>

        <div className="absolute top-5 right-5 z-20">
          <button 
            onClick={() => setShowActions(!showActions)}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-[#031c34]/80 backdrop-blur-md flex items-center justify-center text-slate-500 hover:text-[#112a46] dark:hover:text-white border border-slate-200/50 dark:border-white/10 shadow-sm"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-10 z-50 bg-white dark:bg-[#07243c] border border-slate-200 dark:border-[#103a64] rounded-xl shadow-xl py-1 min-w-[140px] overflow-hidden">
               <button 
                  onClick={() => { togglePublished({ id: sermon._id, isPublished: !sermon.isPublished }); setShowActions(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-slate-600 dark:text-[#8ba4b3] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
               >
                  {sermon.isPublished ? <><EyeOff className="w-3.5 h-3.5"/> Draft</> : <><Eye className="w-3.5 h-3.5"/> Publish</>}
               </button>
               <button 
                  onClick={() => { if(confirm("Delete this sermon?")) remove({ id: sermon._id }); setShowActions(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
               >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
               </button>
            </div>
          )}
        </div>

        <div className="absolute bottom-4 right-5 z-10 flex items-center gap-1.5 bg-white/90 dark:bg-[#031c34]/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-[#112a46] dark:text-white border border-slate-200/50 dark:border-white/10 shadow-sm">
          <Clock className="w-3 h-3" /> 45 : 00
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10">
        <div className="text-[10px] font-bold text-slate-500 dark:text-[#8ba4b3] uppercase tracking-widest mb-2.5">
          {sermon.series || "STAND ALONE"}
        </div>
        
        <h3 className="text-[22px] md:text-[24px] font-serif mb-6 text-[#112a46] dark:text-white leading-[1.2] cursor-pointer hover:text-[#0284c7] dark:hover:text-[#85c9d8] transition-colors">
          {sermon.title}
        </h3>
        
        <div className="flex items-center justify-between text-[13px] font-medium text-slate-500 dark:text-[#648496] pt-5 mt-auto border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2 text-[#112a46] dark:text-[#8ba4b3]">
            <User className="w-[14px] h-[14px]" />
            {sermon.speaker}
          </div>
          <div>
            {sermon.date ? new Date(sermon.date).toLocaleDateString() : "No Date"}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function Sermons() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sermons = useQuery(api.sermons.getAll);

  return (
    <div className="max-w-[1400px] mx-auto px-1 sm:px-2 md:px-0 text-[#112a46] dark:text-white mb-20 animate-in fade-in duration-300 pt-2 w-full">
      
      <div className="flex flex-col mb-8 md:mb-10 w-full">
         <h1 className="text-[32px] md:text-[38px] font-serif text-[#112a46] dark:text-white tracking-tight leading-[1.1] mb-8">
            Sermon Library
         </h1>
         
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
               <button className="flex items-center justify-between min-w-[140px] bg-white dark:bg-[#081a30] border border-slate-200 dark:border-[#1a365d] px-4 py-2.5 rounded-xl text-[13.5px] font-medium text-[#112a46] dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm">
                  All Series <ChevronDown className="w-4 h-4 ml-3 text-slate-400 dark:text-[#648496]" />
               </button>
               <button className="flex items-center justify-between min-w-[140px] bg-white dark:bg-[#081a30] border border-slate-200 dark:border-[#1a365d] px-4 py-2.5 rounded-xl text-[13.5px] font-medium text-[#112a46] dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm">
                  All Speakers <ChevronDown className="w-4 h-4 ml-3 text-slate-400 dark:text-[#648496]" />
               </button>
               <button className="flex items-center justify-between min-w-[140px] bg-white dark:bg-[#081a30] border border-slate-200 dark:border-[#1a365d] px-4 py-2.5 rounded-xl text-[13.5px] font-medium text-[#112a46] dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm">
                  Recent First <ChevronDown className="w-4 h-4 ml-3 text-slate-400 dark:text-[#648496]" />
               </button>
            </div>
            
            <button 
               onClick={() => setIsModalOpen(true)}
               className="flex items-center justify-center gap-2 bg-[#288096] hover:bg-[#1f6374] dark:bg-[#346b85] dark:hover:bg-[#285b73] text-white px-5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-colors shadow-sm w-full sm:w-auto"
            >
               <Plus className="w-[18px] h-[18px]" /> Upload New Sermon
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
        {sermons === undefined ? (
          <div className="col-span-full flex justify-center py-20">
             <Loader2 className="w-10 h-10 animate-spin text-[#288096]" />
          </div>
        ) : sermons.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-500">
             No sermons found in the library.
          </div>
        ) : (
          sermons.map(sermon => (
            <SermonCard key={sermon._id} sermon={sermon} />
          ))
        )}
      </div>

      <div className="flex justify-center w-full">
         <button className="flex items-center gap-2 text-[14px] font-medium text-slate-500 hover:text-[#112a46] dark:text-[#8ba4b3] dark:hover:text-white transition-colors pb-1 border-b border-transparent hover:border-current">
            Load More Archives <ChevronDown className="w-4 h-4" />
         </button>
      </div>

      <CreateSermonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
