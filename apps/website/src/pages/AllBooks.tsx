import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import book1 from '../assets/books/BREAKING MID.png';
import book2 from '../assets/books/photo_2026-04-21_22-32-55.jpg';
import book3 from '../assets/books/photo_2026-04-21_22-33-15.jpg';
import book4 from '../assets/books/principles of life cover.jpeg';
import book5 from '../assets/books/transformedfront.jpeg';

const allBooks = [
  {
    title: "Breaking Mediocrity",
    price: "GH₵ 100.00",
    desc: "An invitation to the contemplative life, exploring the silence that precedes the Word.",
    img: book1,
    tag: "Bestseller"
  },
  {
    title: "Come Boldly",
    price: "GH₵ 100.00",
    desc: "Understanding the cadence of the Spirit in our daily labor and intentional rest.",
    img: book2,
    tag: "New Release"
  },
  {
    title: "The Leadership Principles of Jesus",
    price: "GH₵ 100.00",
    desc: "A deep dive into ancient practices for the digital age. Reclaiming our sacred habits.",
    img: book3,
    tag: "Essential"
  },
  {
    title: "The Force of Mentorship",
    price: "GH₵ 100.00",
    desc: "Building a life of impact through intentional faith and community leadership.",
    img: book1,
    tag: "Growth"
  },
  {
    title: "Kingdom Prosperity",
    price: "GH₵ 100.00",
    desc: "Daily meditations for the modern seeker found in the quiet moments of dawn.",
    img: book2,
    tag: "Devotional"
  },
  {
    title: "Principles of Life",
    price: "GH₵ 100.00",
    desc: "Foundational truths and spiritual laws that govern the pursuit of an excellent and balanced life.",
    img: book4,
    tag: "Wisdom"
  },
  {
    title: "Transformed",
    price: "GH₵ 100.00",
    desc: "A journey into the metamorphic power of the Word, renewing the mind and spirit for divine purpose.",
    img: book5,
    tag: "Spiritual Growth"
  }
];

export function AllBooks() {
  return (
    <div className="w-full bg-[#fdfdfc] min-h-screen font-sans">
      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <Link 
          to="/library" 
          className="flex items-center gap-2 text-gray-500 hover:text-brand-900 transition-colors group"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Library</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-16 text-center">
        <p className="uppercase text-[11px] tracking-[0.25em] text-[#a78b30] font-bold mb-4">Complete Collection</p>
        <h1 className="font-serif text-[48px] md:text-[64px] text-brand-900 mb-6 leading-tight">
          The Literary Archive
        </h1>
        <p className="text-gray-500 text-[16px] leading-relaxed max-w-2xl mx-auto">
          Explore the full repository of wisdom, faith, and leadership insights penned by Apostle Michael Dadzie. Each volume is designed to catalyze your spiritual and personal transformation.
        </p>
      </section>

      {/* Books Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {allBooks.map((book, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col group"
            >
              <div className="aspect-[3/4] bg-[#f2f4f7] rounded-[24px] overflow-hidden relative shadow-md transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-brand-900/10 mb-8">
                <img 
                  src={book.img} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-sm text-brand-900 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                    {book.tag}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
              </div>

              <div className="flex flex-col flex-1 px-2">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="font-serif text-[24px] text-brand-900 leading-tight group-hover:text-[#a78b30] transition-colors">
                    {book.title}
                  </h3>
                </div>
                <p className="text-gray-500 text-[14px] leading-relaxed mb-6 line-clamp-2">
                  {book.desc}
                </p>
                
                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-serif font-bold text-brand-900 text-[20px]">
                    {book.price}
                  </span>
                  <button 
                    onClick={() => window.open(`https://wa.me/233509955970?text=Hello, I would like to order "${book.title}"`, '_blank')}
                    className="bg-[#112040] hover:bg-brand-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <ShoppingBag size={14} />
                    Place Order
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Simple Footer Inquiry */}
      <section className="bg-[#112040] py-20 px-6 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-[32px] mb-4 italic">Bulk Orders & Signed Copies</h2>
          <p className="text-white/60 text-[15px] mb-10 leading-relaxed">
            Interested in bulk purchases for your organization or a personalized signed copy? Connect with our team for specialized delivery options.
          </p>
          <button 
            onClick={() => window.open('https://wa.me/233509955970?text=Hello, I have an inquiry regarding the books.', '_blank')}
            className="inline-block bg-[#fdb50d] hover:bg-[#e5a00a] text-brand-900 font-bold tracking-[0.2em] uppercase text-[11px] px-10 py-4 rounded-xl transition-all shadow-lg cursor-pointer"
          >
            Inquire Now
          </button>
        </div>
      </section>
    </div>
  );
}
