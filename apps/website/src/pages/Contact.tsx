import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Contact() {
  return (
    <div className="w-full pt-32 pb-20 bg-warm-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gold-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-6"
        >
          We'd love to hear from you
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif italic text-6xl text-brand-900 mb-6"
        >
          Contact & Visit
        </motion.h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info & Map */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="bg-white p-10 rounded-[60px] shadow-xl border border-accent-100 space-y-8">
            <h3 className="font-serif italic text-3xl text-brand-900 border-b border-accent-100 pb-4">Our Location</h3>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-accent-100 text-brand-900 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-gold-500 mb-1">Address</h4>
                <p className="text-brand-800 text-sm">Hawa Avenue<br />Madina Estates</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-accent-100 text-brand-900 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-gold-500 mb-1">Service Times</h4>
                <p className="text-brand-800 text-sm">Sundays: 10:00 AM<br />Wednesdays: 6:30 PM<br />The Dome of Excellence</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-accent-100 text-brand-900 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-gold-500 mb-1">Phone</h4>
                <p className="text-brand-800 text-sm">(912) 555-0198</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-accent-100 text-brand-900 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-gold-500 mb-1">Email</h4>
                <p className="text-brand-800 text-sm">thebalance@church.org</p>
              </div>
            </div>
          </div>

          <div className="h-64 rounded-[40px] overflow-hidden shadow-xl border border-accent-100 relative group">
            {/* Embedded Google Map */}
            <iframe 
              src="https://maps.google.com/maps?q=The+Balance+Church&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              className="w-full h-full object-cover border-0 grayscale opacity-90 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <a 
                 href="https://maps.app.goo.gl/RmjrT9GME6RqpXYu5"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="bg-white py-2 px-4 rounded-full shadow-lg text-brand-900 font-bold flex items-center gap-2 pointer-events-auto hover:scale-105 transition-transform"
               >
                 <MapPin className="text-gold-500" size={18} /> Get Directions
               </a>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-brand-900 p-10 md:p-14 rounded-[60px] text-warm-50 shadow-2xl"
        >
          <h3 className="font-serif italic text-4xl mb-2">Send us a message</h3>
          <p className="text-gold-500 mb-8 font-serif italic opacity-90">Have a question or need prayer? Reach out below.</p>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#D6CDC2]">First Name</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b border-[#5C554F] py-2 text-white focus:outline-none focus:border-gold-500 transition-colors font-sans text-sm"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#D6CDC2]">Last Name</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b border-[#5C554F] py-2 text-white focus:outline-none focus:border-gold-500 transition-colors font-sans text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#D6CDC2]">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-transparent border-b border-[#5C554F] py-2 text-white focus:outline-none focus:border-gold-500 transition-colors font-sans text-sm"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#D6CDC2]">Message</label>
              <textarea 
                rows={4}
                className="w-full bg-transparent border-b border-[#5C554F] py-2 text-white focus:outline-none focus:border-gold-500 transition-colors font-sans text-sm resize-none"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button className="w-full bg-white hover:bg-gold-500 hover:text-white text-brand-900 font-bold py-4 rounded-full transition-colors text-[11px] uppercase tracking-widest">
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
