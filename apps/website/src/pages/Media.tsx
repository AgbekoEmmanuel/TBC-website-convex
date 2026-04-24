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
const sundayPhotos = Object.values(sundayModules) as string[];

const fadeInVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function Media() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const recentMessages = useQuery(api.events.getRecentPast);
  const isLoading = recentMessages === undefined;

  const liveStream = useQuery(api.liveStream.get);
  const isLive = liveStream?.isLive && liveStream?.youtubeLink;

  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = liveStream?.youtubeLink ? getYouTubeID(liveStream.youtubeLink) : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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
              src={heroImages[currentIdx]}
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
              <button className="w-full sm:w-auto bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-3.5 rounded text-[11px] font-bold tracking-widest uppercase flex items-center justify-center transition-all">
                Browse Series
              </button>
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
            className="w-full aspect-video bg-brand-900 rounded-[24px] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.1)] group flex items-center justify-center"
          >
            {isLive && videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                title="Live Stream"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
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
            <a href="#" className="text-gray-400 hover:text-brand-900 text-[10px] tracking-widest uppercase font-bold border-b border-transparent hover:border-brand-900 transition-colors pb-1">
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
              recentMessages.map((msg, idx) => (
                <motion.div
                  key={msg._id}
                  variants={fadeInVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * (idx + 1), duration: 0.6 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-5 bg-gray-100">
                    <img
                      src={msg.imageUrl || "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=800"}
                      alt={msg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    {msg.time && (
                      <div className="absolute bottom-3 right-3 bg-link-blue text-white text-[10px] font-bold px-2 py-1 rounded">
                        {msg.time}
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif text-[#0f172a] text-xl mb-2">{msg.title}</h3>
                  <p className="text-[12px] text-gray-500">
                    {msg.date ? new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Date TBA"} {msg.location ? `• ${msg.location}` : ""}
                  </p>
                </motion.div>
              ))
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

              <Link to="/weekly-teachings" className="bg-white p-5 rounded-2xl flex items-center justify-between group hover:shadow-lg transition-all shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white hover:border-gray-100">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#0d3f4a] rounded-xl flex items-center justify-center text-white p-3 shrink-0">
                    <MessageSquare className="w-full h-full text-white fill-white" />
                  </div>
                  <div>
                    <h4 className="font-serif text-brand-900 text-[17px] mb-1">Midweek Conversations</h4>
                    <p className="text-gray-400 text-[9px] font-bold tracking-widest uppercase">Deep dives into theology</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-gray-300 group-hover:text-link-blue transition-colors mr-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. The Gallery Section */}
      <section id="gallery" className="bg-white py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-brand-900 uppercase tracking-[0.2em] text-[10px] font-bold mb-4">
              Life in Community
            </p>
            <h2 className="font-serif text-5xl md:text-6xl text-brand-900">
              The Gallery.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-[600px]">
            {/* Left large tall image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-[400px] lg:h-full w-full overflow-hidden group"
            >
              <img
                src={sundayPhotos[0] || "https://picsum.photos/seed/sunday1/600/800"}
                alt="Sunday Service"
                className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Right side nested grid */}
            <div className="flex flex-col gap-4 h-auto lg:h-full">
              {/* Top horizontal image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="h-[250px] lg:h-[340px] w-full overflow-hidden group"
              >
                <img
                  src={sundayPhotos[1] || "https://picsum.photos/seed/sunday2/800/400"}
                  alt="Worship"
                  className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              {/* Bottom twin row */}
              <div className="h-[250px] lg:h-[244px] w-full grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-full h-full overflow-hidden group"
                >
                  <img
                    src={sundayPhotos[2] || "https://picsum.photos/seed/sunday3/400/400"}
                    alt="Community"
                    className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="w-full h-full overflow-hidden group"
                >
                  <img
                    src={sundayPhotos[3] || "https://picsum.photos/seed/sunday4/400/400"}
                    alt="Prayer"
                    className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-white rounded-lg text-[13px] font-bold transition-colors font-sans"
            >
              View More Photos
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
