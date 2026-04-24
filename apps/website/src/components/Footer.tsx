import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import logo from '../assets/TBC logo transparent.png';

const containerVariants = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function Footer() {
  const location = useLocation();
  const isBlueRoute = ['/media', '/events', '/communities', '/about'].some(route => location.pathname.startsWith(route));

  // Conditional styles
  const bgClass = isBlueRoute ? "bg-brand-900 border-transparent" : "bg-[#f7f8f9] border-gray-100";
  const headingClass = isBlueRoute ? "text-[#a0aabf]" : "text-gray-500";
  const textClass = isBlueRoute ? "text-white/70" : "text-[#a0aabf]";
  const linkHoverClass = isBlueRoute ? "hover:text-white" : "hover:text-brand-900";
  const logoContrast = isBlueRoute ? "brightness-0 invert opacity-90" : "";

  return (
    <footer className={`${bgClass} pt-20 pb-12 font-sans px-6 border-t transition-colors duration-300`}>
      <motion.div 
        variants={containerVariants}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 text-sm"
      >
        
        {/* Logo & Info column */}
        <motion.div variants={itemVariants} className="md:w-1/3">
          <div className="mb-6">
            <img 
              src={logo} 
              alt="The Balance Church" 
              className={`h-14 w-auto object-contain transition-all ${logoContrast}`}
            />
          </div>
          <p className={`${textClass} text-[13px] max-w-[280px] leading-relaxed transition-colors`}>
            Where impact is made, destinies are fulfilled and territories are taken.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-16 md:w-2/3 md:justify-end">
          {/* Explore Links */}
          <motion.div variants={itemVariants}>
            <h3 className={`${headingClass} mb-6 text-[13px] transition-colors`}>Explore</h3>
            <ul className={`flex flex-col gap-4 text-[13px] ${textClass}`}>
              <li><Link to="/media" className={`${linkHoverClass} transition-colors`}>Media</Link></li>
              <li><Link to="/events" className={`${linkHoverClass} transition-colors`}>Events</Link></li>
              <li><Link to="/contact" className={`${linkHoverClass} transition-colors`}>Connect</Link></li>
            </ul>
          </motion.div>

          {/* Connect Links */}
          <motion.div variants={itemVariants}>
            <h3 className={`${headingClass} mb-6 text-[13px] transition-colors`}>Connect</h3>
            <ul className={`flex flex-col gap-4 text-[13px] ${textClass}`}>
              <li><Link to="/contact" className={`${linkHoverClass} transition-colors`}>Contact</Link></li>
              <li><Link to="/about#leadership" className={`${linkHoverClass} transition-colors`}>Staff</Link></li>
              <li><Link to="/about" className={`${linkHoverClass} transition-colors`}>Locations</Link></li>
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div variants={itemVariants}>
            <h3 className={`${headingClass} mb-6 text-[13px] transition-colors`}>Legal</h3>
            <ul className={`flex flex-col gap-4 text-[13px] ${textClass}`}>
              <li><a href="#" className={`${linkHoverClass} transition-colors`}>Privacy Policy</a></li>
              <li><a href="#" className={`${linkHoverClass} transition-colors`}>Terms of Service</a></li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="max-w-7xl mx-auto mt-20 text-center"
      >
        <p className={`${textClass} text-[11px] transition-colors`}>
          &copy; {new Date().getFullYear()} Balance Church. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
