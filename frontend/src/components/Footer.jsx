import React from 'react';
import { Coffee, Heart, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer = ({ onExploreMenu }) => {
  return (
    <footer className="bg-stone-950 text-white border-t border-coffee-900/40 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coffee-800 to-coffee-600 flex items-center justify-center text-amber-300">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Artisan Roast
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Dedicated to the craft of exceptional micro-roasted coffee. Direct-trade beans roasted in small batches to highlight authentic origin flavors.
            </p>
            <div className="flex items-center gap-3 text-stone-400 pt-2">
              <a href="#instagram" className="p-2 rounded-lg bg-stone-900 hover:text-amber-400 hover:bg-stone-800 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#twitter" className="p-2 rounded-lg bg-stone-900 hover:text-amber-400 hover:bg-stone-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#facebook" className="p-2 rounded-lg bg-stone-900 hover:text-amber-400 hover:bg-stone-800 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Coffee & Brews
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><button onClick={onExploreMenu} className="hover:text-amber-200 transition-colors">Espresso Specialties</button></li>
              <li><button onClick={onExploreMenu} className="hover:text-amber-200 transition-colors">Single-Origin Pour Overs</button></li>
              <li><button onClick={onExploreMenu} className="hover:text-amber-200 transition-colors">Nitro & Cold Brews</button></li>
              <li><button onClick={onExploreMenu} className="hover:text-amber-200 transition-colors">Fresh Morning Bakery</button></li>
              <li><button onClick={onExploreMenu} className="hover:text-amber-200 transition-colors">Specialty Whole Beans</button></li>
            </ul>
          </div>

          {/* Roastery Hours & Location */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Roastery Hours
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-coffee-400 flex-shrink-0" />
                <span>404 Arabica Blvd, Coffee District</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-coffee-400 flex-shrink-0" />
                <span>+1 (555) 234-BREW</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-coffee-400 flex-shrink-0" />
                <span>hello@artisanroast.coffee</span>
              </div>
              <p className="pt-2 text-[11px] text-stone-500">
                Mon - Fri: 6:30 AM - 8:00 PM<br />
                Sat - Sun: 7:30 AM - 9:00 PM
              </p>
            </div>
          </div>

          {/* Newsletter / Newsletter Promo */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Coffee Club Newsletter
            </h4>
            <p className="text-xs text-stone-400">
              Subscribe for exclusive batch releases, tasting notes, and promo discounts.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full text-xs p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors">
                Join
              </button>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Artisan Roast Specialty Coffee Co. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>and fresh roasted espresso</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
