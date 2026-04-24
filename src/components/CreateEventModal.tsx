import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, Clock, MapPin, AlignLeft, Tag, RefreshCw, Loader2, Image as ImageIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "../lib/utils";

import { Doc } from "../../convex/_generated/dataModel";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEvent?: Doc<"events">;
}

export function CreateEventModal({ isOpen, onClose, initialEvent }: CreateEventModalProps) {
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const createEvent = useMutation(api.events.create);
  const updateEvent = useMutation(api.events.update);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("sunday");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState('weekly');
  const [endType, setEndType] = useState('never');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form if initialEvent is provided
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || "");
      setCategory(initialEvent.category || "sunday");
      setLocation(initialEvent.location || "");
      setDate(initialEvent.date || "");
      setTime(initialEvent.time || "");
      setDescription(initialEvent.description || "");
      setImagePreview(initialEvent.imageUrl || null);
    } else {
      // Reset form for creation
      setTitle("");
      setCategory("sunday");
      setLocation("");
      setDate("");
      setTime("");
      setDescription("");
      setImagePreview(null);
    }
  }, [initialEvent, isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageStorageId = initialEvent?.imageStorageId;
      
      if (imageFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        const { storageId } = await result.json();
        imageStorageId = storageId;
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      if (initialEvent) {
        await updateEvent({
          id: initialEvent._id,
          title,
          slug,
          category,
          location,
          date,
          time,
          description,
          imageStorageId,
          isFeatured: initialEvent.isFeatured,
          isPublished: initialEvent.isPublished,
        });
      } else {
        await createEvent({
          title,
          slug,
          category,
          location,
          date,
          time,
          description,
          imageStorageId,
          isFeatured: false,
          isPublished: true,
        });
      }

      onClose();
      // Reset form
      if (!initialEvent) {
        setTitle("");
        setCategory("sunday");
        setLocation("");
        setDate("");
        setTime("");
        setDescription("");
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Failed to save event:", error);
      alert("Failed to save event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#112a46]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-serif font-semibold text-[#112a46]">{initialEvent ? "Edit Event" : "Create New Event"}</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 -mr-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <form className="space-y-6" id="create-event-form" onSubmit={handleSubmit}>
            
            {/* Image Preview / Upload */}
            <div 
              className="relative aspect-video w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-sm font-medium">Click to upload cover image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full">Change Image</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Event Title</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <AlignLeft className="h-4 w-4 text-slate-400" />
                   </div>
                   <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Sunday Morning Worship" 
                      required 
                      className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1f4b73] focus:ring-1 focus:ring-[#1f4b73] outline-none transition-shadow" 
                   />
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell people more about this event..." 
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#1f4b73] focus:ring-1 focus:ring-[#1f4b73] outline-none transition-shadow"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Tag className="h-4 w-4 text-slate-400" />
                     </div>
                     <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1f4b73] focus:ring-1 focus:ring-[#1f4b73] outline-none transition-shadow bg-white pb-[11px] pt-[11px] appearance-none"
                     >
                        <option value="sunday">Sunday</option>
                        <option value="midweek">Midweek</option>
                        <option value="prayers">Prayers</option>
                        <option value="special">Special Programs</option>
                     </select>
                   </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Location</label>
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <MapPin className="h-4 w-4 text-slate-400" />
                     </div>
                     <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Main Sanctuary" 
                        className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1f4b73] focus:ring-1 focus:ring-[#1f4b73] outline-none transition-shadow" 
                     />
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Date</label>
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Calendar className="h-4 w-4 text-slate-400" />
                     </div>
                     <input 
                        type="date" 
                        required 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1f4b73] focus:ring-1 focus:ring-[#1f4b73] outline-none transition-shadow" 
                     />
                   </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Start Time</label>
                     <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <Clock className="h-4 w-4 text-slate-400" />
                       </div>
                       <input 
                          type="time" 
                          required 
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1f4b73] focus:ring-1 focus:ring-[#1f4b73] outline-none transition-shadow" 
                       />
                     </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Recurrence Section (kept visual only as requested to not touch UI too much) */}
            <div>
               <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-blue-600" />
                   </div>
                   <label htmlFor="recurring" className="flex-1 flex items-center cursor-pointer">
                     <input
                       type="checkbox"
                       id="recurring"
                       checked={isRecurring}
                       onChange={(e) => setIsRecurring(e.target.checked)}
                       className="w-5 h-5 rounded border-slate-300 text-[#1f4b73] focus:ring-[#1f4b73] mr-3"
                     />
                     <div className="flex flex-col">
                        <span className="text-base font-semibold text-[#112a46]">Repeating Event</span>
                        <span className="text-xs text-slate-500 font-medium">Set a regular schedule for this activity</span>
                     </div>
                   </label>
               </div>

               {isRecurring && (
                 <div className="bg-[#f8fafc] p-5 rounded-2xl border border-slate-100 space-y-5 animate-in slide-in-from-top-2 duration-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Frequency</label>
                      <div className="grid grid-cols-4 gap-2">
                         {['daily', 'weekly', 'monthly', 'yearly'].map((type) => (
                           <button
                             key={type}
                             type="button"
                             onClick={() => setRecurrenceType(type)}
                             className={cn(
                               "py-2 px-3 text-sm font-medium rounded-xl border transition-colors capitalize",
                               recurrenceType === type 
                                 ? "bg-[#112a46] border-[#112a46] text-white" 
                                 : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                             )}
                           >
                              {type}
                           </button>
                         ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">End Condition</label>
                      <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input type="radio" name="endType" value="never" checked={endType === 'never'} onChange={() => setEndType('never')} className="w-4 h-4 text-[#1f4b73] focus:ring-[#1f4b73] border-slate-300" />
                           <span className="text-sm font-medium text-slate-700 group-hover:text-[#112a46]">Never ends</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input type="radio" name="endType" value="date" checked={endType === 'date'} onChange={() => setEndType('date')} className="w-4 h-4 text-[#1f4b73] focus:ring-[#1f4b73] border-slate-300" />
                           <span className="text-sm font-medium text-slate-700 w-20 group-hover:text-[#112a46]">On date</span>
                           <input type="date" disabled={endType !== 'date'} className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-[#1f4b73] focus:ring-1 focus:ring-[#1f4b73] disabled:opacity-50 disabled:bg-slate-50 transition-colors" />
                        </label>
                      </div>
                    </div>
                 </div>
               )}
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-[#f8fafc]">
           <button 
             type="button"
             onClick={onClose} 
             disabled={isSubmitting}
             className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 outline-none transition-all disabled:opacity-50"
           >
             Cancel
           </button>
           <button 
             type="submit"
             form="create-event-form"
             disabled={isSubmitting}
             className="px-6 py-2 text-sm font-bold text-white bg-[#1f4b73] shadow-sm rounded-xl hover:bg-[#153450] focus:ring-2 focus:ring-[#1f4b73] focus:ring-offset-2 outline-none transition-all flex items-center gap-2 disabled:bg-slate-400"
           >
             {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
             {isSubmitting ? (initialEvent ? "Saving..." : "Creating...") : (initialEvent ? "Save Changes" : "Publish Event")}
           </button>
        </div>

      </div>
    </div>
  );
}
