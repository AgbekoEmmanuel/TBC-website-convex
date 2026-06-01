import React, { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card } from "./ui/card";
import { ImageIcon, Upload, Trash2, Loader2, Plus } from "lucide-react";
import { Id } from "@convex/_generated/dataModel";

export function ManageBanner() {
  const banners = useQuery(api.siteBanners.getAll);
  const generateUploadUrl = useMutation(api.siteBanners.generateUploadUrl);
  const createBanner = useMutation(api.siteBanners.create);
  const removeBanner = useMutation(api.siteBanners.remove);

  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      const { storageId } = await result.json();
      await createBanner({
        imageStorageId: storageId,
        description: description.trim() || undefined,
      });
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading banner:", error);
      alert("Failed to upload banner image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: Id<"siteBanners">) => {
    if (confirm("Remove this banner from the website?")) {
      await removeBanner({ id });
    }
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDescription("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card className="flex flex-col dark:bg-[#0a2744]/40 dark:backdrop-blur-xl bg-white shadow-sm border border-slate-100 dark:border-white/5 rounded-[24px] p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-white/5 pb-5">
        <div>
          <h3 className="text-[20px] font-serif font-bold text-[#112a46] dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#0284c7] dark:text-[#85c9d8]" />
            Website Banners
            {banners !== undefined && (
              <span className="text-sm font-normal text-slate-500 dark:text-[#8ba4b3] ml-1">({banners.length} banner{banners.length !== 1 ? "s" : ""})</span>
            )}
          </h3>
          <p className="text-sm text-slate-500 dark:text-[#8ba4b3] mt-1">
            Upload banners to display at the bottom of the website. All banners are shown.
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-[#1f4b73] hover:bg-[#153450] text-white dark:bg-[#346b85] dark:hover:bg-[#285b73] px-5 py-2.5 text-[14px] rounded-xl font-semibold transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
      </div>

      {/* Upload preview panel */}
      {previewUrl && (
        <div className="mb-6 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/10">
          <p className="text-sm font-semibold text-[#112a46] dark:text-white mb-3">New Banner Preview</p>
          <div className="flex flex-col md:flex-row gap-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full md:w-64 rounded-xl object-contain bg-black/10 max-h-40"
            />
            <div className="flex flex-col gap-3 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-[#8ba4b3] mb-1.5 uppercase tracking-wider">
                  Description <span className="text-slate-400 font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Sunday Service — June 8th, 2026"
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-[#112a46] dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/40 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex items-center gap-2 bg-[#1f4b73] hover:bg-[#153450] text-white px-5 py-2 text-sm rounded-xl font-semibold transition-colors disabled:opacity-60"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploading ? "Uploading..." : "Upload Banner"}
                </button>
                <button
                  onClick={handleClearSelection}
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-[#8ba4b3] dark:hover:text-white border border-slate-200 dark:border-white/10 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banners list */}
      <div className="space-y-3">
        {banners === undefined ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : banners.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center text-slate-400 py-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 cursor-pointer hover:border-[#0284c7]/50 hover:text-[#0284c7] dark:hover:border-[#85c9d8]/50 dark:hover:text-[#85c9d8] transition-colors"
          >
            <ImageIcon className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-sm font-medium">No banners yet — click to add one</p>
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner._id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/10 group"
            >
              <img
                src={banner.imageUrl}
                alt="Banner"
                className="w-full sm:w-32 h-20 object-contain rounded-xl bg-black/10 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                {banner.description ? (
                  <p className="text-sm text-[#112a46] dark:text-white font-medium line-clamp-2">{banner.description}</p>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-[#8ba4b3] italic">No description</p>
                )}
                <p className="text-xs text-slate-400 dark:text-[#648496] mt-1">
                  Added {new Date(banner._creationTime).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(banner._id)}
                className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Delete banner"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
