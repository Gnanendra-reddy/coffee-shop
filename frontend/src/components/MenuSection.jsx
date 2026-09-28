import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, RefreshCw, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { CoffeeCard } from './CoffeeCard';

const CATEGORIES = [
  'All Coffees',
  'Espresso',
  'Brewed',
  'Cold Brew',
  'Specialty',
  'Pastries'
];

export const MenuSection = ({ onQuickView, menuRef, onRequireAuth }) => {
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Coffees');
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const fetchCoffees = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        page_size: pageSize,
        sort_by: sortBy,
        order,
      };

      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All Coffees') params.category = selectedCategory;
      if (minPrice !== '' && !isNaN(parseFloat(minPrice))) params.min_price = parseFloat(minPrice);
      if (maxPrice !== '' && !isNaN(parseFloat(maxPrice))) params.max_price = parseFloat(maxPrice);

      const res = await api.get('/coffee/', { params });
      
      // Robust unpacking for FastAPI responses
      let items = [];
      let total = 0;

      if (Array.isArray(res.data)) {
        items = res.data;
        total = res.data.length;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        items = res.data.data;
        total = res.data.pagination?.total ?? items.length;
      } else if (res.data?.items && Array.isArray(res.data.items)) {
        items = res.data.items;
        total = res.data.total ?? items.length;
      }

      setCoffees(items);
      setTotalCount(total);
    } catch (err) {
      console.error('Failed to load coffees:', err);
      setCoffees([]);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, order, search, selectedCategory, minPrice, maxPrice]);

  useEffect(() => {
    fetchCoffees();
  }, [fetchCoffees]);

  // Reset page when category or search changes
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All Coffees');
    setSortBy('id');
    setOrder('asc');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  return (
    <section ref={menuRef} id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 block mb-1">
            Artisan Roastery Menu
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-950">
            Handcrafted Brews & Treats
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            Choose from freshly extracted single-origin espressos, refreshing nitro brews, and freshly baked morning pastries.
          </p>
        </div>

        <button
          onClick={fetchCoffees}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-coffee-700 bg-coffee-100/70 hover:bg-coffee-200/70 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Menu</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4 mb-8 bg-white p-4 sm:p-6 rounded-3xl border border-coffee-200/80 shadow-sm">
        
        {/* Top Controls: Search Input + Sorting */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search bar */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by coffee name (e.g. espresso, latte, mocha)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/30"
            />
          </div>

          {/* Sort Selector */}
          <div className="sm:col-span-3">
            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [sb, ord] = e.target.value.split('-');
                setSortBy(sb);
                setOrder(ord);
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-coffee-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/30 text-stone-700"
            >
              <option value="id-asc">Featured / Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A to Z</option>
              <option value="name-desc">Alphabetical: Z to A</option>
            </select>
          </div>

          {/* Price Range Filter Inputs */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setPage(1);
              }}
              placeholder="Min $"
              className="w-1/2 py-2.5 px-3 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/30"
            />
            <span className="text-stone-400">-</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
              placeholder="Max $"
              className="w-1/2 py-2.5 px-3 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-coffee-50/30"
            />
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-coffee-100">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-coffee-900 text-amber-200 shadow-md shadow-coffee-950/15'
                  : 'bg-coffee-100/80 text-stone-700 hover:bg-coffee-200/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

      </div>

      {/* Coffee Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-coffee-200/60 p-4 space-y-4 animate-pulse">
              <div className="aspect-square bg-coffee-100 rounded-xl" />
              <div className="h-4 bg-coffee-100 rounded w-3/4" />
              <div className="h-3 bg-coffee-50 rounded w-full" />
              <div className="h-8 bg-coffee-100 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : coffees.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-coffee-200/80 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-coffee-100 flex items-center justify-center text-coffee-600">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-coffee-950">No coffee brews found</h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            We couldn't find any roast matching your current search or filters. Try clicking reset filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coffee-800 text-amber-100 font-bold text-xs uppercase tracking-wider hover:bg-coffee-900 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {coffees.map((coffee) => (
            <CoffeeCard
              key={coffee.id}
              coffee={coffee}
              onQuickView={onQuickView}
              onRequireAuth={onRequireAuth}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalCount > pageSize && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-coffee-200 bg-white text-stone-700 text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-coffee-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-xs font-semibold text-stone-600">
            Page {page} of {Math.ceil(totalCount / pageSize)}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(totalCount / pageSize)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-coffee-200 bg-white text-stone-700 text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-coffee-50 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </section>
  );
};
