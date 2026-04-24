import { motion } from 'motion/react';
import { Play, Podcast, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const messages = [
  {
    date: 'OCT 22, 2023',
    title: 'Take-Off 2026 3.0 : Discipline',
    img: 'https://i.scdn.co/image/ab6765630000ba8a2f948bb5c34ff02ceabfa680',
    spotifyLink: 'https://open.spotify.com/episode/3Dsz9s5IZUSEgaIpC0kx8W?si=EuzMXkWdQg6wfD_FWLEy_A'
  },
  {
    date: 'OCT 15, 2023',
    title: 'The Word Works 3.0 : Youth Charge',
    img: 'https://i.scdn.co/image/ab6765630000ba8a4878094147a5ee2dc2344b6e',
    spotifyLink: 'https://open.spotify.com/episode/4YbeEG79fcOfyQGes72P3W?si=g4nNoZ-uQ1SBnYznRg0oWw'
  },
  {
    date: 'OCT 08, 2023',
    title: 'Becoming Valuable :The currency of the 21st Century',
    img: 'https://i.scdn.co/image/ab6765630000ba8ac89efcbd3e4fde9ada6ded0c',
    spotifyLink: 'https://open.spotify.com/episode/32GY5KrEVT4ISB5Kb46N5H?si=4Lw2hQfZS9OexQBihITjig'
  },
  {
    date: 'OCT 01, 2023',
    title: 'The essence of The Balance Church',
    img: 'https://i.scdn.co/image/ab6765630000ba8a36e94e485541fcd5b48e88d8',
    spotifyLink: 'https://open.spotify.com/episode/7c1yIUTk4ApG8sEXZAyij3?si=QYrKZ1OBSYa5WvaJDZIB_g'
  },
  {
    date: 'SEPT 24, 2023',
    title: 'Beholding The Future : The Force of Vision',
    img: 'https://i.scdn.co/image/ab6765630000ba8a0a7cf8405406438575cadab5',
    spotifyLink: 'https://open.spotify.com/episode/4B77dks2ZmaBghiis0KKUo?si=rxRRJYLxR1-HV0SlyoJI3Q'
  },
  {
    date: 'SEPT 17, 2023',
    title: 'Spiritual Growth',
    img: 'https://i.scdn.co/image/ab6765630000ba8acc8e5316f0cb0fe50da68d2f',
    spotifyLink: 'https://open.spotify.com/episode/4eO6rVhr3TnksogzVwtI8n?si=snWszvcCRAaKAwiVCiou2A'
  }
];

export function WeeklyTeachings() {
  return (
    <div className="w-full font-sans bg-[#fcfcfc]">
      
      {/* 1. Hero Section */}
      <section className="relative w-full overflow-hidden bg-brand-900 pt-32 pb-40 md:pt-40 md:pb-48">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/majestic-mountains/1920/1080" 
            alt="Mountains" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/60 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-start justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-accent-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
              Archive of Wisdom
            </p>
            <h1 className="font-serif text-6xl md:text-[80px] font-medium text-white leading-[1.05] mb-6">
              Weekly<br />
              Teachings
            </h1>
            <p className="text-blue-100/90 text-[16px] leading-relaxed max-w-md">
              Cultivating spiritual depth through the deliberate study of the word. Explore our sanctuary of spoken grace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Messages Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="font-serif text-4xl text-brand-900 mb-2">Recent Messages</h2>
            <p className="text-gray-500 text-[14px]">Reflections from Apostle Michael Dadzie and the Balance Ministry team.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 transition-colors text-brand-900 rounded-lg text-[13px] font-bold">
            <Filter size={16} /> Sort by Date
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {messages.map((msg, i) => (
            <motion.div 
              key={msg.title}
              variants={fadeIn} initial="initial" whileInView="whileInView" transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 group hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] transition-all"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6">
                <img 
                  src={msg.img} 
                  alt={msg.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <a href={msg.spotifyLink} target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                  <Play size={18} className="fill-white translate-x-[1px]" />
                </a>
              </div>
              
              <div className="px-2 pb-4">
                <p className="text-accent-gold uppercase tracking-[0.15em] text-[10px] font-bold mb-3">{msg.date}</p>
                <h3 className="font-serif text-[22px] text-brand-900 mb-4">{msg.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-[12px] mb-8">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span>Apostle Michael Dadzie</span>
                </div>
                
                <a href={msg.spotifyLink} target="_blank" rel="noopener noreferrer" className="w-full bg-[#0a1945] hover:bg-blue-900 text-white py-3.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-colors">
                  <Podcast size={16} /> Listen on Spotify
                </a>
              </div>

            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <button className="px-8 py-3.5 border border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-white rounded-lg text-[13px] font-bold transition-colors">
            Discover More Teachings
          </button>
        </div>
      </section>

      {/* 3. Newsletter Section */}
      <section className="bg-brand-900 py-24 mx-4 md:mx-6 mb-24 rounded-[32px] overflow-hidden relative shadow-2xl">
        {/* Subtle background division effect to match screenshot */}
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[#102353]" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <h2 className="font-serif text-[44px] md:text-[52px] text-white leading-tight mb-6">
              Never miss a teaching.
            </h2>
            <p className="text-blue-100/80 text-[15px] leading-relaxed">
              Join our weekly spiritual journal. Get sermon summaries, scripture reflections, and early access to our sanctuary podcast series directly in your inbox.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
            />
            <button className="w-full bg-[#ffc342] hover:bg-[#e0a830] text-brand-900 rounded-lg py-4 font-bold text-[14px] transition-colors">
              Subscribe to Grace
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
