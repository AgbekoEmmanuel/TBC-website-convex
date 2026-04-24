import React, { useState } from "react";
import { Plus, Package, Truck, Banknote, TrendingUp, MoreHorizontal, Loader2, Trash2, Edit } from "lucide-react";
import { Card } from "../components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { cn } from "../lib/utils";
import { Doc } from "@convex/_generated/dataModel";

const PRODUCTS_TABS = ["All Products", "Books", "Apparel", "Media", "Gifts"];

function ProductCard({ product }: { product: Doc<"products">, key?: any }) {
  const remove = useMutation(api.products.remove);
  const [showActions, setShowActions] = useState(false);

  const getStockBadge = (isInStock: boolean) => {
    if (!isInStock) return { label: "Out of Stock", classes: "bg-[#1f2937]/95 text-[#9ca3af] border border-white/10 backdrop-blur-md" };
    return { label: "In Stock", classes: "bg-[#1e3c5e]/90 text-[#93c5fd] backdrop-blur-md border border-[#93c5fd]/20" };
  };

  const badge = getStockBadge(product.inStock);

  return (
    <div className="flex flex-col group cursor-pointer relative">
      <div className="aspect-square w-full rounded-[24px] overflow-hidden relative mb-5 bg-slate-100 dark:bg-[#071d33]/50">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
            <Package className="w-12 h-12" />
          </div>
        )}
        <span className={cn(
          "absolute top-4 right-4 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm",
          badge.classes
        )}>
          {badge.label}
        </span>
      </div>

      <h3 className="font-serif text-[22px] text-[#112a46] dark:text-white font-medium leading-[1.3] line-clamp-1 mb-1.5 transition-colors group-hover:text-[#288096] dark:group-hover:text-[#85c9d8]">
        {product.title}
      </h3>
      
      <p className="text-[13px] text-slate-500 dark:text-[#8ba4b3] font-medium mb-4">
        {product.category} • {product.inStock ? "Currently Available" : "Sold Out"}
      </p>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="text-[20px] font-bold text-[#288096] dark:text-[#85c9d8]">
          GH₵ {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
        </div>
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
            className="text-slate-400 dark:text-[#648496] hover:text-[#112a46] dark:hover:text-white transition-colors p-2 -mr-2"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 bottom-full mb-2 z-50 bg-white dark:bg-[#07243c] border border-slate-200 dark:border-[#103a64] rounded-xl shadow-xl py-1 min-w-[140px] overflow-hidden">
               <button 
                  onClick={() => { setShowActions(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-slate-600 dark:text-[#8ba4b3] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
               >
                  <Edit className="w-3.5 h-3.5" /> Edit Details
               </button>
               <button 
                  onClick={() => { if(confirm("Delete this product?")) remove({ id: product._id }); setShowActions(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
               >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { CreateProductModal } from "../components/CreateProductModal";

export function Store() {
  const [activeTab, setActiveTab] = useState("All Products");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const products = useQuery(api.products.getAll);
  const stats = useQuery(api.dashboard.getStats);

  const filteredProducts = products?.filter(p => 
    activeTab === "All Products" || p.category === activeTab
  );

  const STORE_STATS = [
    {
      title: "TOTAL PRODUCTS",
      value: stats?.totalProducts?.toString() || "0",
      icon: Package,
      trend: "In catalog",
      trendIcon: TrendingUp
    },
    {
      title: "ACTIVE ORDERS",
      value: "0",
      icon: Truck,
      trend: "0 awaiting shipment",
      trendIcon: MoreHorizontal
    },
    {
      title: "MONTHLY REVENUE",
      value: "GH₵ 0",
      icon: Banknote,
      trend: "This month",
      trendIcon: TrendingUp
    }
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto px-1 sm:px-2 md:px-0 text-[#112a46] dark:text-white mb-20 animate-in fade-in duration-300">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <h1 className="text-4xl md:text-[44px] font-serif text-[#112a46] dark:text-white tracking-tight leading-tight">Store Management</h1>
          <p className="text-[#648496] dark:text-[#8ba4b3] text-[15px] font-medium mt-2">Manage catalog, inventory, and orders for Balance Church.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#85c9d8] hover:bg-[#72b8c9] text-[#0b2840] px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm w-fit md:mb-1"
        >
           <Plus className="w-5 h-5"/> Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {STORE_STATS.map((stat, i) => (
           <Card key={i} className="flex flex-col justify-between p-6 h-[170px] dark:bg-[#0a2744]/60 dark:backdrop-blur-xl dark:border-white/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-white border-slate-100 shadow-sm rounded-3xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                 <span className="text-[12px] font-bold text-[#8ba4b3] dark:text-[#648496] tracking-widest uppercase">{stat.title}</span>
                 <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-[#071d33]/80 flex items-center justify-center">
                    <stat.icon className="w-[18px] h-[18px] text-[#8ba4b3] dark:text-[#648496]" />
                 </div>
              </div>
              
              <div>
                 <div className="text-[34px] font-serif font-bold text-[#112a46] dark:text-white leading-none mb-3">
                    {stat.value}
                 </div>
                 
                 <div className="flex items-center text-[12px] font-medium text-[#8ba4b3] dark:text-[#648496]">
                    <stat.trendIcon className={cn("fill-current", stat.trendIcon === MoreHorizontal ? "w-4 h-4 mr-1.5" : "w-3.5 h-3.5 mr-1.5")} />
                    {stat.trend}
                 </div>
              </div>
           </Card>
         ))}
      </div>

      <Card className="p-8 pb-16 flex flex-col dark:bg-[#0a2744]/40 dark:backdrop-blur-xl dark:border-white/5 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-white border-slate-100 shadow-sm rounded-[32px] transition-all duration-300 min-h-[500px]">
        
        <div className="flex items-center gap-8 border-b border-slate-100 dark:border-white/5 mb-8 overflow-x-auto no-scrollbar pt-2">
          {PRODUCTS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 px-2 text-[15px] font-medium transition-colors relative whitespace-nowrap",
                activeTab === tab
                  ? "text-[#288096] dark:text-[#85c9d8]"
                  : "text-slate-500 dark:text-[#648496] hover:text-[#112a46] dark:hover:text-white"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#288096] dark:bg-[#85c9d8] rounded-t-full shadow-[0_0_8px_rgba(133,201,216,0.6)]" />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mt-2">
           {products === undefined ? (
             <div className="col-span-full flex justify-center py-20">
               <Loader2 className="w-10 h-10 animate-spin text-[#288096]" />
             </div>
           ) : filteredProducts?.length === 0 ? (
             <div className="col-span-full text-center py-20 text-slate-500">
               No products found in this category.
             </div>
           ) : (
             filteredProducts?.map(product => (
               <ProductCard key={product._id} product={product} />
             ))
           )}
        </div>

      </Card>
      <CreateProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
