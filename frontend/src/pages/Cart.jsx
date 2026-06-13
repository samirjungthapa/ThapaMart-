import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, applyCoupon, removeCoupon, calcPrices } from '../store/slices/cartSlice.js';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiPercent, FiX } from 'react-icons/fi';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, coupon } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const prices = calcPrices({ cartItems, coupon });

  const handleQtyChange = (item, qty) => {
    dispatch(
      addToCart({
        ...item,
        quantity: Number(qty),
      })
    );
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'THAPA10') {
      dispatch(applyCoupon({ code: 'THAPA10', percent: 10 }));
      setCouponCode('');
    } else if (code === 'SMART20') {
      dispatch(applyCoupon({ code: 'SMART20', percent: 20 }));
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try THAPA10 or SMART20');
    }
  };

  const handleCheckout = () => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="premium-mesh-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center sm:justify-start">
            <FiShoppingBag className="mr-3 text-primary w-8 h-8" /> Shopping Bag
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-slate-500 max-w-xl mx-auto shadow-premium border border-slate-100 dark:border-slate-800">
            <p className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Your shopping bag is empty.</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-xs shadow-premium hover:scale-105 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Left: Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="glass-card rounded-2xl p-5 shadow-premium border border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                  {/* Product Details info */}
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                    />
                    <div>
                      <Link to={`/products/${item.product}`} className="font-bold text-sm text-slate-800 dark:text-slate-100 hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </Link>
                      <p className="text-xs text-slate-400 mt-1">Price: ${item.price}</p>
                    </div>
                  </div>

                  {/* Quantity & Delete options */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Quantity</label>
                      <select
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(item, e.target.value)}
                        className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none"
                      >
                        {[...Array(item.stock || 10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Total</span>
                      <span className="text-sm font-extrabold text-slate-800 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.product)}
                      className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors mt-4 sm:mt-0"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Right: Cart Summary Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel rounded-2xl p-6 shadow-premium border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-white text-base pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                  Bag Summary
                </h3>

                {/* Subtotal metrics */}
                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-slate-800 dark:text-white">${prices.itemsPrice}</span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Discount Coupon ({coupon.code})</span>
                      <span className="font-semibold">-${prices.discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span className="font-semibold text-slate-800 dark:text-white">
                      {prices.shippingPrice === 0 ? 'Free' : `$${prices.shippingPrice}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Sales Tax (13%)</span>
                    <span className="font-semibold text-slate-800 dark:text-white">${prices.taxPrice}</span>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-850 my-4 pt-3.5 flex justify-between text-sm font-extrabold text-slate-800 dark:text-white">
                    <span>Total Cost</span>
                    <span>${prices.totalPrice}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center py-3 px-6 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-premium transition-all duration-300 hover:scale-102 mt-6"
                >
                  Checkout
                  <FiArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>

              {/* Coupon code application block */}
              <div className="glass-panel rounded-2xl p-6 shadow-premium border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center">
                  <FiPercent className="mr-1.5 w-4 h-4 text-accent" /> Promotional Coupons
                </h4>
                
                {coupon ? (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    <span>Coupon {coupon.code} active ({coupon.percent}% Off)</span>
                    <button onClick={() => dispatch(removeCoupon())} className="text-slate-400 hover:text-red-500">
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. THAPA10, SMART20"
                        className="px-3.5 py-2 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary uppercase"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-950 text-white font-semibold text-xs transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                    
                    {/* Suggested coupons */}
                    <div className="mt-3.5 flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Try:</span>
                      <button
                        onClick={() => {
                          dispatch(applyCoupon({ code: 'THAPA10', percent: 10 }));
                          setCouponError('');
                        }}
                        className="px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold rounded-lg transition-colors border border-primary/20"
                      >
                        THAPA10 (10%)
                      </button>
                      <button
                        onClick={() => {
                          dispatch(applyCoupon({ code: 'SMART20', percent: 20 }));
                          setCouponError('');
                        }}
                        className="px-2 py-1 bg-accent/10 hover:bg-accent/20 text-accent-dark dark:text-accent text-[10px] font-bold rounded-lg transition-colors border border-accent/20"
                      >
                        SMART20 (20%)
                      </button>
                    </div>
                  </div>
                )}

                {couponError && (
                  <p className="text-[11px] text-red-500 mt-2 font-medium">{couponError}</p>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;
