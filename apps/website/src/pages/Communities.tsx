import { motion } from 'motion/react';
import { ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const fellowships = [
  {
    name: "Balance",
    description: "Finding the center where work, rest, and worship intersect in a rhythmic life.",
    image: "https://picsum.photos/seed/balance-community/600/400"
  },
  {
    name: "Thytira",
    description: "A sanctuary for the weary, where hospitality is practiced as a high and holy art.",
    image: "https://picsum.photos/seed/thytira-coffee/600/400"
  },
  {
    name: "Philippi",
    description: "Radical joy and sacrificial friendship, modeling the early church's generous heart.",
    image: "https://picsum.photos/seed/philippi-group/600/400"
  },
  {
    name: "Pergamos",
    description: "The strength of conviction meeting the grace of an open and humble mind.",
    image: "https://picsum.photos/seed/pergamos-books/600/400"
  },
  {
    name: "Smyrna",
    description: "Resilient faith that blooms even in the hardest soil of life's many trials.",
    image: "https://picsum.photos/seed/smyrna-sunset/600/400"
  },
  {
    name: "Laodicea",
    description: "A call to spiritual awakening and the pursuit of gold tried in the fire.",
    image: "https://picsum.photos/seed/laodicea-wheat/600/400"
  },
  {
    name: "Berea",
    description: "Diligent seekers who examine the word with noble curiosity and sharp focus.",
    image: "https://picsum.photos/seed/berea-study/600/400"
  },
  {
    name: "Ephesus",
    description: "Returning to our first love through service, tradition, and shared community roots.",
    image: "https://picsum.photos/seed/ephesus-garden/600/400"
  },
  {
    name: "Philadelphia",
    description: "The fellowship of brotherly and sisterly love, where every door is an open invitation.",
    image: "https://picsum.photos/seed/philadelphia-handshake/600/400"
  },
  {
    name: "Sardis",
    description: "Awakening the soul to new life and living out our faith with vibrant intention.",
    image: "https://picsum.photos/seed/sardis-candle/600/400"
  }
];

export function Communities() {
  return (
    <div className="w-full bg-[#fdfdfd] min-h-screen font-sans">
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-brand-900 py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.pinimg.com/1200x/85/cf/7b/85cf7b4993b6519887effa15951ca46b.jpg" 
            alt="Cathedral interior" 
            className="w-full h-full object-cover mix-blend-soft-light opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-transparent to-brand-900/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 via-transparent to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-accent-gold font-bold uppercase tracking-[0.15em] text-[10px] mb-4">
              Together In Faith
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-[80px] font-medium text-white leading-[1.1] mb-6">
              Find Your<br />Community
            </h1>
            <p className="text-blue-100/90 text-lg md:text-xl font-light leading-relaxed max-w-lg">
              The Balance Church has ten(10) thriving fellowships. Feel free to join any of them to grow in your faith and connect with others.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column (Sticky Sidebar) */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif text-4xl text-brand-900 mb-6">The Ten Fellowships</h2>
                <p className="text-gray-500 leading-relaxed text-[15px] mb-10">
                  Each community at Balance Church is a unique expression of the same spirit. Whether you seek the intellectual depth of Berea or the welcoming warmth of Philadelphia, there is a seat reserved for you.
                </p>
                
                <div className="bg-[#f7f8f9] rounded-2xl p-8 border border-gray-100">
                  <div className="flex justify-center mb-4 text-brand-900 opacity-80">
                    <Users size={24} />
                  </div>
                  <h3 className="font-serif text-xl text-center text-brand-900 mb-4">Life Together</h3>
                  <p className="font-serif italic text-gray-500 text-center leading-relaxed text-sm">
                    "For where two or three are gathered in my name, there am I among them."
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column (Community Grid) */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fellowships.map((fellowship, i) => (
                <motion.div 
                  key={fellowship.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col overflow-hidden group hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all"
                >
                  <div className="h-[200px] overflow-hidden shrink-0 p-3">
                    <img 
                      src={fellowship.image} 
                      alt={fellowship.name} 
                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-8 pt-4 flex flex-col flex-1">
                    <h3 className="font-serif text-2xl text-brand-900 mb-3">{fellowship.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                      {fellowship.description}
                    </p>
                    <Link to="#" className="text-accent-gold hover:text-brand-900 transition-colors text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-2 mt-auto group-hover:gap-3 w-fit">
                      Learn More <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* Bottom CTA Area */}
      <section className="bg-[#f7f8f9] py-32 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif italic text-4xl md:text-5xl text-brand-900 mb-6">
              Still searching for your place?
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              Our community guides are here to help you navigate the different fellowships and find the one that feels like home.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-3.5 bg-brand-900 text-white rounded-xl font-bold text-sm hover:bg-brand-800 transition-colors shadow-lg shadow-brand-900/20">
                Talk to a Guide
              </button>
              <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-brand-900 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm border border-gray-200">
                Community Map
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
