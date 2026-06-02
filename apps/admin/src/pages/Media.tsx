import React, { useState } from "react";
import { Plus, Loader2, Trash2, Camera, Filter, Check, Square, Image as ImageIcon } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { cn } from "../lib/utils";
import { Doc } from "@convex/_generated/dataModel";
import { CreateGalleryItemModal } from "../components/CreateGalleryItemModal";
import { ManageBanner } from "../components/ManageBanner";

// --- Gallery Components ---

function GalleryCard({ 
  item, 
  isSelectionMode,
  isSelected,
  onToggleSelect,
  deleteStaticItems
}: { 
  item: Doc<"gallery">,
  isSelectionMode: boolean,
  isSelected: boolean,
  onToggleSelect: (id: string) => void,
  deleteStaticItems: (args: { ids: string[] }) => void
}) {
  const remove = useMutation(api.gallery.remove);
  
  return (
    <div 
      onClick={() => isSelectionMode && onToggleSelect(item._id)}
      className={cn(
        "group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#0a2239] border transition-all",
        isSelectionMode ? "cursor-pointer" : "",
        isSelected 
          ? "border-4 border-[#288096] scale-[0.98] shadow-md" 
          : "border-slate-200 dark:border-[#1a365d] hover:border-[#288096]/50"
      )}
    >
      <img src={item.imageUrl} alt={item.title || "Gallery Item"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      
      {isSelectionMode && (
        <div className="absolute top-3 left-3 z-20">
          <div className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm",
            isSelected ? "bg-[#288096] border-[#288096]" : "bg-black/20 border-white backdrop-blur-sm"
          )}>
            {isSelected && <Check className="w-4 h-4 text-white" />}
          </div>
        </div>
      )}

      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity flex flex-col justify-end p-4",
        isSelectionMode ? (isSelected ? "opacity-30" : "opacity-0") : "opacity-0 group-hover:opacity-100"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{item.category}</span>
            <span className="text-sm font-medium text-white truncate max-w-[150px]">{item.title || "Untitled"}</span>
          </div>
          {!isSelectionMode && (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if(confirm("Delete this photo?")) {
                  if (item._id.toString().startsWith('static-')) {
                    deleteStaticItems({ ids: [item._id] });
                  } else {
                    remove({ id: item._id as any }); 
                  }
                }
              }}
              className="p-2 rounded-full bg-red-500/20 hover:bg-red-500 text-white backdrop-blur-sm transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---

export function Media() {
  const [activeTab, setActiveTab] = useState<"Gallery" | "Banners">("Gallery");

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState("All");
  
  // Selection State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const galleryItems = useQuery(api.gallery.list);
  const removeMany = useMutation(api.gallery.removeMany);
  const deletedStaticIds = useQuery(api.gallery.getDeletedStaticIds);
  const deleteStaticItems = useMutation(api.gallery.deleteStaticItems);

  const GALLERY_CATEGORIES = [
    "All",
    "Sunday service",
    "Midweek",
    "Anniversary",
    "Sports",
    "Worship night",
    "Midnight prayers",
    "Special programs"
  ];

  // Static photos from local assets
  const sundayModules = import.meta.glob('../images/gallery/sunday/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });
  const sundayPhotos = Object.values(sundayModules).map((src, i) => ({
    _id: `static-sunday-${i}`,
    category: "Sunday service",
    imageUrl: src as string,
    title: "Static Asset"
  }));

  const sportsModules = import.meta.glob('../images/gallery/sports/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });
  const sportsPhotos = Object.values(sportsModules).map((src, i) => ({
    _id: `static-sports-${i}`,
    category: "Sports",
    imageUrl: src as string,
    title: "Static Asset"
  }));

  const specialModules = import.meta.glob('../images/gallery/special programs/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });
  const specialPhotos = Object.values(specialModules).map((src, i) => ({
    _id: `static-special-${i}`,
    category: "Special programs",
    imageUrl: src as string,
    title: "Static Asset"
  }));

  const allGalleryItems = [
    ...(galleryItems || []),
    ...sundayPhotos,
    ...sportsPhotos,
    ...specialPhotos,
  ].filter(item => !(deletedStaticIds || []).includes(item._id as string));

  const filteredGallery = allGalleryItems.filter(item => 
    galleryFilter === "All" || item.category === galleryFilter
  );

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
      if (newSelected.size === 0) {
        setIsSelectionMode(false);
      }
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleToggleSelectAll = () => {
    if (!filteredGallery) return;
    
    const allFilteredIds = filteredGallery.map(i => i._id);
    const allSelected = allFilteredIds.every(id => selectedIds.has(id));
    
    const newSelected = new Set(selectedIds);
    if (allSelected) {
      allFilteredIds.forEach(id => newSelected.delete(id));
      if (newSelected.size === 0) setIsSelectionMode(false);
    } else {
      allFilteredIds.forEach(id => newSelected.add(id));
      setIsSelectionMode(true);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected photos?`)) {
      const allSelected = Array.from(selectedIds);
      const staticIds = allSelected.filter(id => id.startsWith('static-'));
      const dbIds = allSelected.filter(id => !id.startsWith('static-'));
      
      if (dbIds.length > 0) {
        await removeMany({ ids: dbIds as any });
      }
      if (staticIds.length > 0) {
        await deleteStaticItems({ ids: staticIds });
      }
      
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-1 sm:px-2 md:px-0 text-[#112a46] dark:text-white mb-20 animate-in fade-in duration-300 pt-2 w-full">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-white/5 pb-5 mb-8 gap-4 w-full">
         <div>
            <h1 className="text-[32px] md:text-[38px] font-serif text-[#112a46] dark:text-white tracking-tight leading-[1.1] mb-2">
               Media Manager
            </h1>
            <p className="text-slate-500 dark:text-[#8ba4b3] text-sm font-medium">Manage your photo gallery and website banners.</p>
         </div>
         <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
           <button 
             onClick={() => setActiveTab("Gallery")}
             className={cn(
               "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all",
               activeTab === "Gallery" 
                 ? "bg-white text-[#112a46] shadow-sm dark:bg-[#103a64] dark:text-white" 
                 : "text-slate-500 hover:text-[#112a46] dark:text-[#8ba4b3] dark:hover:text-white"
             )}
           >
             <Camera className="w-4 h-4" /> Gallery
           </button>
           <button 
             onClick={() => setActiveTab("Banners")}
             className={cn(
               "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all",
               activeTab === "Banners" 
                 ? "bg-white text-[#112a46] shadow-sm dark:bg-[#103a64] dark:text-white" 
                 : "text-slate-500 hover:text-[#112a46] dark:text-[#8ba4b3] dark:hover:text-white"
             )}
           >
             <ImageIcon className="w-4 h-4" /> Banners
           </button>
         </div>
      </div>

      {activeTab === "Gallery" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                 <div className="flex items-center gap-2 text-slate-400 mr-2">
                   <Filter className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-wider">Filter:</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {GALLERY_CATEGORIES.map(cat => (
                     <button 
                      key={cat}
                      onClick={() => {
                        setGalleryFilter(cat);
                        if (isSelectionMode) {
                          setIsSelectionMode(false);
                          setSelectedIds(new Set());
                        }
                      }}
                      className={cn(
                        "px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap",
                        galleryFilter === cat 
                          ? "bg-[#288096] text-white border-[#288096] shadow-md"
                          : "bg-white dark:bg-[#081a30] text-slate-500 dark:text-[#648496] border-slate-200 dark:border-[#1a365d] hover:border-[#288096] hover:text-[#288096]"
                      )}
                     >
                       {cat}
                     </button>
                   ))}
                 </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full xl:w-auto">
                 {filteredGallery.length > 0 && (
                   <>
                     <button 
                       onClick={handleToggleSelectAll}
                       className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#081a30] dark:hover:bg-white/5 text-slate-600 dark:text-white px-3 py-2 rounded-xl text-[12px] font-bold transition-colors border border-slate-200 dark:border-[#1a365d] whitespace-nowrap"
                     >
                       <Square className="w-3.5 h-3.5" /> 
                       {filteredGallery.every(i => selectedIds.has(i._id)) ? "Deselect All" : "Select All"}
                     </button>
                     {selectedIds.size > 0 && (
                       <button 
                         onClick={handleDeleteSelected}
                         className="flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-[12px] font-bold transition-colors shadow-sm whitespace-nowrap"
                       >
                         <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedIds.size})
                       </button>
                     )}
                   </>
                 )}

                 <button 
                    onClick={() => setIsGalleryModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 bg-[#288096] hover:bg-[#1f6374] dark:bg-[#346b85] dark:hover:bg-[#285b73] text-white px-4 py-2 rounded-xl text-[12px] font-bold transition-colors shadow-sm whitespace-nowrap"
                 >
                    <Plus className="w-3.5 h-3.5" /> Add Photo
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full mb-12">
              {galleryItems === undefined ? (
                <div className="col-span-full flex justify-center py-20">
                   <Loader2 className="w-10 h-10 animate-spin text-[#288096]" />
                </div>
              ) : filteredGallery?.length === 0 ? (
                <div className="col-span-full text-center py-20 text-slate-500">
                   No photos found in this category.
                </div>
              ) : (
                filteredGallery?.map((item) => (
                  <GalleryCard 
                    key={item._id} 
                    item={item as any} 
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedIds.has(item._id)}
                    onToggleSelect={handleToggleSelect}
                    deleteStaticItems={deleteStaticItems}
                  />
                ))
              )}
            </div>
        </div>
      )}

      {activeTab === "Banners" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ManageBanner />
        </div>
      )}

      <CreateGalleryItemModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
      />
    </div>
  );
}
