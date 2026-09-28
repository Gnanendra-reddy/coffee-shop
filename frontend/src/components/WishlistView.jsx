import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export const WishlistView = ({ onExploreMenu, onQuickView }) => {
  const { wishlist, loading, removeFromWishlist, moveToCart, moveAllToCart } = useWishlist();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coffee-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
            Favorites & Saved
          </span>
          <h1 className="font-serif text-3xl font-bold text-coffee-950 flex items-center gap-2">
            My Coffee Wishlist
            <Heart className="w-6 h-6 text-rose-500 fill-current" />
          </h1>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={moveAllToCart}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coffee-800 text-amber-100 hover:bg-coffee-900 text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Move All to Cart</span>
          </button>
        )}
      </div>

      {/* Wishlist Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white rounded-2xl border border-coffee-100 animate-pulse p-4" />
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-coffee-200 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-coffee-950">Your wishlist is empty</h3>
          <p className="text-sm text-stone-600 max-w-sm mx-auto">
            Save your favorite coffee beans, single origins, and pastries here to brew later.
          </p>
          <button
            onClick={onExploreMenu}
            className="px-6 py-3 rounded-xl bg-coffee-800 text-amber-100 font-bold text-xs uppercase tracking-wider hover:bg-coffee-900 transition-colors shadow-md"
          >
            Discover Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const coffee = item.coffee || {};
            const isOutOfStock = coffee.stock <= 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-coffee-200/80 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div 
                  onClick={() => onQuickView?.(coffee)}
                  className="relative aspect-square bg-coffee-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={coffee.image_url || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80'}
                    alt={coffee.name || 'Coffee'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-rose-500 hover:text-white shadow-md transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                      {coffee.category || 'Specialty'}
                    </span>
                    <h3 className="font-serif font-bold text-base text-coffee-950 truncate">
                      {coffee.name || `Saved Roast #${item.coffee_id}`}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                      {coffee.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-coffee-100 flex items-center justify-between">
                    <span className="text-base font-extrabold text-coffee-900">
                      ${coffee.price?.toFixed(2)}
                    </span>

                    <button
                      onClick={() => moveToCart(item.id, 1)}
                      disabled={isOutOfStock}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        isOutOfStock
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : 'bg-coffee-800 hover:bg-amber-500 hover:text-stone-950 text-amber-100'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
