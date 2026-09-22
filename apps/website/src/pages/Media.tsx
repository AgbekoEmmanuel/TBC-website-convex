import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowRight, Mic, MessageSquare, PlayCircle, Circle } from 'lucide-react';
import mediaBg1 from '../assets/media_bg_horizontal.jpg';
import mediaBg2 from '../assets/media_bg2_horizontal.jpg';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

const heroImages = [mediaBg1, mediaBg2];

const sundayModules = import.meta.glob('../assets/gallery/sunday/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });
const rawSundayPhotos = Object.entries(sundayModules).map(([path, url], i) => ({
  _id: `static-sunday-${i}`,
  url: url as string
}));

const fadeInVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function Media() {
  const banners = useQuery(api.siteBanners.getAll);
  const mediaHeroBanners = banners?.filter(b => b.location === 'mediaHero').map(b => b.imageUrl);
  const activeHeroImages = mediaHeroBanners?.length ? mediaHeroBanners : heroImages;

  const [currentIdx, setCurrentIdx] = useState(0);
  const recentMessages = useQuery(api.events.getRecentPast);
  const isLoading = recentMessages === undefined;
  const deletedStaticIds = useQuery(api.gallery.getDeletedStaticIds) || [];
  
  const sundayPhotos = rawSundayPhotos
    .filter(p => !deletedStaticIds.includes(p._id))
    .map(p => p.url);

  const liveStream = useQuery(api.liveStream.get);
  const isLive = liveStream?.isLive && liveStream?.youtubeLink;

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = liveStream?.youtubeLink ? getYouTubeID(liveStream.youtubeLink) : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeHeroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeHeroImages.length]);

  return (
    <div className="w-full font-sans">

      {/* 1. Hero Section */}
      <section className="relative w-full overflow-hidden bg-brand-900 pt-32 pb-40 md:pt-40 md:pb-48">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              src={activeHeroImages[currentIdx % activeHeroImages.length]}
              alt="Background"
              className="absolute inset-0 m-auto w-full md:w-[85%] h-[80%] md:h-full object-cover mix-blend-overlay opacity-[0.65]"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 95%)',
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 95%)'
              }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-br from-[#06102b]/95 via-brand-900/80 to-[#020510]/95 pointer-events-none" />
          {/* Subtle light leak effect */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-start justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-accent-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
              Current Series
            </p>
            <h1 className="font-serif text-6xl md:text-[80px] font-medium text-white leading-[1.1] mb-2">
              The Balance<br />
              <span className="italic text-accent-gold">Media.</span>
            </h1>
            <p className="text-blue-100/80 text-[15px] leading-relaxed max-w-sm mt-8 mb-10">
              Join us from anywhere around the world. We would love to have you worship with us. <br />Tune in now to watch our latest sermons or our live streams.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => document.getElementById('live')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-link-blue hover:bg-blue-700 text-white px-8 py-3.5 rounded text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-colors shadow-lg"
              >
                <PlayCircle size={16} /> Watch Latest Sermon
              </button>
              <a 
                href="https://www.youtube.com/@ApostleMichaelDadzie"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-3.5 rounded text-[11px] font-bold tracking-widest uppercase flex items-center justify-center transition-all"
              >
                Browse Series
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Real Time Stream Section */}
      <section id="live" className="bg-[#fcfcfc] py-24 md:py-32 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <motion.div variants={fadeInVariants} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <p className="text-link-blue uppercase tracking-[0.2em] text-[10px] font-bold mb-3">Real Time</p>
              <h2 className="font-serif text-4xl md:text-5xl text-brand-900 leading-tight">
                {isLive ? "Experience Worship Now." : "Experience Church Anywhere."}
              </h2>
            </motion.div>
            <motion.div
              variants={fadeInVariants} initial="initial" whileInView="animate" viewport={{ once: true }}
              className={`${isLive ? 'bg-red-50 text-red-600 border-red-100' : 'bg-[#fff0f2] text-[#e11d48] border-[#ffe4e6]'} px-4 py-2 rounded-full flex items-center gap-2 w-fit h-fit border transition-colors`}
            >
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-600 animate-pulse' : 'bg-[#e11d48]'}`} />
              <span className="text-[10px] uppercase tracking-widest font-bold">
                {isLive ? "Live Now" : "Next Live: Sunday 9:00 AM"}
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`w-full ${liveStream?.imageUrl ? '' : 'aspect-video'} bg-brand-900 rounded-[24px] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.1)] group flex items-center justify-center`}
          >
            {isLive && videoId ? (
              <a
                href={liveStream.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`${liveStream.imageUrl ? 'relative block w-full' : 'absolute inset-0 block w-full h-full'} group overflow-hidden`}
              >
                {liveStream.imageUrl ? (
                  <>
                    {/* Custom flyer — show full image */}
                    <img 
                      src={liveStream.imageUrl}
                      alt="Live Stream"
                      className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700"
                    />
                    {/* Centered play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FF0000]/90 group-hover:bg-[#FF0000] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,0,0,0.5)] group-hover:scale-110 transition-all duration-300">
                        <Play className="text-white ml-1.5" size={40} fill="currentColor" />
                      </div>
                    </div>
                    {/* Bottom overlay bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-6 sm:px-10 py-5 sm:py-6">
                      <p className="text-white/90 uppercase tracking-[0.15em] text-[9px] font-bold mb-1">{liveStream.programType || "Streaming on YouTube"}</p>
                      <p className="text-white font-serif text-xl sm:text-2xl drop-shadow-md">{liveStream.programName || "Sunday Morning Gathering"}</p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* YouTube thumbnail fallback */}
                    <img 
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt="Live Stream"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-900/40 backdrop-blur-[2px] group-hover:bg-brand-900/20 transition-all">
                      <div className="relative z-10 w-24 h-24 bg-[#FF0000] rounded-full flex items-center justify-center border border-white/10 mb-6 shadow-[0_0_30px_rgba(255,0,0,0.4)] group-hover:scale-110 transition-transform">
                        <Play className="text-white ml-2" size={48} fill="currentColor" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-white font-serif text-3xl tracking-tight opacity-100 drop-shadow-md">Watch Live on YouTube</p>
                      </div>
                    </div>
                    {/* Overlay Text */}
                    <div className="absolute bottom-10 left-10 z-10">
                      <p className="text-white/90 uppercase tracking-[0.15em] text-[9px] font-bold mb-2">{liveStream.programType || "Streaming on YouTube"}</p>
                      <p className="text-white font-serif text-2xl drop-shadow-md">{liveStream.programName || "Sunday Morning Gathering"}</p>
                    </div>
                  </>
                )}
              </a>
            ) : (
              <>
                {/* Mockup / Offline State */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-900/40 backdrop-blur-[2px]">
                  <div className="relative z-10 w-24 h-24 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 mb-6">
                    <PlayCircle className="text-white/20" size={48} />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-white font-serif text-2xl tracking-tight opacity-90">No Live Stream Currently</p>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Join us Sunday mornings at 9:00 AM</p>
                  </div>
                </div>

                {/* Overlay Text */}
                <div className="absolute bottom-10 left-10 z-10">
                  <p className="text-white/70 uppercase tracking-[0.15em] text-[9px] font-bold mb-2">Streaming on YouTube</p>
                  <p className="text-white font-serif text-2xl">Sunday Morning Gathering</p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* 3. Recent Messages Section */}
      <section id="recent-messages" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-4">
            <h2 className="font-serif text-[32px] text-brand-900">Recent Messages</h2>
            <a href="https://www.youtube.com/@ApostleMichaelDadzie" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-900 text-[10px] tracking-widest uppercase font-bold border-b border-transparent hover:border-brand-900 transition-colors pb-1">
              View All YouTube
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-gray-50 rounded-xl animate-pulse" />
              ))
            ) : recentMessages.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-serif italic text-lg">
                  No recent messages. Stay tuned.
                </p>
              </div>
            ) : (
              recentMessages.map((msg, idx) => {
                const hasYouTube = !!msg.youtubeUrl;
                const CardWrapper = hasYouTube ? 'a' : 'div';
                const wrapperProps = hasYouTube
                  ? { href: msg.youtubeUrl, target: "_blank", rel: "noopener noreferrer" }
                  : {};

                return (
                  <motion.div
                    key={msg._id}
                    variants={fadeInVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * (idx + 1), duration: 0.6 }}
                  >
                    <CardWrapper
                      {...wrapperProps as any}
                      className="group cursor-pointer block"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-5 bg-gray-100">
                        <img
                          src={msg.imageUrl || "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=800"}
                          alt={msg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        {hasYouTube && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-300">
                            <div className="w-14 h-14 bg-[#FF0000]/90 group-hover:bg-[#FF0000] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.3)] group-hover:scale-110 transition-all duration-300">
                              <Play className="text-white ml-1" size={24} fill="currentColor" />
                            </div>
                          </div>
                        )}
                        {msg.time && (
                          <div className="absolute bottom-3 right-3 bg-link-blue text-white text-[10px] font-bold px-2 py-1 rounded">
                            {msg.time}
                          </div>
                        )}
                      </div>
                      <h3 className="font-serif text-[#0f172a] text-xl mb-2 group-hover:text-link-blue transition-colors">{msg.title}</h3>
                      <p className="text-[12px] text-gray-500">
                        {msg.date ? new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Date TBA"} {msg.location ? `• ${msg.location}` : ""}
                        {hasYouTube && <span className="ml-2 text-[#FF0000] font-bold">▶ Watch on YouTube</span>}
                      </p>
                    </CardWrapper>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* 4. Podcasts Section */}
      <section id="podcasts" className="bg-[#f2f0ec] py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <img
              src="https://plus.unsplash.com/premium_photo-1664195074956-186ba8cd49d4?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Microphone"
              className="w-full aspect-square rounded-[32px] object-cover shadow-[4px_16px_40px_rgba(0,0,0,0.1)]"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <p className="text-link-blue uppercase tracking-[0.2em] text-[10px] font-bold mb-4">
              Audio Sanctuary
            </p>
            <h2 className="font-serif text-5xl text-brand-900 mb-6 leading-tight">
              The Balance<br />
              <span className="italic">Podcasts.</span>
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-10 max-w-sm">
              Subscribe to our weekly teachings and special conversations on the go. Available on all major streaming platforms.
            </p>

            <div className="flex flex-col gap-4">
              <Link to="/weekly-teachings" className="bg-white p-5 rounded-2xl flex items-center justify-between group hover:shadow-lg transition-all shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white hover:border-gray-100">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-accent-gold rounded-xl flex items-center justify-center text-white p-3 shrink-0">
                    <Mic className="w-full h-full" />
                  </div>
                  <div>
                    <h4 className="font-serif text-brand-900 text-[17px] mb-1">Weekly Teachings</h4>
                    <p className="text-gray-400 text-[9px] font-bold tracking-widest uppercase">New episodes every Monday</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-gray-300 group-hover:text-link-blue transition-colors mr-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. The Gallery Section */}
      <section id="gallery" className="bg-[#f8f9fa] py-24 md:py-32 overflow-hidden relative">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px] opacity-70" />
           <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-accent-gold/5 rounded-full blur-[100px] opacity-70" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-20">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-brand-900 uppercase tracking-[0.2em] text-[10px] font-bold mb-4">
              Life in Community
            </p>
            <h2 className="font-serif text-5xl md:text-6xl text-brand-900 mb-4">
              The Gallery.
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Interact and drag the photos around to explore our beautiful community moments.
            </p>
          </div>
        </div>

        {/* Interactive Drag Collage */}
        <div className="w-full max-w-7xl mx-auto px-4 relative h-[500px] md:h-[750px] flex items-center justify-center pointer-events-auto">
          {(() => {
            const collagePlacements = [
              // Center large
              { left: '50%', top: '50%', width: 'min(65%, 450px)', aspect: '3/4', rotate: -2, zIndex: 10, delay: 0.1 },
              // Top left
              { left: '22%', top: '28%', width: 'min(45%, 280px)', aspect: '1/1', rotate: -8, zIndex: 5, delay: 0.2 },
              // Top right
              { left: '78%', top: '32%', width: 'min(50%, 320px)', aspect: '4/3', rotate: 6, zIndex: 8, delay: 0.3 },
              // Bottom left
              { left: '28%', top: '72%', width: 'min(48%, 300px)', aspect: '4/3', rotate: 5, zIndex: 12, delay: 0.4 },
              // Bottom right
              { left: '72%', top: '68%', width: 'min(45%, 280px)', aspect: '1/1', rotate: -5, zIndex: 7, delay: 0.5 },
            ];

            const displayPhotos = [
              sundayPhotos[0] || "https://picsum.photos/seed/s1/600/800",
              sundayPhotos[1] || "https://picsum.photos/seed/s2/800/800",
              sundayPhotos[2] || "https://picsum.photos/seed/s3/800/600",
              sundayPhotos[3] || "https://picsum.photos/seed/s4/800/600",
              sundayPhotos[4] || sundayPhotos[0] || "https://picsum.photos/seed/s5/800/800",
            ];

            return displayPhotos.map((photo, i) => {
              const pos = collagePlacements[i];
              return (
                <motion.div
                  key={i}
                  drag
                  dragConstraints={{ top: -100, left: -100, right: 100, bottom: 100 }}
                  whileHover={{ scale: 1.05, zIndex: 50 }}
                  whileDrag={{ scale: 1.1, zIndex: 50, cursor: "grabbing" }}
                  initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%', rotate: 0 }}
                  whileInView={{ opacity: 1, scale: 1, x: '-50%', y: '-50%', rotate: pos.rotate }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: pos.delay, type: "spring", bounce: 0.3 }}
                  style={{
                    position: 'absolute',
                    left: pos.left,
                    top: pos.top,
                    width: pos.width,
                    aspectRatio: pos.aspect,
                    zIndex: pos.zIndex,
                    cursor: 'grab',
                  }}
                  className="rounded-xl md:rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.15)] border-4 border-white group bg-white"
                >
                  <img
                    src={photo}
                    alt={`Gallery preview ${i + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle glass reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              );
            });
          })()}
        </div>

        <div className="mt-8 md:mt-12 text-center relative z-20">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-3 px-10 py-4 bg-brand-900 text-white hover:bg-brand-800 rounded-full text-[13px] font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            View Full Gallery <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
