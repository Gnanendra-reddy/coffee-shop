import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/cart/');
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (coffeeId, quantity = 1, coffeeName = 'Coffee') => {
    if (!token) {
      showToast('info', 'Please sign in to add items to your cart.');
      return false;
    }
    try {
      await api.post('/cart/add', {
        coffee_id: coffeeId,
        quantity,
      });
      showToast('success', `Added ${quantity}x "${coffeeName}" to cart!`);
      await fetchCart();
      return true;
    } catch (err) {
      showToast('error', err.formattedMessage || 'Could not add item to cart');
      return false;
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(itemId);
    }
    try {
      await api.put(`/cart/${itemId}?quantity=${newQuantity}`);
      await fetchCart();
    } catch (err) {
      showToast('error', err.formattedMessage || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      showToast('info', 'Item removed from cart.');
      await fetchCart();
    } catch (err) {
      showToast('error', err.formattedMessage || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/');
      setCart(null);
      showToast('info', 'Cart cleared.');
    } catch (err) {
      showToast('error', err.formattedMessage || 'Failed to clear cart');
    }
  };

  const checkout = async (couponCode) => {
    try {
      const payload = couponCode ? { coupon_code: couponCode.trim() } : {};
      const res = await api.post('/cart/checkout', payload);
      await fetchCart();
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.formattedMessage || 'Checkout failed.';
      showToast('error', msg);
      return { success: false, error: msg };
    }
  };

  const totalItemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  const totalPrice = cart?.total_price || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalItemCount,
        totalPrice,
        isDrawerOpen,
        setIsDrawerOpen,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
