import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Coffee, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  Ban, 
  Tag, 
  Shield, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const AdminDashboard = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'inventory' | 'orders' | 'users' | 'coupons'

  // Analytics state
  const [stats, setStats] = useState(null);
  const [bestSelling, setBestSelling] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Inventory & Coffees state
  const [inventoryList, setInventoryList] = useState([]);
  const [lowStockList, setLowStockList] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedCoffeeForRestock, setSelectedCoffeeForRestock] = useState(null);
  const [restockQty, setRestockQty] = useState(20);
  
  // Add/Edit Coffee state
  const [coffeeModalOpen, setCoffeeModalOpen] = useState(false);
  const [coffeeForm, setCoffeeForm] = useState({
    id: null,
    name: '',
    description: '',
    category: 'Espresso',
    price: 4.50,
    stock: 30,
    image_url: '',
  });

  // Orders state
  const [allOrders, setAllOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Users state
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Coupon create state
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [couponValue, setCouponValue] = useState(15);
  const [expiryDays, setExpiryDays] = useState(30);
  const [creatingCoupon, setCreatingCoupon] = useState(false);

  // 1. Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoadingAnalytics(true);
      const [statsRes, bestRes, topRes] = await Promise.allSettled([
        api.get('/analytics/dashboard'),
        api.get('/analytics/best-selling'),
        api.get('/analytics/top-rated'),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (bestRes.status === 'fulfilled') setBestSelling(bestRes.value.data || []);
      if (topRes.status === 'fulfilled') setTopRated(topRes.value.data || []);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  // 2. Fetch Inventory
  const fetchInventory = useCallback(async () => {
    try {
      setLoadingInventory(true);
      const [invRes, lowRes] = await Promise.allSettled([
        api.get('/inventory/'),
        api.get('/inventory/low-stock'),
      ]);
      if (invRes.status === 'fulfilled') setInventoryList(invRes.value.data || []);
      if (lowRes.status === 'fulfilled') setLowStockList(lowRes.value.data || []);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoadingInventory(false);
    }
  }, []);

  // 3. Fetch Orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const res = await api.get('/orders/');
      setAllOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // 4. Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await api.get('/admin/users/');
      if (Array.isArray(res.data)) {
        setAllUsers(res.data);
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        setAllUsers(res.data.data);
      } else if (res.data?.items && Array.isArray(res.data.items)) {
        setAllUsers(res.data.items);
      } else {
        setAllUsers([]);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'inventory') fetchInventory();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, fetchAnalytics, fetchInventory, fetchOrders, fetchUsers]);

  // Restock Action
  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCoffeeForRestock) return;
    try {
      await api.put(`/inventory/${selectedCoffeeForRestock.id}/restock`, {
        quantity: parseInt(restockQty, 10),
      });
      showToast('success', `Restocked ${selectedCoffeeForRestock.name} with +${restockQty} units!`);
      setRestockModalOpen(false);
      fetchInventory();
    } catch (err) {
      showToast('error', err.formattedMessage || 'Failed to restock');
    }
  };

  // Add / Edit Coffee Action
  const handleSaveCoffee = async (e) => {
    e.preventDefault();
    try {
      if (coffeeForm.id) {
        // Edit existing
        await api.put(`/coffee/${coffeeForm.id}`, {
          name: coffeeForm.name,
          description: coffeeForm.description,
          category: coffeeForm.category,
          price: parseFloat(coffeeForm.price),
          stock: parseInt(coffeeForm.stock, 10),
          image_url: coffeeForm.image_url || undefined,
        });
        showToast('success', `Updated "${coffeeForm.name}"`);
      } else {
        // Create new
        await api.post('/coffee/', {
          name: coffeeForm.name,
          description: coffeeForm.description,
          category: coffeeForm.category,
          price: parseFloat(coffeeForm.price),
          stock: parseInt(coffeeForm.stock, 10),
          image_url: coffeeForm.image_url || undefined,
        });
        showToast('success', `Added new coffee "${coffeeForm.name}" to menu!`);
      }
      setCoffeeModalOpen(false);
      fetchInventory();
    } catch (err) {
      showToast('error', err.formattedMessage || 'Failed to save coffee product');
    }
  };

  const handleDeleteCoffee = async (coffeeId, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the catalog?`)) return;
    try {
      await api.delete(`/coffee/${coffeeId}`);
      showToast('success', `Deleted "${name}".`);
      fetchInventory();
    } catch (err) {
      showToast('error', err.formattedMessage || 'Failed to delete coffee');
    }
  };

  // Update Order Status
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      showToast('success', `Order #${orderId} status changed to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      showToast('error', err.formattedMessage || 'Failed to update order status');
    }
  };

  // Toggle User Active Status
  const handleUserStatusToggle = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}/status`, { is_active: !user.is_active });
      showToast('info', `User ${user.email} is now ${!user.is_active ? 'Active' : 'Deactivated'}`);
      fetchUsers();
    } catch (err) {
      showToast('error', err.formattedMessage || 'Failed to change user status');
    }
  };

  // Toggle User Role
  const handleUserRoleChange = async (user, newRole) => {
    try {
      await api.put(`/admin/users/${user.id}/role`, { role: newRole });
      showToast('success', `User ${user.email} role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      showToast('error', err.formattedMessage || 'Failed to update role');
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      setCreatingCoupon(true);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + parseInt(expiryDays, 10));
      const formattedDate = targetDate.toISOString().split('T')[0];

      await api.post('/coupons/', {
        code: couponCode.trim().toUpperCase(),
        discount_type: discountType,
        value: parseFloat(couponValue),
        expiry_date: formattedDate,
      });

      showToast('success', `Created coupon: ${couponCode.toUpperCase()} (${formattedDate})`);
      setCouponCode('');
      setCouponValue(15);
    } catch (err) {
      showToast('error', err.formattedMessage || 'Failed to create coupon');
    } finally {
      setCreatingCoupon(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-coffee-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
            Administrative Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-coffee-950 flex items-center gap-2">
            <Shield className="w-7 h-7 text-amber-600" />
            Barista & Shop Manager
          </h1>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-coffee-100/80 rounded-2xl overflow-x-auto">
          {[
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'inventory', label: 'Inventory', icon: Coffee },
            { id: 'orders', label: 'All Orders', icon: ShoppingBag },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'coupons', label: 'Coupons', icon: Tag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-coffee-900 text-amber-200 shadow-sm'
                    : 'text-stone-700 hover:text-coffee-900 hover:bg-white/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-coffee-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Revenue</span>
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="text-3xl font-serif font-bold text-coffee-950">
                ${stats?.total_revenue ? stats.total_revenue.toFixed(2) : '0.00'}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Gross Coffee Sales
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-coffee-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Orders</span>
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-3xl font-serif font-bold text-coffee-950">
                {stats?.total_orders || 0}
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Lifetime customer orders
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-coffee-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Active Customers</span>
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl font-serif font-bold text-coffee-950">
                {stats?.active_users || 0}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold">
                Registered coffee lovers
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-coffee-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Avg Order Value</span>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-3xl font-serif font-bold text-coffee-950">
                ${stats?.average_order_value ? stats.average_order_value.toFixed(2) : '0.00'}
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Average per ticket
              </p>
            </div>
          </div>

          {/* Tables for Best Selling & Top Rated */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Best Selling */}
            <div className="bg-white p-6 rounded-3xl border border-coffee-200 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-coffee-950 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                Best Selling Roasts
              </h3>
              {bestSelling.length === 0 ? (
                <p className="text-xs text-stone-400 py-4">No order sales registered yet.</p>
              ) : (
                <div className="space-y-2">
                  {bestSelling.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-coffee-50/50 border border-coffee-100 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-coffee-800 text-amber-200 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-coffee-950">{item.coffee_name || item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-coffee-800 bg-white px-2.5 py-1 rounded-lg border border-coffee-200">
                        {item.total_sold} cups sold
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Rated */}
            <div className="bg-white p-6 rounded-3xl border border-coffee-200 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-coffee-950 flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-600" />
                Top Customer Rated Blends
              </h3>
              {topRated.length === 0 ? (
                <p className="text-xs text-stone-400 py-4">No reviews recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {topRated.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-coffee-50/50 border border-coffee-100 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                          ★
                        </span>
                        <span className="font-semibold text-coffee-950">{item.coffee_name || item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        {item.average_rating ? item.average_rating.toFixed(1) : '5.0'} / 5.0
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: INVENTORY & CATALOG */}
      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Actions & Low Stock Notice */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {lowStockList.length > 0 ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{lowStockList.length} items have low stock (&lt; 5 units)!</span>
              </div>
            ) : (
              <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                All coffee inventory levels are healthy.
              </div>
            )}

            <button
              onClick={() => {
                setCoffeeForm({
                  id: null,
                  name: '',
                  description: '',
                  category: 'Espresso',
                  price: 4.50,
                  stock: 30,
                  image_url: '',
                });
                setCoffeeModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coffee-800 hover:bg-coffee-900 text-amber-100 text-xs font-bold uppercase tracking-wider shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Coffee Product</span>
            </button>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-3xl border border-coffee-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-coffee-50 border-b border-coffee-200 text-xs uppercase font-bold text-stone-600">
                  <tr>
                    <th className="p-4">Coffee Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Current Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-100">
                  {inventoryList.map((item) => {
                    const isLow = item.stock <= 5;
                    return (
                      <tr key={item.id} className="hover:bg-coffee-50/40 transition-colors">
                        <td className="p-4 font-bold text-coffee-950 flex items-center gap-3">
                          <img
                            src={item.image_url || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-coffee-100"
                          />
                          <div>
                            <div>{item.name}</div>
                            <div className="text-xs text-stone-400 font-normal line-clamp-1">{item.description}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-stone-100 text-stone-800">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 font-extrabold text-coffee-900">
                          ${item.price?.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.stock} units
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCoffeeForRestock(item);
                              setRestockModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                          >
                            + Restock
                          </button>

                          <button
                            onClick={() => {
                              setCoffeeForm({
                                id: item.id,
                                name: item.name,
                                description: item.description || '',
                                category: item.category || 'Espresso',
                                price: item.price,
                                stock: item.stock,
                                image_url: item.image_url || '',
                              });
                              setCoffeeModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-stone-600 hover:bg-coffee-100 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteCoffee(item.id, item.name)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: ALL CUSTOMER ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-coffee-950">
              Customer Order Management ({allOrders.length})
            </h3>
            <button
              onClick={fetchOrders}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-coffee-100 text-coffee-800 text-xs font-bold hover:bg-coffee-200"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-coffee-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-coffee-50 border-b border-coffee-200 text-xs uppercase font-bold text-stone-600">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-100">
                  {allOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-coffee-50/40">
                      <td className="p-4 font-mono font-bold text-coffee-950">
                        #{ord.id}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-stone-900">{ord.user?.full_name || `User #${ord.user_id}`}</div>
                        <div className="text-xs text-stone-400">{ord.user?.email}</div>
                      </td>
                      <td className="p-4 text-xs text-stone-600">
                        {ord.items?.length || 0} items
                      </td>
                      <td className="p-4 font-extrabold text-coffee-900">
                        ${ord.total_amount?.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-coffee-100 text-coffee-900">
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                          className="text-xs p-1.5 rounded-lg border border-coffee-200 font-bold bg-white focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-coffee-950">
              Registered Accounts ({allUsers.length})
            </h3>
            <button
              onClick={fetchUsers}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-coffee-100 text-coffee-800 text-xs font-bold hover:bg-coffee-200"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-coffee-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-coffee-50 border-b border-coffee-200 text-xs uppercase font-bold text-stone-600">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-100">
                  {allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-coffee-50/40">
                      <td className="p-4">
                        <div className="font-bold text-coffee-950">{u.full_name}</div>
                        <div className="text-xs text-stone-500">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleUserRoleChange(u, e.target.value)}
                          className="text-xs font-bold p-1 rounded-lg border border-coffee-200 bg-white"
                        >
                          <option value="customer">customer</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {u.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleUserStatusToggle(u)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            u.is_active 
                              ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200' 
                              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="max-w-2xl bg-white p-8 rounded-3xl border border-coffee-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">Promo Engine</span>
            <h3 className="font-serif text-2xl font-bold text-coffee-950">Create Discount Coupon</h3>
            <p className="text-xs text-stone-500 mt-1">Generate discount vouchers for promotional campaigns.</p>
          </div>

          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Coupon Code</label>
              <input
                type="text"
                required
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER30"
                className="w-full text-sm p-3 rounded-xl border border-coffee-200 font-mono font-bold uppercase focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-coffee-200 font-semibold bg-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Discount Value</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={couponValue}
                  onChange={(e) => setCouponValue(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-coffee-200 font-bold focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Validity Duration (Days from today)</label>
              <input
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-coffee-200 focus:ring-2 focus:ring-coffee-500 bg-coffee-50/20"
              />
            </div>

            <button
              type="submit"
              disabled={creatingCoupon}
              className="w-full py-3.5 rounded-xl bg-coffee-800 hover:bg-coffee-900 text-amber-100 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {creatingCoupon ? 'Generating Voucher...' : 'Issue Promo Code'}
            </button>
          </form>
        </div>
      )}

      {/* RESTOCK MODAL */}
      {restockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-coffee-200 space-y-4">
            <h4 className="font-serif text-xl font-bold text-coffee-950">
              Restock {selectedCoffeeForRestock?.name}
            </h4>
            <p className="text-xs text-stone-600">
              Current stock: {selectedCoffeeForRestock?.stock} units.
            </p>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Units to Add (+)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-coffee-200 font-bold focus:ring-2 focus:ring-coffee-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRestockModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-coffee-800 text-amber-100 text-xs font-bold hover:bg-coffee-900"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT COFFEE MODAL */}
      {coffeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-coffee-200 space-y-5 my-8">
            <h4 className="font-serif text-2xl font-bold text-coffee-950">
              {coffeeForm.id ? `Edit ${coffeeForm.name}` : 'Create New Coffee Product'}
            </h4>

            <form onSubmit={handleSaveCoffee} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Coffee Name</label>
                <input
                  type="text"
                  required
                  value={coffeeForm.name}
                  onChange={(e) => setCoffeeForm({ ...coffeeForm, name: e.target.value })}
                  placeholder="e.g. Vanilla Bean Latte"
                  className="w-full text-sm p-2.5 rounded-xl border border-coffee-200 focus:ring-2 focus:ring-coffee-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={coffeeForm.category}
                    onChange={(e) => setCoffeeForm({ ...coffeeForm, category: e.target.value })}
                    className="w-full text-sm p-2.5 rounded-xl border border-coffee-200 bg-white"
                  >
                    <option value="Espresso">Espresso</option>
                    <option value="Brewed">Brewed</option>
                    <option value="Cold Brew">Cold Brew</option>
                    <option value="Specialty">Specialty</option>
                    <option value="Pastries">Pastries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    required
                    value={coffeeForm.price}
                    onChange={(e) => setCoffeeForm({ ...coffeeForm, price: e.target.value })}
                    className="w-full text-sm p-2.5 rounded-xl border border-coffee-200 font-bold focus:ring-2 focus:ring-coffee-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={coffeeForm.stock}
                    onChange={(e) => setCoffeeForm({ ...coffeeForm, stock: e.target.value })}
                    className="w-full text-sm p-2.5 rounded-xl border border-coffee-200 font-bold focus:ring-2 focus:ring-coffee-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={coffeeForm.image_url}
                    onChange={(e) => setCoffeeForm({ ...coffeeForm, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full text-sm p-2.5 rounded-xl border border-coffee-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={coffeeForm.description}
                  onChange={(e) => setCoffeeForm({ ...coffeeForm, description: e.target.value })}
                  placeholder="Tasting notes, beans origin, extraction..."
                  className="w-full text-sm p-2.5 rounded-xl border border-coffee-200 focus:ring-2 focus:ring-coffee-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCoffeeModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-coffee-800 text-amber-100 text-xs font-bold uppercase tracking-wider hover:bg-coffee-900 shadow-md"
                >
                  Save Coffee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
