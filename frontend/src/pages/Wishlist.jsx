import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '../store/slices/wishlistSlice.js';
import { addToCart } from '../store/slices/cartSlice.js';
import { FiHeart, FiTrash2, FiShoppingCart, FiShoppingBag } from 'react-icons/fi';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const handleMoveToCart = (item) => {
    dispatch(
      addToCart({
        product: item.id || item._id,
        title: item.title,
        price: item.price,
        image: item.images[0],
        stock: item.stock,
        quantity: 1,
      })
    );
    dispatch(removeFromWishlist(item.id || item._id));
  };

  return (
    <div className="premium-mesh-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center sm:justify-start">
            <FiHeart className="mr-3 text-red-500 fill-current w-8 h-8" /> Your Wishlist
          </h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-slate-500 max-w-xl mx-auto shadow-premium border border-slate-100 dark:border-slate-800">
            <p className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Your wishlist is empty.</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-xs shadow-premium hover:scale-105 transition-all"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((item) => (
              <div
                key={item.id || item._id}
                className="glass-card rounded-2xl p-5 shadow-premium border border-slate-100 dark:border-slate-850 flex flex-col justify-between"
              >
                
                {/* Product Meta */}
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-xl aspect-video bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-primary dark:text-accent uppercase tracking-widest">{item.category}</span>
                    <Link to={`/products/${item.id || item._id}`} className="block font-bold text-sm text-slate-800 dark:text-slate-100 hover:underline line-clamp-1 mt-1">
                      {item.title}
                    </Link>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white mt-2">${item.price}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <button
                    onClick={() => dispatch(removeFromWishlist(item.id || item._id))}
                    className="flex items-center text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="mr-1.5 w-4 h-4" /> Remove
                  </button>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={item.stock <= 0}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all shadow-premium disabled:opacity-40 disabled:scale-100"
                  >
                    <FiShoppingCart className="mr-1.5 w-4 h-4" /> Move to Cart
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
