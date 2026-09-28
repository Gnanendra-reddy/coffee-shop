import React, { useState } from 'react';
import { 
  Coffee, 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  ShieldCheck, 
  LogOut, 
  ListOrdered, 
  Settings,
  Menu as MenuIcon,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = ({ 
  currentTab, 
  setCurrentTab, 
  openAuthModal, 
  openCartDrawer 
}) => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItemCount } = useCart();
  const { wishlist } = useWishlist();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-40 glass-panel border-b border-coffee-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('menu')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-coffee-800 to-coffee-600 flex items-center justify-center text-amber-200 shadow-md shadow-coffee-950/20 group-hover:scale-105 transition-transform duration-300">
              <Coffee className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-coffee-950 block leading-none">
                Artisan Roast
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-coffee-600 block mt-1">
                Specialty Coffee Co.
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('menu')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentTab === 'menu'
                  ? 'bg-coffee-900 text-amber-100 shadow-sm'
                  : 'text-stone-700 hover:text-coffee-900 hover:bg-coffee-100/70'
              }`}
            >
              Menu & Specials
            </button>

            {user && (
              <>
                <button
                  onClick={() => handleNavClick('orders')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentTab === 'orders'
                      ? 'bg-coffee-900 text-amber-100 shadow-sm'
                      : 'text-stone-700 hover:text-coffee-900 hover:bg-coffee-100/70'
                  }`}
                >
                  My Orders
                </button>

                <button
                  onClick={() => handleNavClick('wishlist')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                    currentTab === 'wishlist'
                      ? 'bg-coffee-900 text-amber-100 shadow-sm'
                      : 'text-stone-700 hover:text-coffee-900 hover:bg-coffee-100/70'
                  }`}
                >
                  Wishlist
                  {wishlist.length > 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </>
            )}

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                  currentTab === 'admin'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'text-amber-800 border-amber-300/80 bg-amber-50 hover:bg-amber-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </button>
            )}
          </div>

          {/* Right Action Icons & User Account */}
          <div className="flex items-center gap-3">
            
            {/* Wishlist Icon (Mobile quick access) */}
            {user && (
              <button
                onClick={() => handleNavClick('wishlist')}
                className="p-2.5 rounded-xl text-stone-600 hover:text-coffee-900 hover:bg-coffee-100/70 relative transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
            )}

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCartDrawer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-coffee-800 text-amber-100 hover:bg-coffee-900 transition-all duration-200 shadow-md shadow-coffee-900/10 active:scale-95 group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-amber-200 group-hover:scale-110 transition-transform" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-stone-900 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold tracking-wide uppercase">
                Cart
              </span>
            </button>

            {/* User Account / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-coffee-100 hover:bg-coffee-200/70 border border-coffee-200 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-coffee-700 text-amber-100 font-bold flex items-center justify-center text-xs">
                    {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-coffee-900 max-w-[110px] truncate">
                    {user.full_name?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-coffee-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-coffee-100">
                      <p className="text-xs text-stone-500">Signed in as</p>
                      <p className="text-sm font-bold text-coffee-950 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                          Administrator
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-coffee-50 transition-colors font-medium text-left"
                    >
                      <Settings className="w-4 h-4 text-coffee-600" />
                      Account Settings
                    </button>

                    <button
                      onClick={() => handleNavClick('orders')}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-coffee-50 transition-colors font-medium text-left"
                    >
                      <ListOrdered className="w-4 h-4 text-coffee-600" />
                      Order History
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-800 bg-amber-50/50 hover:bg-amber-100/70 transition-colors font-semibold text-left"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="border-t border-coffee-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        setCurrentTab('menu');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-amber-500/20 active:scale-95"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-coffee-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-coffee-200/80 bg-white/95 px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => handleNavClick('menu')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              currentTab === 'menu' ? 'bg-coffee-900 text-amber-100' : 'text-stone-700 hover:bg-coffee-50'
            }`}
          >
            Menu & Catalog
          </button>
          {user && (
            <>
              <button
                onClick={() => handleNavClick('orders')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  currentTab === 'orders' ? 'bg-coffee-900 text-amber-100' : 'text-stone-700 hover:bg-coffee-50'
                }`}
              >
                My Orders
              </button>
              <button
                onClick={() => handleNavClick('wishlist')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  currentTab === 'wishlist' ? 'bg-coffee-900 text-amber-100' : 'text-stone-700 hover:bg-coffee-50'
                }`}
              >
                Wishlist ({wishlist.length})
              </button>
              <button
                onClick={() => handleNavClick('profile')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  currentTab === 'profile' ? 'bg-coffee-900 text-amber-100' : 'text-stone-700 hover:bg-coffee-50'
                }`}
              >
                Profile Settings
              </button>
            </>
          )}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold ${
                currentTab === 'admin' ? 'bg-amber-600 text-white' : 'text-amber-800 bg-amber-50'
              }`}
            >
              Admin Dashboard
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
