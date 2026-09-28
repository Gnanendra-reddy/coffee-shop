import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Ban, 
  History,
  Coffee
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const OrdersView = ({ onExploreMenu }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [historyData, setHistoryData] = useState({});
  const [loadingHistory, setLoadingHistory] = useState(null);
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my-orders');
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      showToast('error', 'Could not load your orders.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleExpand = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }
    setExpandedOrderId(orderId);

    // Fetch history if not already loaded
    if (!historyData[orderId]) {
      try {
        setLoadingHistory(orderId);
        const res = await api.get(`/orders/${orderId}/history`);
        setHistoryData((prev) => ({ ...prev, [orderId]: res.data }));
      } catch (err) {
        console.warn('Could not load order history:', err);
      } finally {
        setLoadingHistory(null);
      }
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      showToast('success', `Order #${orderId} has been cancelled.`);
      await fetchOrders();
    } catch (err) {
      showToast('error', err.formattedMessage || 'Could not cancel order');
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'Pending').toLowerCase();
    if (s === 'completed' || s === 'delivered') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    }
    if (s === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          <XCircle className="w-3.5 h-3.5" />
          Cancelled
        </span>
      );
    }
    if (s === 'processing' || s === 'brewing') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 animate-spin" />
          Brewing & Packing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
        <Clock className="w-3.5 h-3.5" />
        Order Received
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-coffee-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
            Account Activity
          </span>
          <h1 className="font-serif text-3xl font-bold text-coffee-950">
            My Coffee Orders
          </h1>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-coffee-700 bg-coffee-100 hover:bg-coffee-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-coffee-100 animate-pulse p-4" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-coffee-200 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-coffee-100 flex items-center justify-center text-coffee-600">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-coffee-950">No orders placed yet</h3>
          <p className="text-sm text-stone-600 max-w-sm mx-auto">
            Ready for your first handcrafted cup? Explore our seasonal coffee roasts and order for delivery.
          </p>
          <button
            onClick={onExploreMenu}
            className="px-6 py-3 rounded-xl bg-coffee-800 text-amber-100 font-bold text-xs uppercase tracking-wider hover:bg-coffee-900 transition-colors shadow-md"
          >
            Start Your First Order
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const items = order.items || [];
            const isPending = (order.status || '').toLowerCase() === 'pending';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-coffee-200/80 shadow-sm overflow-hidden transition-all duration-200"
              >
                {/* Order Summary Row */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-coffee-50/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-coffee-100 text-coffee-800 flex items-center justify-center font-serif font-bold text-sm">
                      #{order.id}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-coffee-950">
                          Order #{order.id}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        {items.length} {items.length === 1 ? 'item' : 'items'} • Paid via {order.payment?.payment_method || 'Card/Online'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-coffee-100">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-stone-600 block">Total</span>
                      <span className="text-lg font-extrabold text-coffee-900">
                        ${order.total_amount?.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-coffee-100 text-coffee-700">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-coffee-100 p-5 bg-coffee-50/30 space-y-5 animate-in fade-in duration-200">
                    
                    {/* Items Breakdown */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                        Ordered Brews & Treats
                      </h4>

                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-white border border-coffee-100 text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <Coffee className="w-4 h-4 text-coffee-600" />
                              <div>
                                <span className="font-semibold text-coffee-950">
                                  {item.coffee?.name || `Coffee Item #${item.coffee_id}`}
                                </span>
                                <span className="text-xs text-stone-600 ml-2">
                                  x{item.quantity}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-coffee-900">
                              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Audit History Timeline */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5" />
                        Status History & Timeline
                      </h4>

                      {loadingHistory === order.id ? (
                        <p className="text-xs text-stone-400">Loading timeline...</p>
                      ) : historyData[order.id]?.length > 0 ? (
                        <div className="space-y-2 pl-2 border-l-2 border-coffee-300">
                          {historyData[order.id].map((h) => (
                            <div key={h.id} className="text-xs space-y-0.5">
                              <span className="font-bold text-coffee-900">{h.status}</span>
                              <span className="text-stone-600 ml-2">
                                {new Date(h.changed_at).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-stone-600">Current status: {order.status}</p>
                      )}
                    </div>

                    {/* Order Action Controls (e.g. Cancel order if pending) */}
                    {isPending && (
                      <div className="pt-3 border-t border-coffee-200/60 flex justify-end">
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Cancel Order
                        </button>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
