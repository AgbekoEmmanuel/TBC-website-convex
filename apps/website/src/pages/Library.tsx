import { motion } from 'motion/react';
import { ArrowRight, Quote, BookOpen } from 'lucide-react';

import book1 from '../assets/books/BREAKING MID.png';
import book2 from '../assets/books/photo_2026-04-21_22-32-55.jpg';
import book3 from '../assets/books/photo_2026-04-21_22-33-15.jpg';
import libraryLogo from '../assets/tbc_library_logo_trans.png';
import wisdomArena from '../assets/wisdom arena.jpeg';
import requestSignedBg from '../assets/books/request_signed_bg.jpg';

const publications = [
  {
    title: "Breaking Mediocrity",
    price: "GH₵ 100",
    desc: "An invitation to the contemplative life, exploring the silence that precedes the Word.",
    img: book1
  },
  {
    title: "Come Boldly",
    price: "GH₵ 100",
    desc: "Understanding the cadence of the Spirit in our daily labor and intentional rest.",
    img: book2
  },
  {
    title: "The Leadership Principles of Jesus",
    price: "GH₵ 100",
    desc: "A deep dive into ancient practices for the digital age. Reclaiming our sacred habits.",
    img: book3
  },
  {
    title: "The Force of Mentorship",
    price: "GH₵ 100",
    desc: "Building a life of impact through intentional faith and community leadership.",
    img: book1
  },
  {
    title: "Kingdom Prosperity",
    price: "GH₵ 100",
    desc: "Daily meditations for the modern seeker found in the quiet moments of dawn.",
    img: book2
  }
];

export function Library() {
  return (
    <div className="w-full bg-[#fdfdfc] font-sans overflow-hidden">
      
      {/* 1. Header Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="mb-12">
          <img 
            src={libraryLogo}  
            className="h-16 md:h-20 w-auto object-contain"
          />
        </div>
        <p className="uppercase text-[10px] tracking-[0.2em] text-[#a78b30] font-bold mb-4">The Literary Sanctuary</p>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="max-w-xl">
             <h1 className="font-serif text-[64px] md:text-[72px] leading-[1.05] text-brand-900 mb-6 font-light">
               Words of<br/>
               <span className="italic text-brand-900">Wisdom.</span>
             </h1>
             <p className="text-gray-500 text-[15px] leading-relaxed max-w-sm">
               Explore the curated collection of literature penned by our Head Pastor, exploring themes of faith, resilience, and the cinematic beauty of a life led by grace.
             </p>
          </div>
          <div className="text-right pb-2 hidden md:block">
            <span className="text-[44px] font-serif text-brand-900/20 leading-none block mb-1">01</span>
            <p className="text-[10px] uppercase tracking-widest text-[#a0aabf] font-bold mt-1">Section | Library</p>
          </div>
        </div>
      </section>

      {/* Hero Banner Image */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative group cursor-pointer bg-brand-900"
        >
          <img 
            src={wisdomArena} 
            alt="Wisdom Arena" 
            className="w-full h-auto object-contain transition-transform duration-[1.5s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-brand-900/20 mix-blend-multiply transition-colors duration-700 group-hover:bg-brand-900/5 pointer-events-none"></div>
        </motion.div>
      </section>

      {/* 2. New Releases Layout */}
      <section id="new-releases" className="max-w-7xl mx-auto px-6 pb-24 border-b border-gray-100">
        <h2 className="font-serif italic text-[28px] mb-8 text-brand-900">New Releases</h2>
        
        <div className="flex flex-col gap-6">
           {/* Top Row */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Card 1: Navy */}
              <div className="bg-[#112040] rounded-[24px] p-8 md:p-12 flex flex-col sm:flex-row gap-8 items-center shadow-lg relative overflow-hidden group">
                <div className="w-full sm:w-[45%] lg:w-[40%] aspect-[2/3] shrink-0 z-10 transition-transform duration-500 group-hover:-translate-y-2">
                   <img src={book1} alt="Book" className="w-full h-full object-cover rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.3)]" />
                </div>
                <div className="z-10 text-white flex flex-col justify-center flex-1">
                  <span className="bg-[#fdb50d] text-[#112040] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded inline-block w-max mb-5">New</span>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 mb-3 font-bold">Hardcover Collection</p>
                  <h3 className="font-serif italic text-[32px] md:text-[36px] mb-4 leading-tight">The Weight of<br/>Quietness</h3>
                  <p className="text-[13px] text-white/70 leading-relaxed mb-8">
                    A monumental exploration into the silence of the soul and the whispers of the divine. This limited edition features gold foil detailing.
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[26px] font-serif text-[#fdb50d]">GH₵ 100.00</span>
                    <button className="bg-transparent border border-white/30 hover:bg-white/10 hover:border-white text-white px-6 py-2.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-colors">Pre-Order</button>
                  </div>
                </div>
              </div>

              {/* Card 2: Gray Gradient */}
              <div className="bg-gradient-to-br from-[#f2f4f7] to-[#e2e8f0] rounded-[24px] p-8 md:p-12 flex flex-col sm:flex-row gap-8 items-center shadow-sm group">
                <div className="w-full sm:w-[45%] lg:w-[40%] aspect-[2/3] shrink-0 transition-transform duration-500 group-hover:-translate-y-2">
                   <img src={book2} alt="Book" className="w-full h-full object-cover rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]" />
                </div>
                <div className="flex flex-col justify-center text-brand-900 flex-1">
                  <span className="bg-[#112040] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded inline-block w-max mb-5">Featured</span>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-3 font-bold">Pastoral Insights</p>
                  <h3 className="font-serif italic text-[32px] md:text-[36px] mb-4 leading-tight">Rhythms of<br/>Grace</h3>
                  <p className="text-[13px] text-gray-600 leading-relaxed mb-8">
                    Discover the cadence of spiritual endurance in an age of constant noise. A transformative guide for modern seekers.
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[26px] font-serif text-brand-900">GH₵ 100.00</span>
                    <button className="bg-[#112040] hover:bg-brand-900 text-white px-6 py-2.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-colors shadow-md">Order Now</button>
                  </div>
                </div>
              </div>

           </div>

           {/* Bottom Row */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Card 3: White wide (spans 2) */}
              <div className="lg:col-span-2 bg-white rounded-[24px] p-8 md:p-12 flex flex-col md:flex-row gap-10 lg:gap-16 items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 group">
                <div className="w-full md:w-5/12 aspect-[3/4] shrink-0 transition-transform duration-500 group-hover:-translate-y-2">
                   <img src={book3} alt="Book" className="w-full h-full object-cover rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]" />
                </div>
                <div className="flex flex-col justify-center items-start text-brand-900">
                  <span className="bg-[#112040] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">Bestseller</span>
                  <h3 className="font-serif text-[44px] leading-tight mb-5">The Balanced<br/>Heart</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed mb-10 max-w-sm">
                    An exploration of emotional equilibrium through the lens of scripture, guiding readers toward a sanctuary within.
                  </p>
                  <button className="flex items-center gap-4 group/btn hover:opacity-80 transition-opacity">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#112040] uppercase">View Details</span>
                    <div className="w-12 h-[2px] bg-[#fdb50d] transition-all group-hover/btn:w-16"></div>
                  </button>
                </div>
              </div>

              {/* Card 4: White tall */}
              <div className="bg-white rounded-[24px] p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 group justify-between">
                <div className="w-3/5 aspect-[3/4] mb-8 mt-2 transition-transform duration-500 group-hover:-translate-y-2">
                   <img src={book2} alt="Book" className="w-full h-full object-cover rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.15)]" />
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="font-serif text-[24px] mb-3 text-brand-900 px-4 leading-tight">Whispers in the Sanctuary</h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed mb-6 px-4">
                    Daily meditations for the modern seeker found in the quiet moments of dawn.
                  </p>
                  <span className="text-[18px] font-serif font-bold text-[#fdb50d] tracking-wide">GH₵ 100.00</span>
                </div>
              </div>

           </div>
        </div>
      </section>

      {/* 3. All Publications */}
      <section id="publications" className="bg-[#fcfcfc] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6">
             <div>
               <p className="uppercase text-[10px] tracking-[0.2em] text-gray-400 font-bold mb-3">The Collection</p>
               <h2 className="font-serif italic text-[44px] text-brand-900 leading-none">All Publications</h2>
             </div>
             <p className="text-[14px] text-gray-500 max-w-[320px] leading-relaxed lg:text-right">
               A comprehensive archive of pastoral insights, theological explorations, and daily devotionals.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {publications.map((pub, idx) => (
              <div key={idx} className="flex flex-col group cursor-pointer">
                 <div className="aspect-[4/5] bg-gray-100 mb-6 overflow-hidden rounded-md relative shadow-sm">
                    <img src={pub.img} alt={pub.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                 </div>
                 <div className="flex justify-between items-start gap-4 mb-3">
                   <h3 className="font-serif text-[22px] text-brand-900 leading-tight">{pub.title}</h3>
                   <span className="font-serif font-bold text-brand-900 text-[18px] shrink-0">{pub.price}</span>
                 </div>
                 <p className="text-gray-500 text-[13.5px] leading-relaxed mb-5 flex-1">
                   {pub.desc}
                 </p>
                 <div className="text-[#a0aabf] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-brand-900 transition-colors">
                   View Details <ArrowRight size={12} className="ml-1 transition-transform group-hover:translate-x-1" />
                 </div>
              </div>
            ))}
            
            {/* Coming Soon Box */}
            <div className="flex flex-col">
                 <div className="aspect-[4/5] bg-[#e2e8f0]/50 mb-6 flex items-center justify-center rounded-md border border-gray-200 border-dashed">
                    <div className="text-center text-[#a0aabf]">
                      <BookOpen size={32} className="mx-auto mb-4 opacity-50" strokeWidth={1.5} />
                      <p className="font-serif italic text-xl">Coming Soon</p>
                    </div>
                 </div>
                 <div className="flex justify-between items-baseline mb-2">
                   <h3 className="font-serif text-[22px] text-brand-900/40">The Cinematic Soul</h3>
                 </div>
                 <p className="text-gray-500/40 text-[13.5px] leading-relaxed mb-5 flex-1">
                   Explore the divine direction of your life's unfolding narrative.
                 </p>
                 <div className="text-[#a0aabf]/50 text-[9px] font-bold uppercase tracking-widest mt-auto">
                   Fall 2024
                 </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Quote */}
      <section className="bg-brand-900 py-24 md:py-32 px-6 text-center">
         <div className="max-w-3xl mx-auto flex flex-col items-center">
            <div className="mb-8 opacity-80">
                <Quote size={48} className="text-[#fdb50d] fill-[#fdb50d]" />
            </div>
            <h2 className="font-serif italic text-[32px] md:text-[40px] text-white mb-10 leading-[1.3] max-w-2xl">
               "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."
            </h2>
            <div className="flex items-center gap-4 text-[#a0aabf] text-[10px] font-bold uppercase tracking-[0.2em]">
               <div className="w-8 h-[1px] bg-white/20"></div>
               2 Timothy 2:15
            </div>
         </div>
      </section>

      {/* 5. Purchase Inquiry */}
      <section id="inquiry" className="bg-[#fcfcfc] py-24 md:py-32">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Image + Floating Box */}
            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-2xl">
               <img src={requestSignedBg} alt="Bookshelf" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-[#112040]/50 mix-blend-multiply"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#112040]/80 via-transparent to-transparent"></div>
               
               <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
                  <div className="bg-[#112040]/70 backdrop-blur-md border border-white/10 p-10 md:p-12 rounded-[20px] text-center max-w-[380px] w-full transform transition-transform hover:scale-[1.02] duration-500">
                     <h3 className="font-serif text-[32px] text-white mb-4 leading-tight">Request a Signed<br/>Copy</h3>
                     <div className="w-10 h-[1px] bg-[#fdb50d] mx-auto mb-6"></div>
                     <p className="text-blue-100/80 text-[13px] leading-relaxed">
                        Our library team will handle your request personally. Please allow at most 24 hours for a response regarding availability and delivery.
                     </p>
                  </div>
               </div>
            </div>

            {/* Right Form */}
            <div className="lg:pr-8">
               <h2 className="font-serif text-[44px] text-brand-900 mb-4 tracking-tight">Purchase Inquiry</h2>
               <p className="text-gray-500 text-[15px] mb-12">Connect with our creative scribblers to secure your literary journey.</p>
               
               <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a0aabf]">Full Name</label>
                        <input type="text" placeholder="Your name" className="bg-[#f2f4f7] border border-transparent focus:bg-white focus:border-brand-900 focus:ring-0 rounded-xl px-5 py-4 text-sm outline-none transition-colors w-full text-brand-900" />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a0aabf]">Mobile Number</label>
                        <input type="tel" placeholder="+233 00 000 0000" className="bg-[#f2f4f7] border border-transparent focus:bg-white focus:border-brand-900 focus:ring-0 rounded-xl px-5 py-4 text-sm outline-none transition-colors w-full text-brand-900" />
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a0aabf]">Book Interest</label>
                     <div className="relative">
                        <select defaultValue="" className="bg-[#f2f4f7] border border-transparent focus:bg-white focus:border-brand-900 focus:ring-0 rounded-xl px-5 py-4 text-sm outline-none transition-colors text-brand-900 appearance-none w-full cursor-pointer">
                           <option value="" disabled>Select a title...</option>
                           {publications.map(p => <option key={p.title} value={p.title}>{p.title}</option>)}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a0aabf]">Message</label>
                     <textarea rows={4} placeholder="Any specific requests or questions?" className="bg-[#f2f4f7] border border-transparent focus:bg-white focus:border-brand-900 focus:ring-0 rounded-xl px-5 py-4 text-sm outline-none transition-colors resize-none w-full text-brand-900"></textarea>
                  </div>

                  <div className="flex justify-start mt-4">
                     <button className="bg-[#fdb50d] hover:bg-[#e5a00a] text-white font-bold tracking-[0.2em] uppercase text-[11px] px-10 py-4 rounded-xl transition-colors shadow-md">
                        Send Inquiry
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </section>

    </div>
  );
}
