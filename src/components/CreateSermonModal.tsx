import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, User, AlignLeft, Tag, Loader2, Image as ImageIcon, Video, Mic } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "../lib/utils";

import { Doc } from "../../convex/_generated/dataModel";

interface CreateSermonModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSermon?: Doc<"sermons">;
}

export function CreateSermonModal({ isOpen, onClose, initialSermon }: CreateSermonModalProps) {
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const createSermon = useMutation(api.sermons.create);
  const updateSermon = useMutation(api.sermons.update);

  const [title, setTitle] = useState("");
  const [series, setSeries] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form if initialSermon is provided
  useEffect(() => {
    if (initialSermon) {
      setTitle(initialSermon.title || "");
      setSeries(initialSermon.series || "");
      setSpeaker(initialSermon.speaker || "");
      setDate(initialSermon.date || "");
      setDescription(initialSermon.description || "");
      setVideoUrl(initialSermon.videoUrl || "");
      setAudioUrl(initialSermon.audioUrl || "");
      setImagePreview(initialSermon.thumbnailUrl || null);
    } else {
      // Reset form for creation
      setTitle("");
      setSeries("");
      setSpeaker("");
      setDate("");
      setDescription("");
      setVideoUrl("");
      setAudioUrl("");
      setImagePreview(null);
    }
  }, [initialSermon, isOpen]);

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
      let thumbnailStorageId = initialSermon?.thumbnailStorageId;
      
      if (imageFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        const { storageId } = await result.json();
        thumbnailStorageId = storageId;
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      if (initialSermon) {
        await updateSermon({
          id: initialSermon._id,
          title,
          slug,
          series,
          speaker,
          date,
          description,
          videoUrl,
          audioUrl,
          thumbnailStorageId,
          isPublished: initialSermon.isPublished,
        });
      } else {
        await createSermon({
          title,
          slug,
          series,
          speaker,
          date,
          description,
          videoUrl,
          audioUrl,
          thumbnailStorageId,
          isPublished: true,
        });
      }

      onClose();
      // Reset form
      if (!initialSermon) {
        setTitle("");
        setSeries("");
        setSpeaker("");
        setDate("");
        setDescription("");
        setVideoUrl("");
        setAudioUrl("");
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Failed to save sermon:", error);
      alert("Failed to save sermon. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#112a46]/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-serif font-semibold text-[#112a46]">{initialSermon ? "Edit Sermon" : "Upload New Sermon"}</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <form className="space-y-6" id="create-sermon-form" onSubmit={handleSubmit}>
            
            <div className="relative aspect-video w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-sm font-medium">Click to upload thumbnail</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full">Change Image</span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Sermon Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AlignLeft className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The Architecture of Grace" required className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#288096] focus:ring-1 focus:ring-[#288096] outline-none transition-shadow" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Speaker</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input type="text" value={speaker} onChange={(e) => setSpeaker(e.target.value)} placeholder="e.g. Apostle Michael Dadzie" required className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#288096] focus:ring-1 focus:ring-[#288096] outline-none transition-shadow" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Series</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-4 w-4 text-slate-400" />
                    </div>
                    <input type="text" value={series} onChange={(e) => setSeries(e.target.value)} placeholder="e.g. The Book of Romans" className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#288096] focus:ring-1 focus:ring-[#288096] outline-none transition-shadow" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Date Preached</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#288096] focus:ring-1 focus:ring-[#288096] outline-none transition-shadow" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief summary of the sermon..." rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#288096] focus:ring-1 focus:ring-[#288096] outline-none transition-shadow" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Video URL (YouTube/Vimeo)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Video className="h-4 w-4 text-slate-400" />
                    </div>
                    <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#288096] focus:ring-1 focus:ring-[#288096] outline-none transition-shadow" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Audio URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mic className="h-4 w-4 text-slate-400" />
                    </div>
                    <input type="url" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="https://..." className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#288096] focus:ring-1 focus:ring-[#288096] outline-none transition-shadow" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-[#f8fafc]">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" form="create-sermon-form" disabled={isSubmitting} className="px-6 py-2 text-sm font-bold text-white bg-[#288096] shadow-sm rounded-xl hover:bg-[#1f6374] transition-all flex items-center gap-2 disabled:bg-slate-400">
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? (initialSermon ? "Saving..." : "Uploading...") : (initialSermon ? "Save Changes" : "Publish Sermon")}
          </button>
        </div>
      </div>
    </div>
  );
}
