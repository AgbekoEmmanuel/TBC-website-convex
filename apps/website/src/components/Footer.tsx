import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, CreditCard, Facebook, Instagram, Youtube } from 'lucide-react';
import logo from '../assets/TBC logo transparent.png';

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function Footer() {
  return (
    <footer className="bg-brand-900 pt-24 pb-16 font-sans px-6 text-white text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Logo and Tagline */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <img 
            src={logo} 
            alt="The Balance Church" 
            className="h-16 w-auto object-contain mx-auto brightness-0 invert mb-6"
          />
          <p className="text-white/60 text-[14px] font-medium tracking-wide max-w-sm mx-auto leading-relaxed">
            Where impact is made, destinies are fulfilled and territories are taken.
          </p>
        </motion.div>

        {/* Middle Section: Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Email */}
          <motion.div variants={itemVariants} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="flex flex-col items-center">
            <Mail className="w-6 h-6 text-white mb-4" />
            <h3 className="font-bold text-lg mb-2">Email</h3>
            <p className="text-white/60 text-[13px]">info@thebalancechurch.com</p>
          </motion.div>

          {/* Office */}
          <motion.div variants={itemVariants} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="flex flex-col items-center">
            <Phone className="w-6 h-6 text-white mb-4" />
            <h3 className="font-bold text-lg mb-2">The Balance Church Office</h3>
            <p className="text-white/60 text-[13px]">+233 00 000 0000</p>
          </motion.div>

          {/* Address */}
          <motion.div variants={itemVariants} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="flex flex-col items-center">
            <MapPin className="w-6 h-6 text-white mb-4" />
            <h3 className="font-bold text-lg mb-2">Location</h3>
            <p className="text-white/60 text-[13px] max-w-[200px] mx-auto">
              Hawa Avenue, Madina Estates<br />Accra, Ghana
            </p>
          </motion.div>

          {/* Give */}
          <motion.div variants={itemVariants} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="flex flex-col items-center">
            <CreditCard className="w-6 h-6 text-white mb-4" />
            <h3 className="font-bold text-lg mb-2">Give</h3>
            <Link to="/give" className="text-white/60 text-[13px] hover:text-white transition-colors underline underline-offset-4">Give Online</Link>
          </motion.div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-8 mb-16">
          <a href="https://www.facebook.com/michael.dadzie.001" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            <Facebook size={22} />
          </a>
          <a href="https://instagram.com/_thebalancechurch" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            <Instagram size={22} />
          </a>
          <a href="https://tiktok.com/@thebalancechurch" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            <TikTokIcon size={22} />
          </a>
          <a href="https://www.youtube.com/@ApostleMichaelDadzie" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
            <Youtube size={22} />
          </a>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-12 border-t border-white/10">
          <p className="text-white/40 text-[11px] font-medium uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} The Balance Church. All rights reserved.
          </p>
          <p className="text-white/20 text-[9px] mt-4 tracking-widest font-light">
            Raised in Excellence, Established in Wisdom
          </p>
        </div>
      </div>
    </footer>
  );
}
