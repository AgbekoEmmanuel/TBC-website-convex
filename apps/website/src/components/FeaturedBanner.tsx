import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function FeaturedBanner() {
  const banners = useQuery(api.siteBanners.getAll);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance carousel every 6 seconds when multiple banners
  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners]);

  // Reset index if banners shrink
  useEffect(() => {
    if (banners && activeIndex >= banners.length) {
      setActiveIndex(0);
    }
  }, [banners, activeIndex]);

  if (!banners || banners.length === 0) return null;

  const current = banners[activeIndex];

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full py-12 px-4 sm:px-6"
      >
        {/* Section label */}
        <div className="max-w-5xl mx-auto mb-6 flex items-center gap-3">
          <div className="w-1 h-5 rounded-full bg-[#0284c7]" />
          <span className="text-sm font-bold uppercase tracking-widest text-[#0284c7]">Promotions</span>
        </div>

        {/* Banner card — width constrained, height natural to image */}
        <div className="max-w-5xl mx-auto">
          {/* Outer relative wrapper so nav arrows can be positioned */}
          <div className="relative group">
            {/* The card itself — no fixed height, no black bg */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-black/8">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current._id}
                  src={current.imageUrl}
                  alt={current.description || "Church Promotion Banner"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  // w-full makes it fill the card width; h-auto preserves natural aspect ratio
                  className="w-full h-auto block"
                />
              </AnimatePresence>

              {/* Description overlay — only if description exists */}
              {current.description && (
                <motion.div
                  key={`desc-${current._id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-5 pointer-events-none"
                >
                  <p className="text-white text-sm sm:text-base font-medium drop-shadow">
                    {current.description}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Navigation arrows — only shown when multiple banners, on hover */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={() => setActiveIndex((prev) => (prev - 1 + banners.length) % banners.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                  aria-label="Previous banner"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveIndex((prev) => (prev + 1) % banners.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                  aria-label="Next banner"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Dot indicators */}
          {banners.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-6 h-2 bg-[#0284c7]"
                      : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to banner ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
