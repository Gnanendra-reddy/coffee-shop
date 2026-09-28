import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { token } = useAuth();
  const { fetchCart } = useCart();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/wishlist/');
      setWishlist(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = useCallback((coffeeId) => {
    return wishlist.some((item) => item.coffee_id === coffeeId || item.coffee?.id === coffeeId);
  }, [wishlist]);

  const addToWishlist = async (coffeeId, coffeeName = 'Coffee') => {
    if (!token) {
      showToast('info', 'Please sign in to save items to your wishlist.');
      return false;
    }
    try {
      await api.post('/wishlist/', { coffee_id: coffeeId });
      showToast('success', `Saved "${coffeeName}" to your wishlist! ❤️`);
      await fetchWishlist();
      return true;
    } catch (err) {
      showToast('error', err.formattedMessage || 'Could not add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      await api.delete(`/wishlist/${wishlistId}`);
      showToast('info', 'Item removed from wishlist.');
      await fetchWishlist();
      return true;
    } catch (err) {
      showToast('error', err.formattedMessage || 'Could not remove from wishlist');
      return false;
    }
  };

  const moveToCart = async (wishlistId, quantity = 1) => {
    try {
      await api.post(`/wishlist/${wishlistId}/move`, { quantity });
      showToast('success', 'Moved item to your cart! 🛒');
      await Promise.all([fetchWishlist(), fetchCart()]);
      return true;
    } catch (err) {
      showToast('error', err.formattedMessage || 'Could not move item to cart');
      return false;
    }
  };

  const moveAllToCart = async () => {
    try {
      await api.post('/wishlist/move-all');
      showToast('success', 'Moved all wishlist items to your cart! 🎉');
      await Promise.all([fetchWishlist(), fetchCart()]);
      return true;
    } catch (err) {
      showToast('error', err.formattedMessage || 'Could not move items to cart');
      return false;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        moveAllToCart,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
