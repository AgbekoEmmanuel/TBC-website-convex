import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import offeringImg from '../assets/give/offering.jpg';
import titheImg from '../assets/give/tithe.jpg';

export function Give() {

  return (
    <div className="w-full bg-[#fdfdfc] min-h-screen font-sans">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <p className="uppercase text-[11px] tracking-[0.15em] text-[#a78b30] font-bold mb-4">Generosity In Motion</p>
            <h1 className="font-serif text-[48px] md:text-[64px] text-brand-900 mb-6 leading-[1.05] font-bold">Stewardship</h1>
            <p className="text-[#4a5568] text-[16px] leading-relaxed max-w-md mb-8">
              We believe giving is an act of worship and a commitment to the flourishing of our community. Your stewardship fuels the vision of The Balance Church as we cultivate an arena of wisdom, excellence, and transformation.
            </p>
          
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-end"
          >
            {/* Stewardship Image / Mark */}
            <div className="w-full max-w-[500px] aspect-[1.1] bg-[#141f3d] rounded-[24px] shadow-2xl flex flex-col items-center justify-center p-12 relative overflow-hidden">
               {/* Internal Graphics simulating the Stewardship logo */}
               <div className="flex flex-col items-center justify-center z-10 w-full">
                 {/* Icon portion (abstract hand/block) */}
                 <div className="relative mb-6 transform -rotate-12">
                   <div className="w-12 h-16 bg-white flex flex-col gap-1 rounded-sm p-1">
                     <div className="w-full h-4 bg-[#141f3d] rounded-sm"></div>
                     <div className="w-full h-4 bg-[#141f3d] rounded-sm"></div>
                   </div>
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white"></div>
                 </div>

                 {/* Text portion */}
                 <h2 className="text-[32px] md:text-[40px] font-black tracking-widest mb-3 text-white">STEWARDSHIP</h2>
                 <div className="flex items-center justify-center gap-4 w-full">
                    <div className="h-[2px] w-12 bg-white/40"></div>
                    <span className="tracking-[0.2em] text-[11px] font-bold text-white/50">SAFE TO WORK</span>
                    <div className="h-[2px] w-12 bg-white/40"></div>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Giving Options Images */}
      <section id="contribute" className="max-w-7xl mx-auto px-6 pb-40 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-[32px] shadow-2xl shadow-black/10 aspect-[4/5] md:aspect-auto"
          >
            <img 
              src={offeringImg} 
              alt="Offering" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
               <div className="text-white">
                  <h3 className="font-serif text-3xl font-bold mb-2">Offering</h3>
                  <p className="text-white/80 text-sm">Giving into the vision and operations of the church.</p>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative overflow-hidden rounded-[32px] shadow-2xl shadow-black/10 aspect-[4/5] md:aspect-auto"
          >
            <img 
              src={titheImg} 
              alt="Tithe" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
               <div className="text-white">
                  <h3 className="font-serif text-3xl font-bold mb-2">Tithe</h3>
                  <p className="text-white/80 text-sm">Faithfulness in our stewardship and commitment.</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
