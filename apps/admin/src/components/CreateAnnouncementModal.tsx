import React, { useState, useEffect } from "react";
import { X, AlignLeft, Loader2, Link as LinkIcon, MessageSquare } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

import { Doc } from "@convex/_generated/dataModel";

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAnnouncement?: Doc<"announcements">;
}

export function CreateAnnouncementModal({ isOpen, onClose, initialAnnouncement }: CreateAnnouncementModalProps) {
  const createAnnouncement = useMutation(api.announcements.create);
  const updateAnnouncement = useMutation(api.announcements.update);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form if initialAnnouncement is provided
  useEffect(() => {
    if (initialAnnouncement) {
      setTitle(initialAnnouncement.title || "");
      setBody(initialAnnouncement.body || "");
      setLinkUrl(initialAnnouncement.linkUrl || "");
      setLinkLabel(initialAnnouncement.linkLabel || "");
    } else {
      // Reset form for creation
      setTitle("");
      setBody("");
      setLinkUrl("");
      setLinkLabel("");
    }
  }, [initialAnnouncement, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialAnnouncement) {
        await updateAnnouncement({
          id: initialAnnouncement._id,
          title,
          body: body || undefined,
          linkUrl: linkUrl || undefined,
          linkLabel: linkLabel || undefined,
          isActive: initialAnnouncement.isActive,
        });
      } else {
        await createAnnouncement({
          title,
          body: body || undefined,
          linkUrl: linkUrl || undefined,
          linkLabel: linkLabel || undefined,
          isActive: false, // Default to inactive/draft
        });
      }

      onClose();
      // Reset form
      if (!initialAnnouncement) {
        setTitle("");
        setBody("");
        setLinkUrl("");
        setLinkLabel("");
      }
    } catch (error) {
      console.error("Failed to save announcement:", error);
      alert("Failed to save announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#112a46]/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-serif font-semibold text-[#112a46]">{initialAnnouncement ? "Edit Announcement" : "New Announcement"}</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-[#112a46]">
          <form className="space-y-6" id="create-announcement-form" onSubmit={handleSubmit}>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Headline</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AlignLeft className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Special Holiday Service" required className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1a365d] focus:ring-1 focus:ring-[#1a365d] outline-none transition-shadow" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Message Content</label>
                <div className="relative">
                   <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                     <MessageSquare className="h-4 w-4 text-slate-400" />
                   </div>
                   <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Enter the announcement details..." rows={4} className="w-full pl-10 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#1a365d] focus:ring-1 focus:ring-[#1a365d] outline-none transition-shadow" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Link URL (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1a365d] focus:ring-1 focus:ring-[#1a365d] outline-none transition-shadow" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Link Label (Optional)</label>
                  <input type="text" value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} placeholder="e.g. Register Now" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1a365d] focus:ring-1 focus:ring-[#1a365d] outline-none transition-shadow" />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-[#f8fafc]">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" form="create-announcement-form" disabled={isSubmitting} className="px-6 py-2 text-sm font-bold text-white bg-[#1a365d] shadow-sm rounded-xl hover:bg-[#112a46] transition-all flex items-center gap-2 disabled:bg-slate-400">
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? (initialAnnouncement ? "Saving..." : "Creating...") : (initialAnnouncement ? "Save Changes" : "Save Announcement")}
          </button>
        </div>
      </div>
    </div>
  );
}
