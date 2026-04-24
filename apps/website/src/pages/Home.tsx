import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, PlayCircle, Home as HomeIcon, BookOpen, Users, MapPin, Clock, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import yearThemeImg from '../assets/events/year_theme.jpeg';

const homepicsModules = import.meta.glob('../assets/homepics/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });
const heroImages = Object.values(homepicsModules) as string[];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 }
};

export function Home() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const events = useQuery(api.events.getPublishedUpcoming);
  const recentEvents = events ? events.slice(0, 3) : undefined;

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % heroImages.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-white font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#112a46]">
          <AnimatePresence>
            {heroImages.length > 0 && (
              <motion.img 
                key={currentIdx}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                src={heroImages[currentIdx]} 
                alt="Church community" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-brand-900/60 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/30 via-transparent to-brand-900/70 z-10" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 w-full text-white pt-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-btn-sand font-bold tracking-[0.2em] uppercase text-xs mb-4">You Belong Here</p>
            <h1 className="font-serif text-6xl md:text-7xl font-bold leading-tight mb-6">
              Dome of Excellence.
            </h1>
            <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto leading-relaxed">
              Where earthly and spiritual principles are incorporated for dominion.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="px-8 py-3.5 bg-brand-900 hover:bg-brand-800 text-white rounded-lg font-semibold transition-colors border border-white/30">
                Plan a Visit
              </Link>
              <Link to="/media#live" className="px-8 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 rounded-lg font-semibold transition-colors">
                Watch Online
              </Link>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 z-10 text-white/70 animate-bounce">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* 2. Start Your Journey (New Here) Section */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-accent-gold font-bold tracking-[0.15em] uppercase text-xs mb-2">Start Your Journey</p>
            <h2 className="font-serif text-5xl font-bold text-brand-900">New Here?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" className="bg-white rounded-2xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full">
              <div className="w-12 h-12 bg-[#eef2fc] text-brand-900 rounded-lg flex items-center justify-center mb-6 shrink-0">
                <HomeIcon size={20} className="text-link-blue" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-900 mb-4">What to Expect</h3>
              <p className="text-gray-500 mb-8 leading-relaxed flex-1">
                From the parking lot to the pulpit, we've designed an experience that is welcoming, modern, and spiritually uplifting.
              </p>
              <Link to="/about" className="text-accent-gold font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
                Learn more <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" transition={{ delay: 0.1 }} className="bg-brand-900 rounded-2xl p-10 shadow-lg flex flex-col h-full text-white">
              <div className="w-12 h-12 bg-white/10 text-white rounded-lg flex items-center justify-center mb-6 shrink-0">
                <BookOpen size={20} />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">Our Beliefs</h3>
              <p className="text-gray-300 mb-8 leading-relaxed flex-1">
                We are rooted in our core values but forward-thinking in our application. Explore the core values that guide our community.
              </p>
              <Link to="/about" className="text-white font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
                View our values <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full">
              <div className="w-12 h-12 bg-[#e5fcfa] text-[#0d9488] rounded-lg flex items-center justify-center mb-6 shrink-0">
                <Users size={20} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-900 mb-4">Connect</h3>
              <p className="text-gray-500 mb-8 leading-relaxed flex-1">
                Life is better together. Find your place in one of our fellowships or departments. We have a place for you. Welcome to The Balance Church family.
              </p>
              <Link to="/contact" className="text-accent-gold font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
                Get involved <ArrowRight size={16} />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Featured Sermon Section */}
      <section className="py-24 bg-bg-light border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-3/5"
            >
              <a href="https://youtu.be/CIuIhNbxIhY" target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden relative shadow-xl group aspect-video">
                <img 
                  src="https://img.youtube.com/vi/CIuIhNbxIhY/maxresdefault.jpg" 
                  alt="Featured Sermon" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-900/40 flex items-center justify-center transition-colors group-hover:bg-brand-900/50">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer border border-white/20">
                    <PlayCircle className="text-white w-8 h-8" />
                  </div>
                </div>
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-2/5"
            >
              <p className="text-accent-gold font-bold tracking-[0.1em] uppercase text-xs mb-3">Featured Sermon</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-brand-900 leading-[1.1] mb-6">
                Invading the <br/>Mountains
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Join Apostle Michael Dadzie as he explores the seven mountains of influence and how to have dominion over them.
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <button className="px-6 py-3 bg-brand-900 text-white rounded-lg font-semibold hover:bg-brand-800 transition-colors text-sm">
                  Watch Message
                </button>
                <Link to="/sermons" className="text-brand-900 font-semibold text-sm hover:text-link-blue transition-colors">
                  All Sermons
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Year Theme Banner Section */}
      <section className="w-full bg-bg-light relative pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full rounded-[2rem] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.08)] bg-brand-900 group cursor-pointer"
          >
            <img 
              src={yearThemeImg} 
              alt="Year Theme" 
              className="w-full h-auto object-cover max-h-[85vh] transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
          </motion.div>
        </div>
      </section>

      {/* 4. Upcoming Events Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <p className="text-accent-gold font-bold tracking-[0.15em] uppercase text-xs mb-2">Don't Miss Out</p>
            <h2 className="font-serif text-5xl font-bold text-brand-900">Upcoming Events</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {recentEvents === undefined ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="h-[450px] bg-gray-50 rounded-2xl animate-pulse shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100" />
              ))
            ) : recentEvents.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <h3 className="text-xl font-medium text-gray-400">No upcoming events found</h3>
              </div>
            ) : (
              recentEvents.map((event, index) => {
                const eventDate = new Date(event.date);
                // Adjust to account for timezone issues if event.date is YYYY-MM-DD
                const day = new Date(eventDate.getTime() + eventDate.getTimezoneOffset() * 60000).getDate();
                const month = new Date(eventDate.getTime() + eventDate.getTimezoneOffset() * 60000).toLocaleString('en-US', { month: 'short' });
                return (
                  <motion.div key={event._id} variants={fadeIn} initial="initial" whileInView="whileInView" transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">
                    <div className="relative h-56">
                      <img src={event.imageUrl || "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=800"} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md text-center">
                        <div className="text-xl font-bold text-brand-900 leading-none">{day || new Date(event.date).getDate()}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{month || new Date(event.date).toLocaleString('en-US', { month: 'short' })}</div>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="font-serif text-2xl font-bold text-brand-900 mb-3">{event.title}</h3>
                      <p className="text-gray-500 mb-6 text-sm flex-1 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-brand-900 font-medium mb-6">
                        <div className="flex items-center gap-1.5 opacity-70"><Clock size={14} /> {event.time || "TBA"}</div>
                        {event.location && <div className="flex items-center gap-1.5 opacity-70"><MapPin size={14} /> {event.location}</div>}
                      </div>
                      <Link to="/events" className="w-full text-center block py-3 bg-bg-light hover:bg-gray-100 text-brand-900 font-bold text-xs rounded-lg transition-colors">
                        RSVP Now
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            )}

          </div>
        </div>
      </section>

    </div>
  );
}
