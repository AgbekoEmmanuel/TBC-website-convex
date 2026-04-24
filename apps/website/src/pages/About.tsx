import { motion } from 'motion/react';
import { Share2, MapPin, Smile, Instagram, Youtube, Music, Facebook, ArrowRight, Gem, Flag, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import pastorImg from '../assets/Apostle.jpg.jpeg.png';
const storyVideo = "https://drive.google.com/uc?export=download&id=1hUMIjCGbBBre8WRzW1KGfS1Eh7tkY_j-"; 
const introVideo = "https://drive.google.com/uc?export=download&id=0B78FI5-mZakRQ2UxS0liVV9UUzQ&resourcekey=0-EF16VX8BPj36SPny2s0MtQ";
import socialsImg from '../assets/socials.jpg';

const modelsOfEmphasis = [
  "Jesus",
  "The Holy Spirit",
  "The Church",
  "Consecration",
  "Capacity building",
  "Mentorship",
  "Early achievement/arrival",
  "Posterity",
  "Excellence",
  "Diligence",
  "Wisdom",
  "Prosperity",
  "Influence",
  "Leadership",
  "Honour",
  "Business"
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const TikTokIcon = ({ size = 24 }: { size?: number }) => (
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

export function About() {
  return (
    <div className="w-full font-sans">
      
      {/* 0. Cinematic Hero Video */}
      <section className="w-full bg-brand-900 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative aspect-video w-full overflow-hidden shadow-2xl bg-black"
          >
            <video 
              src={introVideo} 
              controls 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>
      
      {/* 1. Hero Section */}
      <section className="bg-white py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <p className="uppercase text-[10px] tracking-[0.2em] text-accent-gold font-bold mb-6">Our Journey</p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-[80px] text-brand-900 mb-8 leading-[1.1]">Our Story</h1>
            <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-md">
              Founded on the belief that life has both the spiritual and physical principles that when balanced leads to dominion. The Balance Church has dedicated itself to raising a generation of young people who are grounded in the word of God and equipped to make an impact in the world. 
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1 }}
            className="h-[400px] md:h-[700px] flex justify-center items-center"
          >
            <video 
              src={storyVideo} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="h-full w-auto object-contain rounded-2xl border-2 border-gray-200/60"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. Models of Emphasis Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#120822] via-[#21113b] md:via-[#321741] to-[#3a1a40] py-24 md:py-32">
        {/* Background glow & graphics */}
        <div className="absolute top-1/4 right-[20%] w-[600px] h-[600px] bg-[#8d2a6a]/20 blur-[130px] rounded-full pointer-events-none" />
        
        {/* Bottom Right Hand/Diamond Watermark */}
        <div className="absolute bottom-[-10%] right-[-5%] md:right-[5%] opacity-10 pointer-events-none origin-bottom-right scale-100 md:scale-125">
           {/* Stylized placeholder for the screenshot's diamond in hand */}
           <div className="relative">
             <Gem size={320} strokeWidth={1} className="text-[#e2cae5] -translate-x-12 translate-y-12 shrink-0 drop-shadow-2xl" />
             <svg width="400" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-[#e2cae5] absolute inset-0 top-1/2 left-0 mt-8">
                {/* Simplified hand path outline */}
                <path d="M 0 12 L 6 12 C 10 12 12 18 18 18 L 30 18" />
                <path d="M 0 18 L 8 18 C 12 18 16 22 22 22 L 30 22" />
             </svg>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          
          {/* Left Side: Rotated Text */}
          <div className="hidden md:flex items-center justify-center h-full min-w-[200px] lg:min-w-[250px]">
            {/* 
               Using writing-mode + 180deg rotate creates the exact bottom-to-top 
               reading effect seen in the screenshot where 'Models of' is stacked 
               on the left and reads upwards. 
            */}
            <h2 
              className="text-white font-sans font-black md:text-[85px] lg:text-[110px] leading-[0.85] tracking-tighter whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Models of<br/>
              Emphasis
            </h2>
          </div>
          
          {/* Mobile Text */}
          <div className="md:hidden w-full">
            <h2 className="text-white font-sans font-black text-[13vw] leading-[0.9] tracking-tighter">
              Models of<br/><span className="text-[#ececf0]">Emphasis</span>
            </h2>
          </div>

          {/* Right Side: List Items */}
          <div className="w-full relative z-10 flex-1">
            <ul className="flex flex-col gap-2 md:gap-3 lg:gap-[18px]">
              {modelsOfEmphasis.map((item, idx) => (
                <motion.li 
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex items-center gap-5 md:gap-8"
                >
                  {/* Hollow circular bullet */}
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-[2.5px] border-white/90 shrink-0" />
                  <span className="text-white text-[22px] md:text-[32px] lg:text-[38px] font-sans font-light tracking-wide leading-none">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* 3. Mission / Vision Section */}
      <section id="mission" className="bg-[#f7f8f9] pt-20 md:pt-28 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
          >
            {/* Mission (Navy/Dark Blue) */}
            <div className="md:w-1/2 bg-[#000a3d] p-12 md:p-16 flex flex-col justify-center items-center text-center relative overflow-hidden">
              {/* Subtle Target graphic watermark from the image */}
              <div className="absolute bottom-[-10%] left-[-10%] opacity-[0.06] pointer-events-none transform -rotate-12">
                 <Target size={350} strokeWidth={1} className="text-white" />
              </div>

              <h2 className="font-sans font-black text-4xl md:text-5xl text-white tracking-tight mb-8 leading-none drop-shadow-sm">
                Mission<br />Statement
              </h2>
              <div className="text-white leading-relaxed text-[17px] md:text-[19px] font-sans font-medium max-w-[380px] drop-shadow-sm z-10 flex flex-col gap-8">
                <p>
                  Declaring the holistic message of balance with an ambidextrous mandate to incorporate earthly and spiritual principles for dominion.
                </p>
                <p className="font-bold text-[19px]">Nehemiah 4:17-18</p>
              </div>
            </div>
            {/* Vision (Vibrant Gradient) */}
            <div className="md:w-1/2 bg-gradient-to-br from-[#fc1b01] via-[#fa4206] to-[#fdb50d] p-12 md:p-16 flex flex-col justify-center items-center text-center relative overflow-hidden">
              {/* Subtle mountain/flag graphic watermark from the image */}
              <div className="absolute bottom-[-10%] left-[-10%] opacity-[0.08] pointer-events-none transform -rotate-12">
                 <Flag size={300} fill="currentColor" className="text-white" />
              </div>
              
              <h2 className="font-sans font-black text-4xl md:text-5xl text-white tracking-tight mb-8 leading-none drop-shadow-sm">
                Vision<br />Statement
              </h2>
              <div className="text-white leading-relaxed text-[17px] md:text-[19px] font-sans font-medium max-w-[380px] drop-shadow-sm z-10 flex flex-col gap-8">
                <p>
                  Raising and equipping the younger generation with a dispensational body of truth consistent with the civilization to invade and dominate the mountains of influence until the kingdoms of the world become the kingdom of our Lord.
                </p>
                <p className="font-bold text-[19px]">Isaiah 2:2</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Leadership Section */}
      <section id="leadership" className="bg-white py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <motion.p variants={fadeIn} initial="initial" whileInView="whileInView" className="text-[#a0aabf] uppercase tracking-[0.2em] text-[10px] font-bold mb-4">
              Meet Our Pastor
            </motion.p>
            <motion.h2 variants={fadeIn} initial="initial" whileInView="whileInView" className="font-serif text-5xl md:text-6xl text-brand-900">
              Leadership
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Pastor Image */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-5"
            >
              <img 
                src={pastorImg} 
                alt="Apostle Michael Dadzie" 
                className="w-full h-auto object-contain"
              />
            </motion.div>

            {/* Pastor Bio */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col lg:col-span-7 justify-center"
            >
              <h3 className="font-serif text-[40px] md:text-5xl text-brand-900 mb-2">Apostle Michael Dadzie</h3>
              <p className="text-accent-gold uppercase tracking-[0.2em] text-[11px] font-bold mb-8">Lead Pastor</p>
              
              <div className="text-gray-500 text-[16px] leading-relaxed flex flex-col gap-6">
                <p>
                  Apostle Michael Dadzie, a man set apart for the master's use whose assignment is for the liberation of young people through the incorporation of spiritual and earthly principles for dominion, succinctly the ambidextrous mandate. He is the Lead Pastor of the Balance Church. He has for the past 15 years dedicated his life to impacting the youth and ensuring that they are nourished spiritually, emotionally, psychologically and any facet of life possible.
                </p>
                <p>
                  He commenced his Ministry on the land of Ghana National College and it evolved to Gathering of Champions Network in Accra, Ghana and finally established The Balance Church in Prime Accra. With the ambidextrous mandate given to him to incorporate earthly and spiritual principles for dominion, he continues to charge and challenge the youth of this generation to affect their world.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. What to Expect (Navy Section) */}
      <section id="expect" className="bg-brand-900 text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl mb-16"
          >
            What to Expect
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" transition={{ delay: 0.1 }} className="flex flex-col h-full">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Share2 size={16} className="text-accent-gold" />
              </div>
              <h3 className="text-xl font-bold mb-4">Service Style</h3>
              <p className="text-blue-100/70 text-[15px] leading-relaxed mb-8 flex-1">
               You'll experience high-energy worship, followed by a practical, biblical message designed to help you navigate your life with direction and purpose.
              </p>
              <p className="text-accent-gold text-[10px] font-bold uppercase tracking-[0.15em]">
                Every Sunday @ 10AM
              </p>
            </motion.div>

            <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" transition={{ delay: 0.2 }} className="flex flex-col h-full">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <MapPin size={16} className="text-accent-gold" />
              </div>
              <h3 className="text-xl font-bold mb-4">Parking & Arrival</h3>
              <p className="text-blue-100/70 text-[15px] leading-relaxed mb-8 flex-1">
                Located in the heart of the city, we have dedicated parking for guests. Look for our welcome banners; our team will be there to guide you from your car to your seat.
              </p>
              <Link to="/contact" className="text-white hover:text-accent-gold text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1 transition-colors">
                View Map <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" transition={{ delay: 0.3 }} className="flex flex-col h-full">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Smile size={16} className="text-accent-gold" />
              </div>
              <h3 className="text-xl font-bold mb-4">Sense of belonging</h3>
              <p className="text-blue-100/70 text-[15px] leading-relaxed mb-8 flex-1">
               We are a community where everyone is welcomed, valued, and empowered to live out their God-given potential.
              </p>
              <p className="text-accent-gold text-[10px] font-bold uppercase tracking-[0.15em]">
                The Balance Family
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Connect With Us & Socials */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-brand-900 mb-10"
          >
            Connect With Us
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/contact" className="bg-brand-900 hover:bg-[#112040] text-white font-bold px-10 py-4 rounded-xl text-[15px] transition-colors shadow-lg flex items-center justify-center gap-3 group">
              Get in Touch <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.p variants={fadeIn} initial="initial" whileInView="whileInView" className="text-accent-gold uppercase tracking-[0.15em] text-[10px] font-bold mb-4">
                Follow Along
              </motion.p>
              <motion.h2 variants={fadeIn} initial="initial" whileInView="whileInView" className="font-serif text-5xl md:text-6xl text-brand-900 mb-6">
                Stay Connected
              </motion.h2>
              <motion.p variants={fadeIn} initial="initial" whileInView="whileInView" className="text-gray-500 max-w-lg mx-auto lg:mx-0 text-[15px] leading-relaxed">
                Join our online community and stay updated with daily encouragement, event announcements, and behind-the-scenes moments.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-[32px] overflow-hidden border-8 border-gray-50 shadow-2xl"
            >
              <img 
                src={socialsImg} 
                alt="Social Community" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Instagram, name: 'Instagram', url: 'https://instagram.com/_thebalancechurch' },
              { icon: Youtube, name: 'YouTube', url: 'https://www.youtube.com/@ApostleMichaelDadzie' },
              { icon: TikTokIcon, name: 'TikTok', url: 'https://tiktok.com/@thebalancechurch' },
              { icon: Facebook, name: 'Facebook', url: 'https://www.facebook.com/michael.dadzie.001' },
            ].map((social, i) => (
              <motion.a 
                href={social.url}
                target={social.url !== '#' ? "_blank" : undefined}
                rel={social.url !== '#' ? "noopener noreferrer" : undefined}
                key={social.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[24px] p-8 flex flex-col items-center justify-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 group cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-[#f7f8f9] flex items-center justify-center text-brand-900 mb-4 group-hover:bg-brand-900 group-hover:text-white transition-colors overflow-hidden">
                  <social.icon size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-brand-900 transition-colors">
                  {social.name}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
