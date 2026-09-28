import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const CartDrawer = ({ isOpen, onClose, onOpenCheckout, onExploreMenu }) => {
  const { 
    cart, 
    loading, 
    totalItemCount, 
    totalPrice, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();
  const { showToast } = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  if (!isOpen) return null;

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      showToast('error', 'Please enter a coupon code.');
      return;
    }

    // Client-side quick check or store for checkout
    if (code === 'WELCOME20') {
      setAppliedCoupon({ code, discount_type: 'percentage', value: 20 });
      showToast('success', 'Coupon WELCOME20 applied: 20% Off!');
    } else if (code === 'COFFEE10') {
      setAppliedCoupon({ code, discount_type: 'percentage', value: 10 });
      showToast('success', 'Coupon COFFEE10 applied: 10% Off!');
    } else if (code === 'FLAT5') {
      setAppliedCoupon({ code, discount_type: 'flat', value: 5 });
      showToast('success', 'Coupon FLAT5 applied: $5 Off!');
    } else {
      // Pass through whatever code they typed to the backend checkout
      setAppliedCoupon({ code, discount_type: 'custom', value: 0 });
      showToast('info', `Coupon code "${code}" set for checkout.`);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Calculations
  const subtotal = totalPrice || items.reduce((acc, item) => acc + (item.coffee?.price || 0) * (item.quantity || 1), 0);
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.discount_type === 'flat') {
      discountAmount = Math.min(subtotal, appliedCoupon.value);
    }
  }
  const tax = (subtotal - discountAmount) * 0.08;
  const finalTotal = Math.max(0, subtotal - discountAmount + tax);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-coffee-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-coffee-100 flex items-center justify-between bg-coffee-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-coffee-800 text-amber-200">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-coffee-950">Your Cart</h3>
                <span className="text-xs text-stone-600 font-medium">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body - Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isEmpty ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-coffee-100 flex items-center justify-center text-coffee-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-lg text-coffee-950">Your cart is empty</h4>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  Looks like you haven't added any fresh roasts or baked treats to your order yet.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExploreMenu?.();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-coffee-800 text-amber-100 font-bold text-xs uppercase tracking-wider hover:bg-coffee-900 transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const coffee = item.coffee || {};
                  const itemPrice = coffee.price || 0;
                  const itemTotal = itemPrice * (item.quantity || 1);

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3.5 rounded-2xl bg-white border border-coffee-100 shadow-sm hover:border-coffee-200 transition-colors"
                    >
                      {/* Thumbnail */}
                      <img
                        src={coffee.image_url || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80'}
                        alt={coffee.name || 'Coffee'}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-coffee-100"
                      />

                      {/* Details & Quantity */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-coffee-950 truncate">
                          {coffee.name || `Coffee #${item.coffee_id}`}
                        </h4>
                        <p className="text-xs font-semibold text-coffee-700 mt-0.5">
                          ${itemPrice.toFixed(2)} each
                        </p>

                        {/* Quantity Modifier */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-coffee-200 rounded-lg bg-coffee-50/50">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-stone-600 hover:text-stone-900 hover:bg-white rounded-l-lg transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-stone-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-stone-600 hover:text-stone-900 hover:bg-white rounded-r-lg transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-extrabold text-coffee-900 block">
                          ${itemTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-end pt-1">
                  <button
                    onClick={clearCart}
                    className="text-[11px] font-semibold text-stone-600 hover:text-rose-600 transition-colors"
                  >
                    Clear All Items
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer - Promo & Summary */}
          {!isEmpty && (
            <div className="p-6 border-t border-coffee-200/80 bg-coffee-50/40 space-y-4">
              
              {/* Promo Code Input */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo code (e.g. WELCOME20)"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-white uppercase font-semibold"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-2 rounded-xl bg-coffee-800 text-amber-100 text-xs font-bold uppercase tracking-wider hover:bg-coffee-900 transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span className="font-semibold">
                      Applied: <code className="font-bold">{appliedCoupon.code}</code>
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-stone-400 hover:text-rose-600 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-coffee-200/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-stone-800">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-coffee-950 pt-2 border-t border-coffee-200">
                  <span>Total</span>
                  <span className="text-amber-700">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout({
                    couponCode: appliedCoupon ? appliedCoupon.code : couponCode.trim(),
                    subtotal,
                    discountAmount,
                    tax,
                    finalTotal,
                  });
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                <span>Checkout Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
