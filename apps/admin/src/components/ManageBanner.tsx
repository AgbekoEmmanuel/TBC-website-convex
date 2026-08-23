import React, { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card } from "./ui/card";
import { ImageIcon, Upload, Trash2, Loader2, Plus, Image as LucideImage } from "lucide-react";
import { Id } from "@convex/_generated/dataModel";

const homepicsModules = import.meta.glob('../../../website/src/assets/homepics/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });
const staticHomepics = Object.values(homepicsModules).map((src, i) => ({
  _id: `static-homeHero-${i}`,
  imageUrl: src as string,
  description: "Static Asset",
  isStatic: true
}));


import yearThemeDefault from "../images/defaults/year_theme.jpeg";
import devotionDefault from "../images/defaults/congre3.jpg";
import mediaHeroDefault from "../images/defaults/media_bg_horizontal.jpg";
import libraryHeroDefault from "../images/defaults/wisdom arena.jpeg";

const FIXED_LOCATIONS = [
  { id: "yearTheme", label: "Home Page • Year Theme", desc: "The main year theme banner on the home page.", fallback: yearThemeDefault },
  { id: "devotion", label: "Home Page • Devotion Background", desc: "Background image for the devotion section.", fallback: devotionDefault },
  { id: "mediaHero", label: "Media Page • Media Hero Background", desc: "Hero background on the media page.", fallback: mediaHeroDefault },
  { id: "communityHero", label: "Communities Page • Hero Background", desc: "Hero background on the communities page.", fallback: "https://i.pinimg.com/1200x/85/cf/7b/85cf7b4993b6519887effa15951ca46b.jpg" },
  { id: "libraryHero", label: "Library Page • Wisdom Arena", desc: "Hero background for the Wisdom Arena.", fallback: libraryHeroDefault },
  { id: "aboutModels", label: "About Page • Models of Emphasis", desc: "Background for models of emphasis section.", fallback: null },
];

export function ManageBanner() {
  const banners = useQuery(api.siteBanners.getAll);
  const generateUploadUrl = useMutation(api.siteBanners.generateUploadUrl);
  const createBanner = useMutation(api.siteBanners.create);
  const removeBanner = useMutation(api.siteBanners.remove);
  const deletedStaticIds = useQuery(api.gallery.getDeletedStaticIds);
  const deleteStaticItems = useMutation(api.gallery.deleteStaticItems);


  // Promotional Banner Upload State
  const [isUploadingPromo, setIsUploadingPromo] = useState(false);
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fixed Banner Upload State
  const [uploadingFixedLocation, setUploadingFixedLocation] = useState<string | null>(null);
  const fixedFileInputRef = useRef<HTMLInputElement>(null);
  const [activeFixedLocation, setActiveFixedLocation] = useState<{loc: string, oldId?: Id<"siteBanners">} | null>(null);

  // Home Hero Banner Upload State
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const promotionalBanners = banners?.filter(b => b.location === "carousel" || !b.location) || [];
  const dynamicHeroBanners = banners?.filter(b => b.location === "homeHero") || [];
  
  const allHeroBanners = [
    ...dynamicHeroBanners,
    ...staticHomepics.filter(item => !(deletedStaticIds || []).includes(item._id))
  ];

  // Handlers for Promotional
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadPromo = async () => {
    if (!selectedFile) return;
    try {
      setIsUploadingPromo(true);
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
        location: "carousel",
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
      setIsUploadingPromo(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDescription("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id: Id<"siteBanners">) => {
    if (confirm("Remove this banner from the website?")) {
      await removeBanner({ id });
    }
  };

  const handleHeroFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploadingHero(true);
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      
      await createBanner({
        imageStorageId: storageId,
        location: "homeHero",
      });
    } catch (error) {
      console.error("Error uploading hero banner:", error);
      alert("Failed to upload hero banner");
    } finally {
      setIsUploadingHero(false);
      if (heroFileInputRef.current) heroFileInputRef.current.value = "";
    }
  };

  const handleDeleteHero = async (id: string, isStatic?: boolean) => {
    if (confirm("Remove this hero banner from the website?")) {
      if (isStatic) {
        await deleteStaticItems({ ids: [id] });
      } else {
        await removeBanner({ id: id as Id<"siteBanners"> });
      }
    }
  };


  // Handlers for Fixed Banners
  const handleFixedFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeFixedLocation) return;
    
    try {
      setUploadingFixedLocation(activeFixedLocation.loc);
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      
      await createBanner({
        imageStorageId: storageId,
        location: activeFixedLocation.loc,
      });

      if (activeFixedLocation.oldId) {
        await removeBanner({ id: activeFixedLocation.oldId });
      }
    } catch (error) {
      console.error("Error replacing banner:", error);
      alert("Failed to replace banner image");
    } finally {
      setUploadingFixedLocation(null);
      setActiveFixedLocation(null);
      if (fixedFileInputRef.current) fixedFileInputRef.current.value = "";
    }
  };

  const triggerFixedUpload = (loc: string, oldId?: Id<"siteBanners">) => {
    setActiveFixedLocation({ loc, oldId });
    fixedFileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Hidden file input for fixed banners */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fixedFileInputRef}
        onChange={handleFixedFileSelect}
      />

      {/* Promotional Banners */}
      <Card className="flex flex-col dark:bg-[#0a2744]/40 dark:backdrop-blur-xl bg-white shadow-sm border border-slate-100 dark:border-white/5 rounded-[24px] p-6 lg:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-white/5 pb-5">
          <div>
            <h3 className="text-[20px] font-serif font-bold text-[#112a46] dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#0284c7] dark:text-[#85c9d8]" />
              Promotional Banners
              {banners !== undefined && (
                <span className="text-sm font-normal text-slate-500 dark:text-[#8ba4b3] ml-1">({promotionalBanners.length})</span>
              )}
            </h3>
            <p className="text-sm text-slate-500 dark:text-[#8ba4b3] mt-1">
              Add multiple promotional banners for the scrolling carousel.
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-[#1f4b73] hover:bg-[#153450] text-white dark:bg-[#346b85] dark:hover:bg-[#285b73] px-5 py-2.5 text-[14px] rounded-xl font-semibold transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Promotional Banner
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
            <p className="text-sm font-semibold text-[#112a46] dark:text-white mb-3">New Promotional Banner</p>
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full md:w-64 rounded-xl object-contain bg-black/10 max-h-40"
              />
              <div className="flex flex-col gap-3 flex-1 justify-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-[#8ba4b3] mb-1.5 uppercase tracking-wider">
                    Description <span className="text-slate-400 font-normal normal-case">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Join us this June..."
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-[#112a46] dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/40 resize-none"
                  />
                </div>
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={handleUploadPromo}
                    disabled={isUploadingPromo}
                    className="flex items-center gap-2 bg-[#1f4b73] hover:bg-[#153450] text-white px-5 py-2 text-sm rounded-xl font-semibold transition-colors disabled:opacity-60"
                  >
                    {isUploadingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploadingPromo ? "Uploading..." : "Upload Banner"}
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

        {/* Promotional Banners list */}
        <div className="space-y-3">
          {banners === undefined ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : promotionalBanners.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center text-slate-400 py-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 cursor-pointer hover:border-[#0284c7]/50 hover:text-[#0284c7] dark:hover:border-[#85c9d8]/50 dark:hover:text-[#85c9d8] transition-colors"
            >
              <ImageIcon className="w-10 h-10 mb-3 opacity-50" />
              <p className="text-sm font-medium">No promotional banners yet — click to add one</p>
            </div>
          ) : (
            promotionalBanners.map((banner) => (
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
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-slate-400 dark:text-[#648496]">
                      Added {new Date(banner._creationTime).toLocaleDateString()}
                    </span>
                  </div>
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

      {/* Home Hero Banners */}
      <Card className="flex flex-col dark:bg-[#0a2744]/40 dark:backdrop-blur-xl bg-white shadow-sm border border-slate-100 dark:border-white/5 rounded-[24px] p-6 lg:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-white/5 pb-5">
          <div>
            <h3 className="text-[20px] font-serif font-bold text-[#112a46] dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#0284c7] dark:text-[#85c9d8]" />
              Home Hero Backgrounds
              {banners !== undefined && deletedStaticIds !== undefined && (
                <span className="text-sm font-normal text-slate-500 dark:text-[#8ba4b3] ml-1">({allHeroBanners.length})</span>
              )}
            </h3>
            <p className="text-sm text-slate-500 dark:text-[#8ba4b3] mt-1">
              Manage the slideshow backgrounds for the "Dome of Excellence" hero section.
            </p>
          </div>
          <button
            onClick={() => heroFileInputRef.current?.click()}
            disabled={isUploadingHero}
            className="flex items-center gap-2 bg-[#1f4b73] hover:bg-[#153450] text-white dark:bg-[#346b85] dark:hover:bg-[#285b73] px-5 py-2.5 text-[14px] rounded-xl font-semibold transition-colors shadow-sm whitespace-nowrap disabled:opacity-60"
          >
            {isUploadingHero ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} 
            {isUploadingHero ? "Uploading..." : "Add Hero Background"}
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={heroFileInputRef}
            onChange={handleHeroFileSelect}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {banners === undefined || deletedStaticIds === undefined ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : allHeroBanners.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 py-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10">
              <ImageIcon className="w-10 h-10 mb-3 opacity-50 mx-auto" />
              <p className="text-sm font-medium">No hero backgrounds yet</p>
            </div>
          ) : (
            allHeroBanners.map((banner) => (
              <div key={banner._id} className="relative aspect-video rounded-xl overflow-hidden group border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/20">
                <img
                  src={banner.imageUrl}
                  alt="Hero Background"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                      {('isStatic' in banner) ? "Static Asset" : "Uploaded"}
                    </span>
                    <button
                      onClick={() => handleDeleteHero(banner._id as string, ('isStatic' in banner))}
                      className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors"
                      title="Delete banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Fixed Locations */}
      <Card className="flex flex-col dark:bg-[#0a2744]/40 dark:backdrop-blur-xl bg-white shadow-sm border border-slate-100 dark:border-white/5 rounded-[24px] p-6 lg:p-8">
        <div className="mb-6 border-b border-slate-200 dark:border-white/5 pb-5">
          <h3 className="text-[20px] font-serif font-bold text-[#112a46] dark:text-white flex items-center gap-2">
            <LucideImage className="w-5 h-5 text-[#0284c7] dark:text-[#85c9d8]" />
            Website Page Backgrounds
          </h3>
          <p className="text-sm text-slate-500 dark:text-[#8ba4b3] mt-1">
            Edit specific background images and fixed banners across the website. 
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {FIXED_LOCATIONS.map((loc) => {
            const currentBanner = banners?.find(b => b.location === loc.id);
            const isUploading = uploadingFixedLocation === loc.id;
            
            return (
              <div key={loc.id} className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden group">
                <div className="h-40 bg-slate-100 dark:bg-black/30 relative overflow-hidden">
                  {currentBanner || loc.fallback ? (
                    <img src={currentBanner ? currentBanner.imageUrl : loc.fallback!} alt={loc.label} className="w-full h-full object-cover" />
                  ) : loc.id === "aboutModels" ? (
                    <div className="w-full h-full bg-gradient-to-br from-[#120822] via-[#21113b] to-[#3a1a40] flex items-center justify-center">
                       <span className="text-white/30 text-[11px] font-bold tracking-widest uppercase">Default Gradient</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <LucideImage className="w-8 h-8 text-slate-300 dark:text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      disabled={isUploading}
                      onClick={() => triggerFixedUpload(loc.id, currentBanner?._id)}
                      className="bg-white text-[#112a46] px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isUploading ? "Uploading..." : currentBanner ? "Replace Image" : "Upload Image"}
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-[#0a2744]/40 flex-1">
                  <h4 className="text-[13px] font-bold text-[#112a46] dark:text-white uppercase tracking-wider mb-1">{loc.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-[#8ba4b3]">{loc.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
}
