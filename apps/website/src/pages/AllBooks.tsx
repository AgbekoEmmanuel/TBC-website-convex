import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

const DEFAULT_BOOK_COVER = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";

function BookCard({ book, idx }: { book: any; idx: number }) {
  const storageUrl = useQuery(
    api.storage.getUrl,
    !book.imageUrl && book.imageStorageId
      ? { storageId: book.imageStorageId }
      : "skip"
  );
  const displayImageUrl = book.imageUrl || storageUrl || DEFAULT_BOOK_COVER;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
      className="flex flex-col group"
    >
      <div className="aspect-[3/4] bg-[#f2f4f7] rounded-[24px] overflow-hidden relative shadow-md transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-brand-900/10 mb-8">
        <img 
          src={displayImageUrl} 
          alt={book.title} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            book.isComingSoon ? 'opacity-85 grayscale-[15%]' : ''
          }`} 
        />
        
        {/* Top-left Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          {book.isComingSoon ? (
            <span className="bg-[#f59e0b] text-white text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-lg w-max inline-flex items-center gap-1.5 border border-amber-300/30">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Coming Soon
            </span>
          ) : (
            <>
              {idx === 0 && (
                <span className="bg-white/90 backdrop-blur-sm text-brand-900 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm w-max">
                  Featured
                </span>
              )}
              <span className={`backdrop-blur-md text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md w-max inline-flex items-center gap-1.5 ${
                book.inStock 
                  ? 'bg-emerald-600/90 text-white border border-white/20' 
                  : 'bg-rose-600/90 text-white border border-white/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${book.inStock ? 'bg-white animate-pulse' : 'bg-white/80'}`} />
                {book.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </>
          )}
        </div>

        {/* Coming soon center badge overlay */}
        {book.isComingSoon && (
          <div className="absolute inset-0 bg-[#112040]/35 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-[#112040]/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 shadow-2xl flex items-center gap-2">
              <BookOpen size={16} className="text-[#fdb50d]" />
              <p className="font-serif italic text-[#fdb50d] text-base md:text-lg tracking-wide font-normal">Coming Soon</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
      </div>

      <div className="flex flex-col flex-1 px-2">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-serif text-[24px] text-brand-900 leading-tight group-hover:text-[#a78b30] transition-colors">
            {book.title}
          </h3>
        </div>
        
        {/* Status pill tag */}
        <div className="mb-3">
          {book.isComingSoon ? (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Coming Soon
            </span>
          ) : (
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
              book.inStock 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${book.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {book.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          )}
        </div>

        <p className="text-gray-500 text-[14px] leading-relaxed mb-6 line-clamp-2">
          {book.description || (book.isComingSoon ? "An upcoming publication by Apostle Michael Dadzie. Check back soon for launch dates." : "An inspiring piece of literature for your spiritual journey.")}
        </p>
        
        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
          <span className="font-serif font-bold text-brand-900 text-[20px]">
            {book.price && book.price > 0 ? `GH₵ ${typeof book.price === 'number' ? book.price.toFixed(2) : book.price}` : 'Price TBA'}
          </span>
          {book.isComingSoon ? (
            <button 
              onClick={() => window.open(`https://wa.me/233509955970?text=Hello, I would like to inquire / pre-order the upcoming book "${book.title}"`, '_blank')}
              className="bg-[#112040] hover:bg-brand-900 text-[#fdb50d] px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer border border-[#fdb50d]/30"
            >
              <ShoppingBag size={14} />
              Pre-Order (Coming Soon)
            </button>
          ) : (
            <button 
              onClick={() => window.open(`https://wa.me/233509955970?text=Hello, I would like to ${book.inStock ? 'order' : 'pre-order'} "${book.title}"`, '_blank')}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer text-white ${
                book.inStock
                  ? 'bg-[#112040] hover:bg-brand-900'
                  : 'bg-rose-700 hover:bg-rose-800'
              }`}
            >
              <ShoppingBag size={14} />
              {book.inStock ? 'Place Order' : 'Out of Stock (Pre-Order)'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function AllBooks() {
  const [filter, setFilter] = useState<'all' | 'available' | 'coming-soon'>('all');
  const dbProducts = useQuery(api.products.getPublished);
  const allBooks = dbProducts?.filter(p => p.category === 'Books' || p.category === 'Book') || [];
  const isLoading = dbProducts === undefined;

  const filteredBooks = allBooks.filter(book => {
    if (filter === 'available') return !book.isComingSoon;
    if (filter === 'coming-soon') return !!book.isComingSoon;
    return true;
  });

  const availableCount = allBooks.filter(b => !b.isComingSoon).length;
  const comingSoonCount = allBooks.filter(b => b.isComingSoon).length;

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
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-12 text-center">
        <p className="uppercase text-[11px] tracking-[0.25em] text-[#a78b30] font-bold mb-4">Complete Collection</p>
        <h1 className="font-serif text-[48px] md:text-[64px] text-brand-900 mb-6 leading-tight">
          The Literary Archive
        </h1>
        <p className="text-gray-500 text-[16px] leading-relaxed max-w-2xl mx-auto mb-8">
          Explore the full repository of wisdom, faith, and leadership insights penned by Apostle Michael Dadzie. Each volume is designed to catalyze your spiritual and personal transformation.
        </p>

        {/* Filter Tabs */}
        {!isLoading && allBooks.length > 0 && (
          <div className="inline-flex items-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/60">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#112040] text-white shadow-md'
                  : 'text-gray-600 hover:text-brand-900'
              }`}
            >
              All Books ({allBooks.length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filter === 'available'
                  ? 'bg-[#112040] text-white shadow-md'
                  : 'text-gray-600 hover:text-brand-900'
              }`}
            >
              Available ({availableCount})
            </button>
            <button
              onClick={() => setFilter('coming-soon')}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filter === 'coming-soon'
                  ? 'bg-[#f59e0b] text-white shadow-md'
                  : 'text-amber-800 hover:bg-amber-100/50'
              }`}
            >
              Coming Soon ({comingSoonCount})
            </button>
          </div>
        )}
      </section>

      {/* Books Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        {isLoading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-900"></div>
           </div>
        ) : filteredBooks.length === 0 ? (
           <div className="text-center py-20 text-gray-500">
             {filter === 'coming-soon' 
               ? "No books currently marked as Coming Soon." 
               : filter === 'available'
               ? "No books currently available in this view."
               : "No books available in the archive yet."}
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredBooks.map((book, idx) => (
              <BookCard key={book._id} book={book} idx={idx} />
            ))}
          </div>
        )}
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
