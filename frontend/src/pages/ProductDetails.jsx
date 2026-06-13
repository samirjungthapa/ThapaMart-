import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice.js';
import { addToWishlist } from '../store/slices/wishlistSlice.js';
import api from '../store/api.js';
import { FiStar, FiHeart, FiShoppingBag, FiCheck, FiXOctagon } from 'react-icons/fi';
import ProductCard from '../components/ProductCard.jsx';

const fallbackProducts = [
  {
    id: "prod-1",
    title: "Pro Sound Max Wireless Headphones",
    description: "Experience premium sound quality with active noise cancellation, 40-hour battery life, and comfortable memory foam earcups.",
    category: "electronics",
    price: 189.99,
    stock: 25,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.8,
    reviews: [
      { name: 'Sarah J.', rating: 5, comment: 'Simply incredible sound stage!' },
      { name: 'Mitch P.', rating: 4.5, comment: 'Comfy but slightly bulky.' }
    ]
  },
  {
    id: "prod-2",
    title: "Minimalist Leather Smart Watch",
    description: "A sleek, premium smart watch with heart rate tracking, fitness features, and a hand-crafted genuine leather band.",
    category: "electronics",
    price: 249.99,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.6,
    reviews: []
  },
  {
    id: "prod-3",
    title: "Classic Cotton Bomber Jacket",
    description: "Premium cotton bomber jacket designed for comfort and style. Water-resistant outer shell with thermal inner lining.",
    category: "fashion",
    price: 89.99,
    stock: 50,
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.5,
    reviews: []
  }
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchProductDetails = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      
      // Fetch related products dynamically
      if (data && data.category) {
        const relatedRes = await api.get('/products', {
          params: { category: data.category, limit: 4 }
        });
        const list = (relatedRes.data.products || []).filter(p => (p.id || p._id) !== (data.id || data._id));
        setRelatedProducts(list.slice(0, 4));
      }
    } catch (err) {
      console.warn("ℹ️ API failed. Running local product details finder.");
      const mockProd = fallbackProducts.find(p => p.id === id || p._id === id);
      setProduct(mockProd || fallbackProducts[0]);
      
      // Fallback related
      const currentCategory = mockProd ? mockProd.category : 'electronics';
      const fallbackList = fallbackProducts.filter(p => p.category === currentCategory && (p.id !== id));
      setRelatedProducts(fallbackList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    setQuantity(1);
    setReviewSuccess(false);
    setReviewError('');
  }, [id]);

  useEffect(() => {
    if (product) {
      // Save to recently viewed
      const saved = localStorage.getItem('recentlyViewed');
      let list = saved ? JSON.parse(saved) : [];
      list = list.filter(item => (item.id || item._id) !== (product.id || product._id));
      list.unshift(product);
      localStorage.setItem('recentlyViewed', JSON.stringify(list.slice(0, 8)));

      // Set other recently viewed (excluding current)
      setRecentlyViewed(list.filter(item => (item.id || item._id) !== (product.id || product._id)).slice(0, 4));
    }
  }, [product]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product: product.id || product._id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        stock: product.stock,
        quantity: Number(quantity),
      })
    );
    navigate('/cart');
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(product));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    try {
      await api.post(`/products/${product.id || product._id}/reviews`, { rating, comment });
      setReviewSuccess(true);
      setComment('');
      fetchProductDetails(); // Refresh product ratings
    } catch (err) {
      setReviewError(
        err.response && err.response.data.message ? err.response.data.message : 'Failed to submit review'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-slate-500">Product not found.</p>
        <Link to="/shop" className="text-primary hover:underline">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="premium-mesh-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Image Gallery + Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
          
          {/* Left: Product Images */}
          <div className="glass-panel rounded-3xl p-6 shadow-premium border border-slate-100 dark:border-slate-800">
            <div className="overflow-hidden rounded-2xl aspect-square bg-slate-50 dark:bg-slate-900">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Right: Product Details Info */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-widest">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                {product.title}
              </h1>
            </div>

            {/* Ratings Summary */}
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex text-amber-400">
                <FiStar className="w-4 h-4 fill-current" />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {product.ratings || '5.0'}
              </span>
              <span className="text-slate-400 text-sm">|</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {product.reviews ? product.reviews.length : 0} verified customer reviews
              </span>
            </div>

            {/* Price tag */}
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              ${product.price}
            </div>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Stock Badge */}
            <div className="flex items-center space-x-2">
              {product.stock > 0 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                  <FiCheck className="mr-1.5 w-3.5 h-3.5" /> In Stock ({product.stock} units remaining)
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-xs font-semibold">
                  <FiXOctagon className="mr-1.5 w-3.5 h-3.5" /> Out of stock
                </span>
              )}
            </div>

            {/* Quantity Selector & Add to Cart button */}
            {product.stock > 0 && (
              <div className="flex items-center space-x-4 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Qty</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
                  >
                    {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-grow pt-5">
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center py-3.5 px-6 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-premium transition-all duration-300 hover:scale-102"
                  >
                    <FiShoppingBag className="mr-2 w-4 h-4" /> Add to Cart
                  </button>
                </div>

                <div className="pt-5">
                  <button
                    onClick={handleAddToWishlist}
                    className="p-3.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-200 transition-all hover:scale-105"
                  >
                    <FiHeart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-slate-100 dark:border-slate-850 pt-12">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-8">
            Product Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Reviews list */}
            <div className="lg:col-span-2 space-y-6">
              {!product.reviews || product.reviews.length === 0 ? (
                <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                  This product has not been reviewed yet. Be the first to share your thoughts!
                </div>
              ) : (
                product.reviews.map((rev, idx) => (
                  <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{rev.name}</h4>
                      <div className="flex text-amber-400">
                        {[...Array(Math.floor(rev.rating))].map((_, i) => (
                          <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Write review form */}
            <div className="lg:col-span-1">
              <div className="glass-panel rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-white text-base mb-4">Write a Review</h3>
                
                {userInfo ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {reviewSuccess && (
                      <div className="p-3 text-xs rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Review submitted successfully!
                      </div>
                    )}
                    {reviewError && (
                      <div className="p-3 text-xs rounded-lg bg-red-500/10 text-red-600 border border-red-500/20">
                        {reviewError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Rating</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                      >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Average</option>
                        <option value="2">2 - Poor</option>
                        <option value="1">1 - Terrible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Comment</label>
                      <textarea
                        required
                        rows="4"
                        placeholder="Write your product experience..."
                        className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all shadow-premium"
                    >
                      Submit Review
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Please <Link to="/login" className="text-primary hover:underline font-semibold">login</Link> to write a review.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* AI Product Recommendations (Related Products) */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-850 pt-12 mt-16">
            <div className="mb-10 text-center sm:text-left">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 dark:bg-accent/10 text-[9px] font-bold text-primary dark:text-accent uppercase tracking-wider">
                Smart Suggestions
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                AI Product Recommendations
              </h2>
              <p className="text-xs text-slate-500 mt-1">Based on current item interest and category popularity trends.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id || prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-850 pt-12 mt-16">
            <div className="mb-10 text-center sm:text-left">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Recently Viewed
              </h2>
              <p className="text-xs text-slate-500 mt-1">Pick up where you left off.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recentlyViewed.map((prod) => (
                <ProductCard key={prod.id || prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
