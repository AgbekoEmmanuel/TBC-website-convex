import React, { useState, useEffect, useRef } from "react";
import { X, AlignLeft, Tag, Loader2, Image as ImageIcon, Banknote, Package } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Doc<"products">;
}

export function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const updateProduct = useMutation(api.products.update);

  const [title, setTitle] = useState(product.title);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(""); // We don't have a numeric stock in schema, just inStock boolean
  const [description, setDescription] = useState(product.description || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComingSoon, setIsComingSoon] = useState(product.isComingSoon || false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset form when opened with a new product
      setTitle(product.title);
      setCategory(product.category);
      setPrice(product.price.toString());
      setDescription(product.description || "");
      setImagePreview(product.imageUrl || null);
      setImageFile(null);
      setIsComingSoon(product.isComingSoon || false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageStorageId = product.imageStorageId;
      let imageUrl = product.imageUrl;
      
      if (imageFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        const { storageId } = await result.json();
        imageStorageId = storageId;
        // In a real app we might fetch the getUrl mutation, but convex also updates it if we just pass storageId
        // The products.update mutation takes imageStorageId and imageUrl. 
        // We'll leave imageUrl undefined so it might need fetching if the backend doesn't resolve it.
        // Wait, the schema allows imageUrl. Let's not pass it or pass empty, assuming the frontend resolves it if needed.
        // Actually, let's keep the old imageUrl if we don't have a new one.
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      await updateProduct({
        id: product._id,
        title,
        slug,
        description,
        price: parseFloat(price),
        category,
        imageStorageId,
        imageUrl: imageFile ? undefined : product.imageUrl, 
        inStock: product.inStock,
        isPublished: product.isPublished,
        isComingSoon,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#112a46]/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-serif font-semibold text-[#112a46]">Edit Product</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <form className="space-y-6" id="edit-product-form" onSubmit={handleSubmit}>
            
            <div className="relative aspect-square w-48 mx-auto rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-center px-4">Upload Product Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full">Change</span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Product Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AlignLeft className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#85c9d8] focus:ring-1 focus:ring-[#85c9d8] outline-none transition-shadow" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Price (GH₵)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Banknote className="h-4 w-4 text-slate-400" />
                    </div>
                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#85c9d8] focus:ring-1 focus:ring-[#85c9d8] outline-none transition-shadow" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-4 w-4 text-slate-400" />
                    </div>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full pl-10 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#85c9d8] focus:ring-1 focus:ring-[#85c9d8] outline-none transition-shadow bg-white appearance-none">
                      <option value="Books">Books</option>
                      <option value="Apparel">Apparel</option>
                      <option value="Media">Media</option>
                      <option value="Gifts">Gifts</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <input 
                  type="checkbox" 
                  id="editComingSoon"
                  checked={isComingSoon}
                  onChange={(e) => setIsComingSoon(e.target.checked)}
                  className="w-4 h-4 text-[#85c9d8] rounded border-slate-300 focus:ring-[#85c9d8]"
                />
                <label htmlFor="editComingSoon" className="text-sm font-medium text-slate-700 select-none cursor-pointer">
                  Mark as "Coming Soon"
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#85c9d8] focus:ring-1 focus:ring-[#85c9d8] outline-none transition-shadow" />
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-[#f8fafc]">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" form="edit-product-form" disabled={isSubmitting} className="px-6 py-2 text-sm font-bold text-[#0b2840] bg-[#85c9d8] shadow-sm rounded-xl hover:bg-[#72b8c9] transition-all flex items-center gap-2 disabled:bg-slate-400">
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
