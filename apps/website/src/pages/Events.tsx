import { motion } from 'motion/react';
import { Search, Clock, ArrowRight, Share2, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export function Events() {
  const events = useQuery(api.events.getPublishedUpcoming);
  const isLoading = events === undefined;

  return (
    <div className="w-full bg-[#fcfcfc] min-h-screen pt-16 pb-24 font-sans">
      
      {/* Header */}
      <div className="pt-8 pb-16 text-center max-w-3xl mx-auto px-6">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-accent-gold text-[10px] uppercase font-bold tracking-[0.2em] mb-4"
        >
          Gather & Grow
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-5xl md:text-7xl font-bold text-brand-900 mb-6 tracking-tight"
        >
          Upcoming Events
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-500 text-lg md:text-xl leading-relaxed"
        >
          Join our vibrant community for moments of worship, fellowship, and personal growth. There's a place for you here in every season.
        </motion.p>
      </div>

      {/* Filter / Search Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            <button className="bg-brand-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold shrink-0">All</button>
            <button className="bg-[#f0f2f5] text-gray-600 hover:bg-gray-200 px-6 py-2.5 rounded-full text-sm font-medium shrink-0 transition-colors">Sunday</button>
            <button className="bg-[#f0f2f5] text-gray-600 hover:bg-gray-200 px-6 py-2.5 rounded-full text-sm font-medium shrink-0 transition-colors">Midweek</button>
            <button className="bg-[#f0f2f5] text-gray-600 hover:bg-gray-200 px-6 py-2.5 rounded-full text-sm font-medium shrink-0 transition-colors">Prayers</button>
            <button className="bg-[#f0f2f5] text-gray-600 hover:bg-gray-200 px-6 py-2.5 rounded-full text-sm font-medium shrink-0 transition-colors">Special Programs</button>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Find an event..." 
              className="w-full pl-11 pr-4 py-3 bg-[#f0f2f5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-900/20 text-brand-900 placeholder:text-gray-400 transition-shadow" 
            />
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        
        {isLoading ? (
          // Loading state
          [1, 2, 3].map((n) => (
            <div key={n} className="h-[450px] bg-gray-50 rounded-3xl animate-pulse" />
          ))
        ) : events?.length === 0 ? (
          // Empty state
          <div className="col-span-full py-20 text-center">
            <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400">No upcoming events found</h3>
          </div>
        ) : (
          events?.map((event, index) => (
            <motion.div 
              key={event._id}
              variants={fadeIn} 
              initial="initial" 
              whileInView="whileInView" 
              transition={{ delay: index * 0.1 }} 
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden flex flex-col h-full"
            >
              <div className="relative h-56 shrink-0 p-4">
                <img 
                  src={event.imageUrl || "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=800"} 
                  alt={event.title} 
                  className="w-full h-full object-cover rounded-2xl" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute top-8 left-8 bg-white text-brand-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md tracking-wide uppercase">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="px-8 pb-8 pt-4 flex flex-col flex-1">
                <p className="text-[#3b82f6] text-[10px] font-bold uppercase tracking-[0.15em] mb-2">{event.category || "Event"}</p>
                <h3 className="font-serif text-[22px] font-bold text-brand-900 mb-3 leading-tight">{event.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {event.description}
                </p>
                <div className="flex items-center gap-3 text-sm text-brand-900 font-semibold mb-6">
                  <Clock size={16} className="text-gray-500" /> <span className="opacity-80">{event.time || "TBA"}</span>
                </div>
                <Link to="#" className="text-brand-900 text-[13px] font-bold flex items-center gap-2 hover:text-link-blue transition-colors mt-auto">
                  Learn More <ArrowRight size={16}/>
                </Link>
              </div>
            </motion.div>
          ))
        )}

        {/* CTA Card (Navy) - Keep as a fixed inspiration card if needed, or remove */}
        {!isLoading && events && events.length > 0 && (
          <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" transition={{ delay: 0.3 }} className="bg-brand-900 rounded-3xl p-10 lg:p-12 flex flex-col justify-center text-white h-full shadow-xl">
            <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4 leading-tight">Join our newsletter</h3>
            <p className="text-blue-100/80 mb-10 leading-relaxed text-[15px]">
              Stay informed about special gatherings and neighborhood outreach.
            </p>
            <button className="bg-btn-sand text-brand-900 w-full py-4 rounded-xl font-bold hover:bg-[#fce29f] shadow-lg transition-colors mt-auto">
              Subscribe Now
            </button>
          </motion.div>
        )}

      </div>

      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#eff6f7] to-[#e4f1f2] rounded-[32px] p-10 md:p-16 lg:px-20 lg:py-16 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-12"
        >
          <div className="lg:w-1/2 w-full text-center lg:text-left">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-900 mb-4 tracking-tight">Never miss a moment.</h2>
            <p className="text-gray-600 text-lg max-w-lg mx-auto lg:mx-0">
              Receive weekly updates on upcoming events and community news directly in your inbox.
            </p>
          </div>
          <div className="lg:w-1/2 w-full">
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-6 py-4 rounded-xl border border-transparent shadow-[0_4px_20px_rgb(0,0,0,0.03)] focus:border-white focus:ring-4 focus:ring-brand-900/10 transition-all outline-none" 
              />
              <button type="submit" className="bg-brand-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-800 transition-colors shadow-lg shadow-brand-900/20 whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
