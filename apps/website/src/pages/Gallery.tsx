import { motion } from 'motion/react';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';

const categories = [
  "All",
  "Sunday service",
  "Midweek",
  "Anniversary",
  "Sports",
  "Worship night",
  "Midnight prayers",
  "Special programs"
];

const sundayModules = import.meta.glob('../assets/gallery/sunday/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });
const sundayPhotos = Object.values(sundayModules).map((src) => ({
  cat: "Sunday service",
  src: src as string,
  height: Math.random() > 0.5 ? "h-[450px]" : "h-[350px]"
}));

const sportsModules = import.meta.glob('../assets/gallery/sports/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });
const sportsPhotos = Object.values(sportsModules).map((src) => ({
  cat: "Sports",
  src: src as string,
  height: Math.random() > 0.5 ? "h-[450px]" : "h-[350px]"
}));

const specialProgramsModules = import.meta.glob('../assets/gallery/special programs/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });
const specialProgramsPhotos = Object.values(specialProgramsModules).map((src) => ({
  cat: "Special programs",
  src: src as string,
  height: Math.random() > 0.5 ? "h-[450px]" : "h-[350px]"
}));

// Static photos from assets
const staticPhotos = [
  ...sundayPhotos,
  ...sportsPhotos,
  ...specialProgramsPhotos,
];

export function FullGallery() {
  const [activeTab, setActiveTab] = useState("All");
  const dynamicPhotos = useQuery(api.gallery.list);

  if (dynamicPhotos === undefined) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#fcfcfc]">
        <div className="animate-pulse text-brand-900 font-serif text-xl">Loading Gallery...</div>
      </div>
    );
  }

  // Combine static and dynamic photos
  const allPhotos = [
    ...staticPhotos,
    ...dynamicPhotos.map((p, i) => ({
      cat: p.category,
      src: p.imageUrl,
      // Deterministic but random-looking height based on index
      height: i % 3 === 0 ? "h-[450px]" : i % 3 === 1 ? "h-[350px]" : "h-[400px]"
    }))
  ];

  const filteredPhotos = activeTab === "All" 
    ? allPhotos 
    : allPhotos.filter(p => p.cat === activeTab);

  return (
    <div className="w-full font-sans bg-[#fcfcfc] min-h-screen">
      
      {/* Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-brand-900 uppercase tracking-[0.2em] text-[10px] font-bold mb-4">
              Visual Archive
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-medium text-brand-900 leading-tight mb-8">
              The Balance <br className="hidden md:block"/>
              <span className="italic">Gallery.</span>
            </h1>
            <p className="text-gray-500 text-[16px] leading-relaxed max-w-2xl mx-auto">
              Moments of truth, connection, and grace captured within our community. Explore the visual history of our gatherings.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        
        {/* Categories / Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-full text-[12px] font-bold tracking-wide uppercase transition-all duration-300 ${
                activeTab === cat 
                  ? 'bg-brand-900 text-white shadow-md' 
                  : 'bg-white text-gray-500 border border-gray-100 hover:border-brand-900/30 hover:text-brand-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style simulated Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((photo, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              key={`${photo.src}-${i}`}
              className={`relative w-full rounded-2xl overflow-hidden group break-inside-avoid shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gray-100 ${photo.height}`}
            >
              <img 
                src={photo.src} 
                alt={photo.cat} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <p className="text-white font-serif text-xl">{photo.cat}</p>
                <div className="w-8 h-[2px] bg-accent-gold mt-3 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
           <div className="text-center py-20 text-gray-400">
             No photos found for this category.
           </div>
        )}

      </section>
    </div>
  );
}
