import React, { useState, useEffect } from 'react';
import { X, Star, Heart, ShoppingBag, Plus, Minus, MessageSquare, Send, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export const CoffeeModal = ({ coffee, onClose }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ average_rating: 0, total_reviews: 0 });
  const [loadingReviews, setLoadingReviews] = useState(true);

  // New review form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!coffee) return;
    const fetchReviewsAndSummary = async () => {
      try {
        setLoadingReviews(true);
        const [reviewsRes, summaryRes] = await Promise.allSettled([
          api.get(`/reviews/${coffee.id}`),
          api.get(`/reviews/${coffee.id}/summary`),
        ]);

        if (reviewsRes.status === 'fulfilled') {
          setReviews(Array.isArray(reviewsRes.value.data) ? reviewsRes.value.data : []);
        }
        if (summaryRes.status === 'fulfilled') {
          setSummary(summaryRes.value.data);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviewsAndSummary();
  }, [coffee]);

  if (!coffee) return null;

  const wishlisted = isWishlisted(coffee.id);
  const isOutOfStock = coffee.stock <= 0;

  const handleWishlistToggle = () => {
    if (wishlisted) {
      const item = wishlist.find((w) => w.coffee_id === coffee.id || w.coffee?.id === coffee.id);
      if (item) removeFromWishlist(item.id);
    } else {
      addToWishlist(coffee.id, coffee.name);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(coffee.id, quantity, coffee.name);
    onClose();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('info', 'Please sign in to leave a review.');
      return;
    }
    if (!newComment.trim()) {
      showToast('error', 'Please write a brief comment for your review.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.post('/reviews/', {
        coffee_id: coffee.id,
        rating: newRating,
        comment: newComment.trim(),
      });
      showToast('success', 'Thank you! Your review was posted.');
      setReviews([res.data, ...reviews]);
      setNewComment('');
      // Refresh summary
      const summaryRes = await api.get(`/reviews/${coffee.id}/summary`);
      setSummary(summaryRes.data);
    } catch (err) {
      showToast('error', err.formattedMessage || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const imageUrl =
    coffee.image_url ||
    'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-coffee-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-950 backdrop-blur-md shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Coffee Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-inner bg-coffee-100">
              <img
                src={imageUrl}
                alt={coffee.name}
                className="w-full h-full object-cover object-center"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-stone-900/90 text-amber-200 backdrop-blur-md">
                {coffee.category || 'Specialty Coffee'}
              </span>
            </div>

            {/* Coffee Details */}
            <div className="flex flex-col justify-between h-full space-y-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-950 leading-tight">
                  {coffee.name}
                </h2>

                {/* Rating & Stock Stats */}
                <div className="flex items-center gap-4 mt-2.5">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-stone-800">
                      {summary.average_rating ? summary.average_rating.toFixed(1) : '5.0'}
                    </span>
                    <span className="text-xs text-stone-600">
                      ({summary.total_reviews || reviews.length} reviews)
                    </span>
                  </div>

                  <span className="text-stone-300">•</span>

                  <span className={`text-xs font-bold ${isOutOfStock ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {isOutOfStock ? 'Out of Stock' : `In Stock (${coffee.stock} units)`}
                  </span>
                </div>

                <div className="text-2xl font-extrabold text-coffee-900 mt-4">
                  ${coffee.price?.toFixed(2)}
                </div>

                <p className="text-sm text-stone-600 leading-relaxed mt-4">
                  {coffee.description || 'Carefully crafted with premium whole beans for unmatched body, brightness, and aroma.'}
                </p>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-coffee-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase text-stone-600">Quantity</span>
                  <div className="flex items-center border border-coffee-200 rounded-xl bg-coffee-50/50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="p-1.5 rounded-lg hover:bg-white text-stone-700 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-stone-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(coffee.stock || 99, quantity + 1))}
                      disabled={quantity >= coffee.stock || isOutOfStock}
                      className="p-1.5 rounded-lg hover:bg-white text-stone-700 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 ${
                      isOutOfStock
                        ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        : 'bg-coffee-800 hover:bg-coffee-900 text-amber-100 shadow-coffee-900/10'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart (${((coffee.price || 0) * quantity).toFixed(2)})</span>
                  </button>

                  <button
                    onClick={handleWishlistToggle}
                    className={`p-3.5 rounded-xl border transition-colors shadow-sm ${
                      wishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'border-coffee-200 text-stone-600 hover:bg-coffee-50'
                    }`}
                    title={wishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-6 border-t border-coffee-200/80 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-coffee-950 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-coffee-600" />
                Customer Reviews
              </h3>
              <span className="text-xs font-semibold text-stone-600">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            {/* Write a Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-coffee-50/70 p-4 sm:p-5 rounded-2xl border border-coffee-200/80 space-y-4">
              <h4 className="text-sm font-bold text-coffee-900">Share your tasting thoughts</h4>
              
              {/* Star Rating Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600">Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-current' : 'text-stone-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What did you love about this roast? Note aroma, body, or sweetness..."
                rows={2}
                className="w-full text-sm p-3 rounded-xl border border-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-500 bg-white"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-coffee-800 hover:bg-coffee-900 text-amber-100 text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </div>
            </form>

            {/* Reviews List */}
            {loadingReviews ? (
              <div className="text-center py-6 text-sm text-stone-600">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-6 text-sm text-stone-600 bg-stone-50 rounded-xl">
                No reviews yet. Be the first to taste and review this blend!
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div key={rev.id || Math.random()} className="p-3.5 rounded-xl bg-white border border-coffee-100 shadow-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-coffee-950">
                        {rev.user?.full_name || rev.user_email || 'Coffee Connoisseur'}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
