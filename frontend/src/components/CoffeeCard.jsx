import React from 'react';
import { Heart, Plus, Star, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const CoffeeCard = ({ coffee, onQuickView }) => {
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist, wishlist } = useWishlist();

  const wishlisted = isWishlisted(coffee.id);
  const isOutOfStock = coffee.stock <= 0;
  const isLowStock = coffee.stock > 0 && coffee.stock <= 5;

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (wishlisted) {
      const item = wishlist.find((w) => w.coffee_id === coffee.id || w.coffee?.id === coffee.id);
      if (item) removeFromWishlist(item.id);
    } else {
      addToWishlist(coffee.id, coffee.name);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(coffee.id, 1, coffee.name);
  };

  // Default fallback image if null
  const imageUrl =
    coffee.image_url ||
    'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80';

  return (
    <div 
      onClick={() => onQuickView(coffee)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-coffee-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-coffee-100">
        <img
          src={imageUrl}
          alt={coffee.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Category & Stock Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-stone-900/85 text-amber-200 backdrop-blur-md shadow-sm">
            {coffee.category || 'Coffee'}
          </span>
          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-600/90 text-white backdrop-blur-md">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/90 text-stone-900 backdrop-blur-md">
              Only {coffee.stock} left
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-md ${
            wishlisted
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-rose-500'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay Hover Action */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-stone-900 font-bold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-coffee-700" />
            Quick View & Reviews
          </span>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-serif font-bold text-lg text-coffee-950 group-hover:text-coffee-700 transition-colors line-clamp-1">
              {coffee.name}
            </h3>
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {coffee.description || 'Expertly prepared fresh artisan coffee brew.'}
          </p>
        </div>

        {/* Price and Add to Cart Action */}
        <div className="pt-3 border-t border-coffee-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-600 block">Price</span>
            <span className="text-lg font-extrabold text-coffee-900">
              ${coffee.price?.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-coffee-800 text-amber-100 hover:bg-amber-500 hover:text-stone-950 active:scale-95'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
