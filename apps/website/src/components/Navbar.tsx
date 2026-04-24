import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../assets/TBC logo transparent.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { 
    name: 'Media', 
    path: '/media',
    subItems: [
      { name: 'Live', hash: '#live' },
      { name: 'Recent Messages', hash: '#recent-messages' },
      { name: 'Podcasts', hash: '#podcasts' },
      { name: 'Gallery', path: '/gallery' }
    ]
  },
  { name: 'Events', path: '/events' },
  { name: 'Communities', path: '/communities' },
  { 
    name: 'Give', 
    path: '/give',
    subItems: [
      { name: 'Contribute', hash: '#contribute' },
      { name: 'Giving FAQ', hash: '#faq' }
    ]
  },
  { 
    name: 'Library', 
    path: '/library',
    subItems: [
      { name: 'New Releases', hash: '#new-releases' },
      { name: 'All Publications', hash: '#publications' },
      { name: 'Purchase Inquiry', hash: '#inquiry' }
    ]
  },
  { 
    name: 'About', 
    path: '/about',
    subItems: [
      { name: 'Mission & Vision', hash: '#mission' },
      { name: 'Leadership', hash: '#leadership' },
      { name: 'What to Expect', hash: '#expect' }
    ]
  },
];

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={false}
      animate={{
        width: scrolled ? "min(95%, 1280px)" : "100%",
        top: scrolled ? "16px" : "0px",
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.65)" : "rgba(247, 248, 249, 1)",
        paddingTop: scrolled ? "10px" : "20px",
        paddingBottom: scrolled ? "10px" : "20px",
        borderRadius: scrolled ? "24px" : "0px",
        boxShadow: scrolled ? "0 20px 40px -15px rgba(0, 0, 0, 0.15)" : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      }}
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-[100] transition-colors duration-500",
        scrolled ? "backdrop-blur-2xl border border-white/40" : "w-full"
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center transition-all duration-500",
        scrolled && "px-8 md:px-12"
      )}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.img 
            animate={{ height: scrolled ? 28 : 44 }}
            src={logo} 
            alt="The Balance Church" 
            className="w-auto object-contain"
          />
        </Link>

        {/* Desktop Center Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, idx) => {
            const isActive = link.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(link.path);
            
            return (
              <div 
                key={link.path}
                className="relative py-2"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link
                  to={link.path}
                  className={cn(
                    "relative text-[13px] font-semibold tracking-wide pb-1 transition-all duration-300 flex items-center gap-1",
                    isActive 
                      ? 'text-link-blue' 
                      : (hoveredIndex === idx ? 'text-black' : 'text-gray-500 hover:text-black')
                  )}
                >
                  {link.name}
                  
                  {/* Animated underline */}
                  <motion.span 
                    layoutId="underline"
                    className={cn(
                      "absolute bottom-0 left-0 w-full h-[2px] origin-left transition-transform duration-300 ease-out",
                      isActive 
                        ? 'bg-link-blue scale-x-100' 
                        : (hoveredIndex === idx ? 'bg-black scale-x-100' : 'bg-black scale-x-0')
                    )}
                  />
                </Link>

                {link.subItems && (
                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                      >
                        <div className="bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-2xl border border-gray-100/50 py-3 min-w-[220px] overflow-hidden">
                          {link.subItems.map((sub) => (
                            <Link
                              key={sub.name}
                              to={sub.path ? sub.path : `${link.path}${sub.hash}`}
                              onClick={() => setHoveredIndex(null)}
                              className="block px-6 py-3 text-[13px] font-medium text-gray-600 hover:text-brand-900 hover:bg-gray-50/80 transition-all whitespace-nowrap"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-brand-900 p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className={cn(
              "md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl shadow-2xl py-8 px-10 flex flex-col gap-5 z-50 max-h-[80vh] overflow-y-auto",
              scrolled ? "mt-3 rounded-[24px] border border-gray-100/50" : "border-t border-gray-100"
            )}
          >
            {navLinks.map((link) => (
              <div key={link.path} className="flex flex-col border-b border-gray-50 pb-5">
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-brand-900 font-bold text-xl pb-3 flex items-center justify-between"
                >
                  {link.name}
                </Link>
                {link.subItems && (
                  <div className="flex flex-col gap-4 pl-4 mb-2 mt-1 border-l-2 border-brand-900/10">
                    {link.subItems.map(sub => (
                      <Link
                        key={sub.name}
                        to={sub.path ? sub.path : `${link.path}${sub.hash}`}
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 font-medium text-[16px] hover:text-brand-900 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
