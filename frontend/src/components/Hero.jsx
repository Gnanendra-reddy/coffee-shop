import React from 'react';
import { Sparkles, Flame, Shield, Truck, Coffee, ArrowRight } from 'lucide-react';

export const Hero = ({ onExploreMenu, onApplyCoupon }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-coffee-950 via-coffee-900 to-stone-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 mb-12">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-warm-pulse" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-coffee-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Direct-Trade Single Origins & Artisanal Blends
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-[1.15]">
              Awaken Your Senses with <span className="text-amber-400 italic">Crafted Perfection</span>
            </h1>

            <p className="text-base sm:text-lg text-coffee-200/90 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Every bean is ethically sourced, precisely micro-roasted in small batches, and brewed to perfection. Experience rich complex notes from velvety espresso to refreshing cold brews.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreMenu}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-200"
              >
                <span>Explore Coffee Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onApplyCoupon?.('WELCOME20')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-amber-200 font-semibold text-sm backdrop-blur-sm transition-all duration-200"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Claim 20% Off: <code className="bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-300">WELCOME20</code></span>
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-coffee-800/80 text-left">
              <div className="flex items-center gap-2.5">
                <Coffee className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">100% Arabica</h4>
                  <p className="text-[11px] text-coffee-300">Specialty Grade</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Fresh Roasted</h4>
                  <p className="text-[11px] text-coffee-300">Small Micro-Batches</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Ethical Sourcing</h4>
                  <p className="text-[11px] text-coffee-300">Fair Farm Trade</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Fast Delivery</h4>
                  <p className="text-[11px] text-coffee-300">Hot & Fresh To Door</p>
                </div>
              </div>
            </div>

          </div>

          {/* Hero Right Visual Highlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 shadow-black/60 group">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80"
                  alt="Artisanal Latte Art"
                  className="w-full h-96 lg:h-[450px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Floating Special Promo Card */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl glass-panel-dark text-white border border-white/10 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400">Featured Pick</span>
                      <h3 className="font-serif font-bold text-lg text-white">Velvet Cappuccino & Croissant</h3>
                      <p className="text-xs text-coffee-200">Pairs silky dark espresso with pure butter pastry</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-coffee-400 line-through block">$8.25</span>
                      <span className="text-xl font-bold text-amber-400">$6.99</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
