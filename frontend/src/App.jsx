import React, { useState, useRef } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { CoffeeModal } from './components/CoffeeModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersView } from './components/OrdersView';
import { WishlistView } from './components/WishlistView';
import { ProfileView } from './components/ProfileView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

function MainApp() {
  const { user, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState('menu'); // 'menu' | 'orders' | 'wishlist' | 'profile' | 'admin'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [quickViewCoffee, setQuickViewCoffee] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);

  const menuRef = useRef(null);

  const scrollToMenu = () => {
    setCurrentTab('menu');
    setTimeout(() => {
      menuRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleOpenCheckout = (data) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setCheckoutData(data);
  };

  const handleOrderCompleted = () => {
    setCheckoutData(null);
    setCurrentTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf7] text-stone-800">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openAuthModal={() => setAuthModalOpen(true)}
        openCartDrawer={() => setCartDrawerOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'menu' && (
          <>
            <Hero 
              onExploreMenu={scrollToMenu} 
              onApplyCoupon={() => setCartDrawerOpen(true)}
            />
            <MenuSection 
              menuRef={menuRef} 
              onQuickView={(coffee) => setQuickViewCoffee(coffee)} 
            />
          </>
        )}

        {currentTab === 'orders' && (
          <OrdersView onExploreMenu={scrollToMenu} />
        )}

        {currentTab === 'wishlist' && (
          <WishlistView 
            onExploreMenu={scrollToMenu} 
            onQuickView={(coffee) => setQuickViewCoffee(coffee)} 
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Modals & Slide-Overs */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <CoffeeModal
        coffee={quickViewCoffee}
        onClose={() => setQuickViewCoffee(null)}
      />

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onOpenCheckout={handleOpenCheckout}
        onExploreMenu={scrollToMenu}
      />

      <CheckoutModal
        checkoutData={checkoutData}
        onClose={() => setCheckoutData(null)}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Footer */}
      <Footer onExploreMenu={scrollToMenu} />

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MainApp />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
