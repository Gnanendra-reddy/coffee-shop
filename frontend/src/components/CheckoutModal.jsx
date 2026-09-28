import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Wallet, 
  Banknote, 
  CheckCircle2, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const CheckoutModal = ({ checkoutData, onClose, onOrderCompleted }) => {
  const { user } = useAuth();
  const { checkout } = useCart();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [address, setAddress] = useState('123 Brew Avenue, Suite 4B');
  const [phone, setPhone] = useState(user?.phone || '555-0199');
  const [instructions, setInstructions] = useState('Leave at front porch door please.');
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  if (!checkoutData) return null;

  const { couponCode, subtotal, discountAmount, tax, finalTotal } = checkoutData;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      // 1. Trigger Cart Checkout
      const result = await checkout(couponCode);
      if (!result.success) {
        setSubmitting(false);
        return;
      }

      const orderId = result.data.order_id;
      const totalToPay = result.data.final_total || finalTotal;

      // 2. Automatically record payment for the created order
      try {
        await api.post('/payments/', {
          order_id: orderId,
          amount: totalToPay,
          payment_method: paymentMethod,
        });
      } catch (payErr) {
        console.warn('Payment recording note:', payErr);
      }

      // 3. Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#bb8161', '#d97706', '#8e543e', '#10b981'],
        });
      } catch (err) {
        // confetti fallback
      }

      setOrderResult({
        order_id: orderId,
        final_total: totalToPay,
        message: result.data.message || 'Order placed successfully!',
      });
      showToast('success', `Order #${orderId} confirmed! Brewing started.`);
    } catch (err) {
      showToast('error', err.formattedMessage || 'Failed to complete order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-coffee-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-coffee-100 hover:bg-coffee-200 text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {orderResult ? (
          /* Order Confirmation View */
          <div className="p-8 sm:p-10 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Order Received & Paid
              </span>
              <h2 className="font-serif text-3xl font-bold text-coffee-950">
                Brewing in Progress!
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Thank you for your order, <strong>{user?.full_name || 'Customer'}</strong>. Our baristas are preparing your handcrafted order now.
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="p-5 rounded-2xl bg-coffee-50/80 border border-coffee-200 text-left max-w-md mx-auto space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500">Order Reference:</span>
                <span className="font-mono font-bold text-coffee-950">#{orderResult.order_id}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500">Payment Mode:</span>
                <span className="font-semibold text-stone-800">{paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500">Total Paid:</span>
                <span className="font-bold text-emerald-700 text-base">
                  ${orderResult.final_total?.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-800 pt-2 border-t border-coffee-200">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Estimated Delivery: 20-30 minutes</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOrderCompleted?.();
                }}
                className="px-6 py-3 rounded-xl bg-coffee-800 hover:bg-coffee-900 text-amber-100 font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Track My Orders
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-coffee-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Final Step
              </span>
              <h2 className="font-serif text-2xl font-bold text-coffee-950">
                Complete Your Order
              </h2>
            </div>

            {/* Delivery Address Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Delivery Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Note (Optional)
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Ring doorbell, leave at gate..."
                  className="w-full text-sm p-2.5 rounded-xl border border-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Payment Option
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'Credit Card', icon: CreditCard, label: 'Credit Card' },
                  { id: 'UPI / Digital Wallet', icon: Wallet, label: 'Digital Pay' },
                  { id: 'Cash on Delivery', icon: Banknote, label: 'Cash on Hand' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id)}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/60 text-amber-900 shadow-sm ring-1 ring-amber-600'
                          : 'border-coffee-200 bg-white hover:bg-coffee-50/50 text-stone-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-600' : 'text-coffee-600'}`} />
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Simulated Card inputs if card selected */}
              {paymentMethod === 'Credit Card' && (
                <div className="p-3.5 rounded-xl bg-coffee-50/60 border border-coffee-200 space-y-2.5">
                  <input
                    type="text"
                    defaultValue="4532 •••• •••• 8921"
                    placeholder="Card Number"
                    className="w-full text-xs p-2 rounded-lg border border-coffee-200 bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      defaultValue="08/29"
                      placeholder="MM/YY"
                      className="text-xs p-2 rounded-lg border border-coffee-200 bg-white"
                    />
                    <input
                      type="password"
                      defaultValue="888"
                      placeholder="CVC"
                      className="text-xs p-2 rounded-lg border border-coffee-200 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Total Price Summary Box */}
            <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-2">
              <div className="flex justify-between text-xs text-stone-300">
                <span>Subtotal</span>
                <span>${subtotal?.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>-${discountAmount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-stone-300">
                <span>Taxes & Roasting Fees</span>
                <span>${tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-amber-300 pt-2 border-t border-stone-800">
                <span>Amount to Pay</span>
                <span>${finalTotal?.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{submitting ? 'Brewing & Processing...' : `Confirm & Pay $${finalTotal?.toFixed(2)}`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
