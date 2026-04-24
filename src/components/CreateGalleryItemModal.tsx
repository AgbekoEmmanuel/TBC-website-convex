import React, { useState, useEffect, useRef } from "react";
import { X, Tag, Loader2, Image as ImageIcon, Type, Trash2, Plus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "../lib/utils";

interface CreateGalleryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GALLERY_CATEGORIES = [
  "Sunday service",
  "Midweek",
  "Anniversary",
  "Sports",
  "Worship night",
  "Midnight prayers",
  "Special programs"
];

export function CreateGalleryItemModal({ isOpen, onClose }: CreateGalleryItemModalProps) {
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const createGalleryItem = useMutation(api.gallery.create);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(GALLERY_CATEGORIES[0]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setCategory(GALLERY_CATEGORIES[0]);
      setImageFiles([]);
      // Revoke all object URLs to prevent memory leaks
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews([]);
      setUploadProgress(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
        alert("Please select at least one image to upload");
        return;
    }
    setIsSubmitting(true);

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        setUploadProgress(Math.round(((i) / imageFiles.length) * 100));
        const file = imageFiles[i];
        
        try {
          const postUrl = await generateUploadUrl();
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          
          if (!result.ok) throw new Error(`Upload failed with status ${result.status}`);
          
          const { storageId } = await result.json();

          await createGalleryItem({
            title: title || undefined,
            category,
            imageStorageId: storageId,
          });
        } catch (err) {
          console.error(`Failed to upload image ${i + 1}:`, err);
          // If one fails, we can either continue or stop. 
          // For now, let's stop and alert which one failed.
          throw new Error(`Failed on image ${i + 1}: ${file.name}`);
        }
      }
      
      setUploadProgress(100);
      onClose();
    } catch (error: any) {
      console.error("Bulk upload failed:", error);
      alert(`Upload error: ${error.message || "Please try again."}`);
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
          <div>
            <h2 className="text-xl font-serif font-semibold text-[#112a46]">Bulk Upload Gallery</h2>
            {imageFiles.length > 0 && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{imageFiles.length} photos selected</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <form className="space-y-6" id="create-gallery-form" onSubmit={handleSubmit}>
            
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Select Photos</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={preview} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-[#288096] hover:text-[#288096] transition-all bg-slate-50"
                >
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Add More</span>
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" multiple className="hidden" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 text-slate-400" />
                  </div>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#288096] focus:ring-1 focus:ring-[#288096] outline-none transition-shadow appearance-none bg-white"
                  >
                    {GALLERY_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Common Title (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Type className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Sunday Morning Worship" 
                    className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#288096] focus:ring-1 focus:ring-[#288096] outline-none transition-shadow" 
                  />
                </div>
              </div>
            </div>

            {isSubmitting && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>Uploading photos...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#288096] transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-[#f8fafc]">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" form="create-gallery-form" disabled={isSubmitting || imageFiles.length === 0} className="px-6 py-2 text-sm font-bold text-white bg-[#288096] shadow-sm rounded-xl hover:bg-[#1f6374] transition-all flex items-center gap-2 disabled:bg-slate-400">
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Uploading..." : `Upload ${imageFiles.length} Photo${imageFiles.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

