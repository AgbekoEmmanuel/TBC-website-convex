import { motion } from 'motion/react';
import { Play, Search, ChevronDown, User, Calendar } from 'lucide-react';

const sermonsData = [
  {
    id: 1,
    series: "Ancient Future",
    title: "Finding Home in History",
    speaker: "Sarah Chen",
    date: "Oct 20, 2024",
    duration: "42:15",
    image: "https://picsum.photos/seed/candle/600/400"
  },
  {
    id: 2,
    series: "Rhythms of Grace",
    title: "The Unhurried Heart",
    speaker: "Julian Vance",
    date: "Oct 13, 2024",
    duration: "38:40",
    image: "https://picsum.photos/seed/nighttraffic/600/400"
  },
  {
    id: 3,
    series: "Kingdom Culture",
    title: "Redefining Power",
    speaker: "Marcus Thorne",
    date: "Oct 6, 2024",
    duration: "45:10",
    image: "https://picsum.photos/seed/goldlines/600/400"
  },
  {
    id: 4,
    series: "Rhythms of Grace",
    title: "Cultivating Presence",
    speaker: "Julian Vance",
    date: "Sep 29, 2024",
    duration: "41:02",
    image: "https://picsum.photos/seed/greenleaves/600/400"
  },
  {
    id: 5,
    series: "Ancient Future",
    title: "The Living Liturgy",
    speaker: "Sarah Chen",
    date: "Sep 22, 2024",
    duration: "50:22",
    image: "https://picsum.photos/seed/archsky/600/400"
  },
  {
    id: 6,
    series: "Kingdom Culture",
    title: "Citizens of a Different Realm",
    speaker: "Marcus Thorne",
    date: "Sep 15, 2024",
    duration: "39:15",
    image: "https://picsum.photos/seed/notebookpen/600/400"
  }
];

export function Sermons() {
  return (
    <div className="w-full bg-[#fdfdfd] min-h-screen pt-12 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-10 text-left">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-2"
          >
            Media Library
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl font-semibold text-brand-900"
          >
            Sermons
          </motion.h1>
        </div>

        {/* Featured Sermon Hero */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-[24px] overflow-hidden shadow-xl aspect-[16/9] md:aspect-[21/9] min-h-[400px] mb-12 group"
        >
          {/* Background Image & Overlays */}
          <img 
            src="https://picsum.photos/seed/sunriseclouds/1920/800" 
            alt="Sunrise behind clouds" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-900/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 via-brand-900/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 via-transparent to-transparent" />

          {/* Featured Content */}
          <div className="absolute inset-0 flex flex-col md:flex-row md:items-end justify-between p-8 md:p-14 z-10">
            <div className="max-w-2xl mt-auto md:mt-0">
              <span className="bg-btn-sand text-brand-900 text-[10px] uppercase font-bold tracking-[0.1em] px-3 py-1.5 rounded-full inline-block mb-4">
                Latest Message
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-medium mb-4 leading-tight">
                The Weight of Quietness
              </h2>
              <p className="text-gray-200 text-sm md:text-lg lg:text-xl font-light mb-6 opacity-90 leading-relaxed max-w-xl">
                Exploring the discipline of silence in a noisy world. Part 4 of the 'Rhythms of Grace' series.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-white text-xs md:text-sm font-medium">
                <span className="flex items-center gap-2 opacity-90">
                  <User size={16} /> Pastor Julian Vance
                </span>
                <span className="flex items-center gap-2 opacity-90">
                  <Calendar size={16} /> Oct 27, 2024
                </span>
              </div>
            </div>

            {/* Play Button */}
            <div className="mt-6 md:mt-0 self-start md:self-end pr-4 pb-2">
              <button className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-105 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-300">
                <Play className="text-brand-900 w-6 h-6 ml-1" fill="currentColor" strokeWidth={1} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filter Section */}
        <div className="bg-[#f7f8f9] rounded-[24px] p-6 lg:p-8 flex flex-col lg:flex-row gap-6 mb-16 shadow-sm border border-gray-100/50">
          
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Search Library</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Title, scripture, or keyword..." 
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-transparent focus:border-gray-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-sm focus:ring-4 focus:ring-link-blue/10 focus:outline-none transition-all placeholder:text-gray-400" 
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 lg:gap-4">
            <div className="w-full md:w-48 lg:w-44">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Series</label>
              <div className="relative">
                <select className="w-full appearance-none bg-white py-3.5 pl-4 pr-10 rounded-xl text-sm font-medium border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-none text-brand-900 cursor-pointer hover:bg-gray-50 transition-colors">
                  <option>All Series</option>
                  <option>Ancient Future</option>
                  <option>Rhythms of Grace</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="w-full md:w-48 lg:w-44">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Speaker</label>
              <div className="relative">
                <select className="w-full appearance-none bg-white py-3.5 pl-4 pr-10 rounded-xl text-sm font-medium border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-none text-brand-900 cursor-pointer hover:bg-gray-50 transition-colors">
                  <option>All Speakers</option>
                  <option>Pastor Julian Vance</option>
                  <option>Sarah Chen</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="w-full md:w-40 lg:w-32">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Year</label>
              <div className="relative">
                <select className="w-full appearance-none bg-white py-3.5 pl-4 pr-10 rounded-xl text-sm font-medium border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-none text-brand-900 cursor-pointer hover:bg-gray-50 transition-colors">
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Sermons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {sermonsData.map((sermon, i) => (
            <motion.div 
              key={sermon.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group cursor-pointer flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative rounded-2xl overflow-hidden aspect-video w-full mb-5 bg-gray-100 shadow-sm">
                <img 
                  src={sermon.image} 
                  alt={sermon.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-brand-900/95 backdrop-blur-sm text-white px-2 py-1 rounded shadow-sm">
                  <span className="text-[10px] font-bold tracking-wider">{sermon.duration}</span>
                </div>
                {/* Hover Play Overlay */}
                <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/20 transition-colors flex items-center justify-center">
                  <Play className="text-white w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 duration-300 drop-shadow-lg" fill="currentColor" />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 px-1">
                <p className="text-accent-gold text-[9px] uppercase font-bold tracking-widest mb-2">
                  {sermon.series}
                </p>
                <h3 className="font-serif text-2xl font-semibold text-brand-900 mb-4 group-hover:text-link-blue transition-colors leading-tight">
                  {sermon.title}
                </h3>
                
                <div className="mt-auto flex justify-between items-center text-[11px] font-medium text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="opacity-70" /> {sermon.speaker}
                  </div>
                  <div className="flex items-center">
                     {sermon.date}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Load More */}
        <div className="mt-20 flex justify-center">
          <button className="bg-[#f7f8f9] hover:bg-[#eff1f3] text-brand-900 font-semibold px-8 py-3.5 rounded-xl flex items-center gap-3 text-sm transition-colors border border-gray-100">
            Load More Messages <ChevronDown size={18} className="opacity-70 text-brand-900" />
          </button>
        </div>

      </div>
    </div>
  );
}
