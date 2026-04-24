import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const ministries = [
  {
    id: 'kids',
    title: 'Lumi Kids',
    description: 'A safe, fun, and engaging environment where children (infants through 5th grade) learn about God\'s love through interactive stories and worship.',
    image: 'https://picsum.photos/seed/kidsmin/1000/800',
    color: 'bg-blue-50'
  },
  {
    id: 'youth',
    title: 'Lumi Youth',
    description: 'Empowering middle and high school students to build a faith of their own, form lasting friendships, and make a difference in their schools.',
    image: 'https://picsum.photos/seed/youthmin/1000/800',
    color: 'bg-emerald-50'
  },
  {
    id: 'young-adults',
    title: 'Young Adults',
    description: 'A community for college students and young professionals seeking authentic relationships, deep discussions, and purposeful living.',
    image: 'https://picsum.photos/seed/yamin/1000/800',
    color: 'bg-amber-50'
  },
  {
    id: 'groups',
    title: 'Small Groups',
    description: 'Life is better together. Join a small group to connect with others, grow in your faith, and do life with people in your neighborhood.',
    image: 'https://picsum.photos/seed/smallgroups/1000/800',
    color: 'bg-purple-50'
  }
];

export function Ministries() {
  return (
    <div className="w-full pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gold-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-6"
        >
          Get Connected
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif italic text-6xl text-brand-900 mb-6"
        >
          Ministries
        </motion.h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-24">
        {ministries.map((ministry, i) => {
          const isEven = i % 2 === 0;
          return (
            <div key={ministry.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
              <motion.div 
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2"
              >
                <div className={`relative p-8 md:p-12 rounded-[100px] ${ministry.color} border border-accent-100`}>
                  <img 
                    src={ministry.image} 
                    alt={ministry.title} 
                    className="w-full h-[400px] md:h-[500px] object-cover rounded-[80px] shadow-xl border-[8px] border-white mix-blend-multiply opacity-90"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2 space-y-6"
              >
                <h2 className="font-serif italic text-4xl md:text-5xl text-brand-900">{ministry.title}</h2>
                <div className="w-12 h-px bg-gold-500 my-4"></div>
                <p className="text-lg text-brand-800 leading-relaxed max-w-lg">
                  {ministry.description}
                </p>
                <div className="pt-4">
                  <button className="text-brand-900 hover:text-gold-500 font-bold uppercase tracking-widest text-[10px] inline-flex items-center gap-4 transition-colors group">
                    Learn more <ArrowRight className="group-hover:translate-x-2 transition-transform w-4 border border-brand-900 rounded-full p-0.5 group-hover:border-gold-500" />
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
