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
                <p className="text-brand-800 text-sm mb-3">+233 54 074 0816</p>
                <div className="flex gap-2">
                  <a href="tel:+233540740816" className="bg-brand-900 text-white text-[9px] uppercase tracking-widest font-bold px-4 py-2 rounded-full hover:bg-brand-800 transition-all flex items-center gap-2">
                    <Phone size={12} /> Call Now
                  </a>
                  <a href="https://wa.me/233540740816" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white text-[9px] uppercase tracking-widest font-bold px-4 py-2 rounded-full hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-600/20">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> WhatsApp
                  </a>
                </div>
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
