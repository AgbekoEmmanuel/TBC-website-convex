import React, { useState, useEffect } from "react";
import { 
  X, 
  Youtube, 
  Loader2, 
  Radio, 
  ImagePlus, 
  Trash2, 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  SlidersHorizontal,
  ExternalLink 
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id, Doc } from "@convex/_generated/dataModel";

interface LiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEventId?: string;
}

export function LiveStreamModal({ isOpen, onClose, initialEventId }: LiveStreamModalProps) {
  const currentLive = useQuery(api.liveStream.get);
  const events = useQuery(api.events.getAll);
  const updateLive = useMutation(api.liveStream.update);
  const endSessionMutation = useMutation(api.liveStream.endSession);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [isManualMode, setIsManualMode] = useState(false);
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);

  const [youtubeLink, setYoutubeLink] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [programType, setProgramType] = useState("");
  const [programName, setProgramName] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  // Group events into Upcoming and Past/Other
  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingEvents = events?.filter(e => !e.date || e.date >= todayStr) || [];
  const pastEvents = events?.filter(e => e.date && e.date < todayStr) || [];

  // Listen for custom open event with pre-selected event
  useEffect(() => {
    const handleCustomOpen = (e: any) => {
      const eventId = e.detail?.eventId;
      if (eventId) {
        setSelectedEventId(eventId);
        setIsManualMode(false);
      }
    };
    window.addEventListener("open-live-modal", handleCustomOpen);
    return () => window.removeEventListener("open-live-modal", handleCustomOpen);
  }, []);

  // Sync state when modal opens or current live stream changes
  useEffect(() => {
    if (!isOpen) return;

    if (initialEventId) {
      setSelectedEventId(initialEventId);
      setIsManualMode(false);
    } else if (currentLive) {
      setYoutubeLink(currentLive.youtubeLink || "");
      setIsLive(currentLive.isLive || false);
      setProgramType(currentLive.programType || "");
      setProgramName(currentLive.programName || "");
      setImagePreview(currentLive.imageUrl || "");

      if (currentLive.eventId) {
        setSelectedEventId(currentLive.eventId);
        setIsManualMode(false);
      } else if (currentLive.programName && events && events.length > 0) {
        const matched = events.find(e => e.title.toLowerCase() === currentLive.programName?.toLowerCase());
        if (matched) {
          setSelectedEventId(matched._id);
          setIsManualMode(false);
        } else if (currentLive.isLive) {
          setIsManualMode(true);
        }
      }
    }
  }, [currentLive, isOpen, initialEventId, events]);

  // When selectedEventId changes, populate details from that event
  const selectedEvent = events?.find(e => e._id === selectedEventId);

  const handleSelectProgram = (id: string) => {
    setSelectedEventId(id);
    if (!id || id === "custom") {
      setIsManualMode(true);
      return;
    }

    setIsManualMode(false);
    const ev = events?.find(e => e._id === id);
    if (ev) {
      setProgramName(ev.title);
      setProgramType(ev.category || "Special Program");
      setImagePreview(ev.imageUrl || "");
      setSelectedImage(null);
      if (ev.youtubeUrl && !youtubeLink) {
        setYoutubeLink(ev.youtubeUrl);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAndGoLive = async (targetLiveState: boolean) => {
    if (targetLiveState && !youtubeLink.trim()) {
      alert("Please provide a YouTube Live link before starting the stream.");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageStorageId = selectedImage 
        ? undefined 
        : (selectedEvent ? selectedEvent.imageStorageId : currentLive?.imageStorageId);
      
      let imageUrl = selectedImage 
        ? undefined 
        : (selectedEvent ? selectedEvent.imageUrl : (imagePreview || undefined));

      if (selectedImage) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });
        const { storageId } = await result.json();
        imageStorageId = storageId;
        imageUrl = undefined;
      }

      const finalName = isManualMode || showAdvancedEdit
        ? programName
        : (selectedEvent?.title || programName);

      const finalType = isManualMode || showAdvancedEdit
        ? programType
        : (selectedEvent?.category || programType);

      await updateLive({ 
        youtubeLink: youtubeLink.trim(), 
        isLive: targetLiveState,
        programType: finalType || undefined,
        programName: finalName || undefined,
        eventId: (!isManualMode && selectedEvent) ? (selectedEvent._id as Id<"events">) : undefined,
        imageStorageId,
        imageUrl,
      });

      setIsLive(targetLiveState);
      onClose();
    } catch (error: any) {
      console.error("Failed to update live stream:", error);
      alert(`Failed to update live stream settings. Error: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndSession = async () => {
    if (!confirm("Are you sure you want to end this session? This will take the stream offline and clear the current live configuration.")) return;
    setIsEnding(true);
    try {
      await endSessionMutation();
      setYoutubeLink("");
      setIsLive(false);
      setProgramType("");
      setProgramName("");
      setSelectedEventId("");
      setSelectedImage(null);
      setImagePreview("");
      setIsManualMode(false);
      setShowAdvancedEdit(false);
      onClose();
    } catch (error: any) {
      console.error("Failed to end session:", error);
      alert(`Failed to end session. Error: ${error.message || error}`);
    } finally {
      setIsEnding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-[#112a46]/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white dark:bg-[#07243c] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100 dark:border-white/10 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10 bg-white dark:bg-[#07243c]">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLive ? 'bg-red-500/10 text-red-600' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>
              <Radio className={`w-4 h-4 ${isLive ? 'animate-pulse text-red-600' : ''}`} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#112a46] dark:text-white leading-tight">Live Stream Broadcast</h2>
              <p className="text-[12px] text-slate-500 dark:text-slate-400">Stream programs directly to your website</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[calc(85vh-80px)] overflow-y-auto">
          {/* Status Indicator Bar */}
          <div className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
            isLive 
              ? 'bg-red-50/80 dark:bg-red-950/20 border-red-200 dark:border-red-900/40' 
              : 'bg-slate-50 dark:bg-white/5 border-slate-200/80 dark:border-white/10'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#112a46] dark:text-white">
                {isLive ? 'Stream is Currently LIVE on Website' : 'Stream is Offline'}
              </span>
            </div>
            {isLive && (
              <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-800">
                Broadcasting
              </span>
            )}
          </div>

          {/* Program Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide flex items-center justify-between">
              <span>Select Program to Broadcast</span>
              <span className="text-[11px] font-medium text-slate-400 normal-case">Pulls flyer & details automatically</span>
            </label>
            
            <div className="relative">
              <select
                value={isManualMode ? "custom" : selectedEventId}
                onChange={(e) => handleSelectProgram(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a2744] px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:border-[#1f4b73] focus:ring-1 focus:ring-[#1f4b73] outline-none transition-shadow pr-9"
              >
                <option value="">-- Choose an uploaded program from website --</option>
                
                {upcomingEvents.length > 0 && (
                  <optgroup label="Upcoming Programs">
                    {upcomingEvents.map((ev) => (
                      <option key={ev._id} value={ev._id}>
                        {ev.title} {ev.date ? `(${new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})` : ''} - {ev.category || 'Program'}
                      </option>
                    ))}
                  </optgroup>
                )}

                {pastEvents.length > 0 && (
                  <optgroup label="Recent / Past Programs">
                    {pastEvents.map((ev) => (
                      <option key={ev._id} value={ev._id}>
                        {ev.title} {ev.date ? `(${new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})` : ''} - {ev.category || 'Program'}
                      </option>
                    ))}
                  </optgroup>
                )}

                <option value="custom">✍️ Custom stream (Enter details manually)</option>
              </select>

              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <Sparkles className="w-4 h-4 text-brand-500" />
              </div>
            </div>
          </div>

          {/* Program Preview Card if a program is selected */}
          {!isManualMode && selectedEvent && (
            <div className="p-3.5 bg-gradient-to-br from-slate-50 to-slate-100/70 dark:from-white/5 dark:to-white/10 rounded-2xl border border-slate-200 dark:border-white/10 flex items-start sm:items-center gap-3.5 transition-all">
              {selectedEvent.imageUrl ? (
                <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-200/80 dark:border-white/10 bg-slate-900">
                  <img 
                    src={selectedEvent.imageUrl} 
                    alt={selectedEvent.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : (
                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-slate-200 dark:bg-white/10 flex flex-col items-center justify-center shrink-0 text-slate-400 gap-1 border border-slate-200 dark:border-white/5">
                  <CalendarDays className="w-6 h-6" />
                  <span className="text-[9px] uppercase font-bold">No Flyer</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {selectedEvent.category || "Program"}
                  </span>
                  {selectedEvent.date && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 inline" />
                      {new Date(selectedEvent.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      {selectedEvent.time ? ` • ${selectedEvent.time}` : ''}
                    </span>
                  )}
                </div>

                <h4 className="font-serif font-bold text-sm sm:text-base text-[#112a46] dark:text-white truncate">
                  {selectedEvent.title}
                </h4>

                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Flyer & program info populated automatically
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvancedEdit(!showAdvancedEdit)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors shrink-0 self-start sm:self-center"
                title="Customize details"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* YouTube Link Input - Prominent */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                YouTube Live URL <span className="text-red-500">*</span>
              </label>
              {selectedEvent?.youtubeUrl && selectedEvent.youtubeUrl !== youtubeLink && (
                <button
                  type="button"
                  onClick={() => setYoutubeLink(selectedEvent.youtubeUrl!)}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Use program's YouTube URL
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Youtube className="h-5 w-5 text-red-500" />
              </div>
              <input 
                type="url" 
                value={youtubeLink} 
                onChange={(e) => setYoutubeLink(e.target.value)} 
                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..." 
                required
                className="w-full pl-11 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a2744] px-3.5 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#1f4b73] focus:ring-2 focus:ring-[#1f4b73]/20 outline-none transition-all shadow-sm font-medium" 
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Paste the link to your YouTube live broadcast here. When live, visitors can watch directly on the website.
            </p>
          </div>

          {/* Advanced / Manual Details (shown if Manual Mode or toggled) */}
          {(isManualMode || showAdvancedEdit) && (
            <div className="p-4 bg-slate-50/70 dark:bg-white/5 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-white/10">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                  {isManualMode ? "Manual Stream Details" : "Custom Override"}
                </span>
                {!isManualMode && (
                  <button 
                    type="button" 
                    onClick={() => setShowAdvancedEdit(false)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    Hide
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Program Type</label>
                <select 
                  value={programType} 
                  onChange={(e) => setProgramType(e.target.value)} 
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a2744] px-3 py-2 text-sm text-slate-800 dark:text-white focus:border-[#1f4b73] outline-none" 
                >
                  <option value="">Select Program Type...</option>
                  <option value="Sunday Morning Gathering">Sunday Morning Gathering</option>
                  <option value="Mid-Week Service">Mid-Week Service</option>
                  <option value="Special Program">Special Program</option>
                  <option value="Prayer Intense">Prayer Intense</option>
                  <option value="Worship Night">Worship Night</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Program Name / Title</label>
                <input 
                  type="text" 
                  value={programName} 
                  onChange={(e) => setProgramName(e.target.value)} 
                  placeholder="e.g. Sunday Morning Gathering" 
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a2744] px-3 py-2 text-sm text-slate-800 dark:text-white focus:border-[#1f4b73] outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Custom Thumbnail / Flyer (Optional)</label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setSelectedImage(null);
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black/80"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-slate-200 dark:border-white/10 border-dashed rounded-xl cursor-pointer bg-white dark:bg-[#0a2744] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <ImagePlus className="w-5 h-5 text-slate-400" />
                        <span className="text-xs font-medium">Click to upload custom thumbnail</span>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-[#061d31]">
          <button
            type="button"
            disabled={isEnding || isSubmitting}
            onClick={handleEndSession}
            className="w-full sm:w-auto px-3.5 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isEnding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            End Session
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
            >
              Cancel
            </button>

            {isLive ? (
              <>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSaveAndGoLive(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 rounded-xl transition-all"
                >
                  Take Offline
                </button>
                <button 
                  type="button"
                  onClick={() => handleSaveAndGoLive(true)}
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1f4b73] hover:bg-[#153450] rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:bg-slate-400"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Update Stream
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSaveAndGoLive(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl transition-all"
                >
                  Save Offline
                </button>
                <button 
                  type="button"
                  onClick={() => handleSaveAndGoLive(true)}
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center gap-1.5 disabled:bg-slate-400"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Radio className="w-3.5 h-3.5" />}
                  Go Live Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
