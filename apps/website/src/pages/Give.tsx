import { motion } from 'motion/react';
import { Shield, Lock, ChevronDown, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function Give() {
  const [giveType, setGiveType] = useState<'One-time' | 'Recurring'>('One-time');
  const [amount, setAmount] = useState<string>('50');

  const faqs = [
    {
      question: "Is my donation tax-deductible?",
      answer: "Yes, Balance Church is a registered 501(c)(3) non-profit organization. All donations are tax-deductible as allowed by law. You will receive an annual giving statement for your records each January."
    },
    {
      question: "Can I change or cancel a recurring gift?",
      answer: "Absolutely. You can manage your recurring donations at any time by logging into your Balance Church account or contacting our finance office directly."
    },
    {
      question: "Where does my money go?",
      answer: "General Fund donations support our daily ministries, staff, and campus maintenance. Designated funds (like Building or Missions) are used exclusively for those specific purposes as overseen by our board."
    }
  ];

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
              We believe giving is an act of worship and a commitment to the flourishing of our community. Your stewardship fuels the vision of Balance Church as we cultivate a sanctuary of hope, growth, and connection.
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-[#e2e8f0]/60 p-3 rounded-xl text-brand-900 shrink-0">
                <Shield size={20} fill="currentColor" className="text-brand-900/10" strokeWidth={1.5} />
              </div>
              <span className="text-[13px] text-[#718096] font-medium leading-relaxed max-w-[250px]">
                Secure, encrypted transactions powered by industry-leading standards.
              </span>
            </div>
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

      {/* 2. Contribution Form bg shadow box */}
      <section id="contribute" className="max-w-3xl mx-auto px-6 pb-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="bg-white rounded-[32px] shadow-[0_20px_60px_rgb(0,0,0,0.05)] p-8 md:p-14 text-center"
        >
          <h2 className="font-serif text-[32px] font-bold text-brand-900 mb-2">Make a Contribution</h2>
          <p className="text-[#718096] text-[15px] mb-12">Invest in the mission and future of Balance Church</p>

          <div className="flex justify-center mb-10">
            <div className="bg-[#f2f4f7] p-1.5 rounded-full flex max-w-[340px] w-full border border-gray-200/60">
               <button 
                  onClick={() => setGiveType('One-time')}
                  className={`flex-1 py-3 text-[13px] font-bold rounded-full transition-all ${giveType === 'One-time' ? 'bg-white text-brand-900 shadow-sm border border-gray-200' : 'text-[#718096] hover:text-brand-900'}`}
               >
                 One-time
               </button>
               <button 
                  onClick={() => setGiveType('Recurring')}
                  className={`flex-1 py-3 text-[13px] font-bold rounded-full transition-all ${giveType === 'Recurring' ? 'bg-white text-brand-900 shadow-sm border border-gray-200' : 'text-[#718096] hover:text-brand-900'}`}
               >
                 Recurring
               </button>
            </div>
          </div>

          <p className="text-[10px] font-bold tracking-[0.15em] text-[#a0aabf] uppercase mb-4">Select Amount</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {['25', '50', '100'].map((val) => (
              <button 
                key={val}
                onClick={() => setAmount(val)}
                className={`py-4 rounded-xl border flex items-center justify-center font-serif text-xl transition-all ${amount === val ? 'border-brand-900 text-brand-900 bg-[#f8fafe] ring-1 ring-brand-900' : 'border-[#e2e8f0] text-brand-900 hover:border-brand-900/40'}`}
              >
                ${val}
              </button>
            ))}
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 flex border-none bg-transparent font-serif text-xl text-[#a0aabf]">$</span>
              <input 
                type="text" 
                placeholder="Other" 
                onFocus={() => setAmount('Other')}
                className={`w-full h-full py-4 pl-10 pr-4 rounded-xl border focus:outline-none focus:border-brand-900 focus:ring-1 focus:ring-brand-900 font-serif text-xl transition-all ${amount === 'Other' ? 'border-brand-900 text-brand-900 bg-[#f8fafe] ring-1 ring-brand-900' : 'border-[#e2e8f0] text-[#718096] hover:border-brand-900/40'}`}
              />
            </div>
          </div>

          <p className="text-[10px] font-bold tracking-[0.15em] text-[#a0aabf] uppercase mb-4">Designate Your Gift</p>
          <div className="relative mb-10 text-left">
            <select className="w-full appearance-none bg-[#f2f4f7] border border-transparent hover:border-[#e2e8f0] rounded-xl py-4 px-6 text-[14px] text-brand-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-900/20 cursor-pointer transition-colors">
              <option>General Fund (Daily Operations & Ministry)</option>
              <option>Building Fund</option>
              <option>Missions & Outreach</option>
            </select>
            <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#a0aabf] pointer-events-none" />
          </div>

          <button className="w-full bg-[#112040] hover:bg-brand-900 text-white py-4 rounded-xl text-[15px] font-bold transition-all mb-5 shadow-lg flex items-center justify-center gap-2 group">
            Continue to Secure Payment <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#a0aabf] font-medium">
            <Lock size={12} /> Your information is protected by 256-bit SSL encryption
          </div>
        </motion.div>
      </section>

      {/* 3. Giving FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 pb-40">
        <div className="text-center mb-10">
          <h2 className="font-serif text-[36px] font-bold text-brand-900 mb-4 tracking-tight">Giving FAQ</h2>
          <div className="w-12 h-1 bg-[#d8b556] mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 md:p-10 rounded-[20px] border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]"
            >
              <h3 className="font-serif text-[20px] font-bold text-brand-900 mb-3">{faq.question}</h3>
              <p className="text-[#4a5568] text-[14px] leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
