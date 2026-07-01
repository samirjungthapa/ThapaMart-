import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, ArrowRight, X, Trash2, Plus, Minus, Tag, Check, Calendar, ArrowRightCircle } from 'lucide-react';
import { addToCart, removeFromCart, applyCoupon, removeCoupon, calcPrices } from '../store/slices/cartSlice.js';
import { motion, AnimatePresence } from 'framer-motion';
import { playClick } from '../utils/audio.js';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, coupon } = useSelector(s => s.cart);
  const { userInfo } = useSelector(s => s.auth);

  // States
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [showCouponsDrawer, setShowCouponsDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Handle importing shared cart
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedCart = params.get('sharedCart');
    if (sharedCart) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(sharedCart)));
        if (Array.isArray(decoded)) {
          decoded.forEach(item => {
            dispatch(addToCart(item));
          });
          showToast('Imported shared cart items successfully!');
          // Clear query params
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (err) {
        console.error('Failed to import shared cart:', err);
      }
    }
  }, []);

  const handleShareCart = () => {
    playClick();
    if (cartItems.length === 0) {
      showToast('Your cart is empty!');
      return;
    }
    const cartData = cartItems.map(item => ({
      product: item.product,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      stock: item.stock,
      subscribed: item.subscribed || false
    }));
    const serialized = btoa(encodeURIComponent(JSON.stringify(cartData)));
    const shareUrl = `${window.location.origin}/cart?sharedCart=${serialized}`;
    navigator.clipboard.writeText(shareUrl);
    showToast('Cart link copied! Send it to your friend. 👥');
  };

  const prices = calcPrices({ cartItems, coupon });
  const subtotal = prices.itemsPrice - prices.discount;
  const shippingThreshold = 150;
  const progressToFreeShipping = Math.min((subtotal / shippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(shippingThreshold - subtotal, 0);

  // Available coupons database
  const availableCoupons = [
    { code: 'THAPA10', percent: 10, description: '10% discount on all items.' },
    { code: 'SMART20', percent: 20, description: '20% discount on orders above $50.' },
    { code: 'MEGA50', percent: 50, description: 'Exclusive mega 50% discount voucher!' }
  ];

  // Cross-sell recommended accessories
  const recommendations = [
    {
      product: 'rec-1',
      title: 'Precision Wireless Pro Mouse',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&q=80',
      stock: 15
    },
    {
      product: 'rec-2',
      title: 'Premium Leather Headphone Case',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&q=80',
      stock: 8
    },
    {
      product: 'rec-3',
      title: 'Premium Wireless Charging Stand',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1622445262465-2481c8573251?w=300&q=80',
      stock: 12
    }
  ];

  const handleApplyCoupon = (e, selectedCode = null) => {
    if (e) e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    const code = (selectedCode || couponCode).trim().toUpperCase();
    if (!code) return;

    const matchedCoupon = availableCoupons.find(c => c.code === code);
    if (matchedCoupon) {
      dispatch(applyCoupon({ code: matchedCoupon.code, percent: matchedCoupon.percent }));
      setCouponSuccess(`Coupon "${matchedCoupon.code}" applied successfully!`);
      setCouponCode('');
      setShowCouponsDrawer(false);
      showToast(`Coupon "${matchedCoupon.code}" applied.`);
    } else {
      setCouponError('Invalid coupon code. Try THAPA10 or SMART20.');
    }
  };

  const handleQuantityChange = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty > 0 && newQty <= (item.stock || 10)) {
      dispatch(addToCart({ ...item, quantity: newQty }));
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddRecommendToCart = (prod) => {
    dispatch(addToCart({
      product: prod.product,
      title: prod.title,
      price: prod.price,
      image: prod.image,
      quantity: 1,
      stock: prod.stock
    }));
    showToast(`${prod.title} added to bag.`);
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '100vh', background: '#FFFFFF', color: '#09090B' }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-full text-xs font-bold shadow-lg"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ width: '100%', padding: '0 4%', boxSizing: 'border-box' }}>
        
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 900, color: '#09090B', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Shopping Bag
          </h1>
          <div style={{ width: '2rem', height: '1px', background: '#09090B', margin: '0 auto' }} />
        </div>

        {cartItems.length === 0 ? (
          <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '5rem 2rem', textAlign: 'center', maxWidth: '32rem', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <ShoppingBag size={24} style={{ color: '#09090B' }} />
            </div>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#09090B', marginBottom: '0.5rem' }}>Your shopping bag is empty.</p>
            <p style={{ fontSize: '0.875rem', color: '#71717A', marginBottom: '2rem' }}>Discover our premium collections.</p>
            <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: '#000000', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none' }}>
              Start Shopping <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Free Shipping Progress Indicator */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5">
              <div className="flex justify-between items-center mb-2.5 text-xs font-bold text-black uppercase tracking-wider">
                <span>Free Shipping Meter</span>
                <span>{progressToFreeShipping >= 100 ? 'Free Shipping Unlocked!' : `$${remainingForFreeShipping.toFixed(2)} Remaining`}</span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden mb-2">
                <div 
                  className="bg-black h-full transition-all duration-500" 
                  style={{ width: `${progressToFreeShipping}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-[#71717A]">
                {progressToFreeShipping >= 100 
                  ? "🎉 Excellent! Your order qualifies for free delivery." 
                  : `Add $${remainingForFreeShipping.toFixed(2)} more to your bag to enjoy free shipping.`}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              
              {/* Items Panel */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div 
                    key={item.product} 
                    style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1.5rem' }} 
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between"
                  >
                    <div className="flex items-center gap-6 flex-grow">
                      <Link to={`/products/${item.product}`}>
                        <img src={item.image} alt={item.title} style={{ width: '6rem', height: '8rem', objectFit: 'cover', background: '#F9FAFB' }} className="border border-[#E5E7EB]" />
                      </Link>
                      <div className="space-y-1">
                        <Link to={`/products/${item.product}`} style={{ fontSize: '1rem', fontWeight: 700, color: '#09090B', textDecoration: 'none', display: 'block' }}>
                          {item.title}
                        </Link>
                        <p style={{ fontSize: '0.875rem', color: '#71717A' }}>Price: ${Number(item.price).toFixed(2)}</p>
                        
                        {item.engraving && (
                          <div className="flex items-center gap-1.5 text-xs text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md w-fit font-bold">
                            <span>✨ Engraved:</span>
                            <span className="font-mono">"{item.engraving}"</span>
                          </div>
                        )}

                        {item.customColor && item.customColor !== '#ffffff' && item.customColor !== '#FFFFFF' && (
                          <div className="flex items-center gap-1.5 text-xs text-[#71717A] mt-1 font-bold">
                            <span>Palette:</span>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.customColor, display: 'inline-block', border: '1px solid #d1d5db' }} title={item.customColor}></span>
                            <span className="font-mono text-[10px] text-zinc-500">{item.customColor}</span>
                          </div>
                        )}

                        {/* Estimated delivery date */}
                        <div className="flex items-center gap-1.5 text-[11px] text-[#71717A] pt-1">
                          <Calendar size={12} />
                          <span>Estimated delivery: Arrives in 2-3 business days</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      {/* Quantity Stepper buttons */}
                      <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden bg-[#F9FAFB]">
                        <button 
                          onClick={() => handleQuantityChange(item, -1)}
                          className="px-3 py-1.5 hover:bg-black/5 text-[#09090B] transition-all"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-4 py-1 font-bold text-xs text-black font-mono">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item, 1)}
                          className="px-3 py-1.5 hover:bg-black/5 text-[#09090B] transition-all"
                          disabled={item.quantity >= (item.stock || 10)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span style={{ fontSize: '1rem', fontWeight: 900, color: '#09090B' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => dispatch(removeFromCart(item.product))} 
                        className="text-black/40 hover:text-black transition-colors"
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Panel */}
              <div className="lg:col-span-1 space-y-6">
                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#09090B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #E5E7EB' }}>
                    Order Summary
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', color: '#52525B' }}>
                    <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between' }}>
                      <span>Subtotal</span>
                      <span style={{ color: '#09090B', fontWeight: 700 }}>${prices.itemsPrice}</span>
                    </div>
                    {coupon && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981' }}>
                        <span>Discount ({coupon.code})</span>
                        <span style={{ fontWeight: 700 }}>-${prices.discount}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Estimated Shipping</span>
                      <span style={{ color: '#09090B', fontWeight: 700 }}>{prices.shippingPrice === 0 ? 'Free' : `$${prices.shippingPrice}`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Sales Tax</span>
                      <span style={{ color: '#09090B', fontWeight: 700 }}>${prices.taxPrice}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB', fontSize: '1.25rem', color: '#09090B', fontWeight: 900 }}>
                      <span>Total</span>
                      <span>${prices.totalPrice}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(userInfo ? '/checkout' : '/login?redirect=/checkout')}
                    className="bg-black text-white hover:bg-black/90 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all mt-6"
                  >
                    Proceed to Checkout <ArrowRight size={14} />
                  </button>

                  <button 
                    onClick={handleShareCart}
                    className="bg-transparent border border-black hover:bg-black/5 text-black w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all mt-3 cursor-pointer"
                  >
                    Share Cart / Invite Friend 👥
                  </button>
                </div>

                {/* Coupons Section */}
                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '1.5rem' }} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#09090B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Promo Code
                    </h4>
                    <button 
                      onClick={() => setShowCouponsDrawer(true)}
                      className="text-xs text-black underline font-bold flex items-center gap-1"
                    >
                      <Tag size={12} /> View Offers
                    </button>
                  </div>

                  {coupon ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#FFFFFF', border: '1px solid #E5E7EB', fontSize: '0.875rem', color: '#09090B', fontWeight: 700 }}>
                      <span className="flex items-center gap-1.5 text-emerald-600"><Check size={14} /> {coupon.code} Applied</span>
                      <button onClick={() => dispatch(removeCoupon())} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                    </div>
                  ) : (
                    <div>
                      <form onSubmit={handleApplyCoupon} style={{ display: 'flex' }}>
                        <input 
                          type="text" placeholder="Enter code" value={couponCode} onChange={e => setCouponCode(e.target.value)}
                          style={{ flexGrow: 1, background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '0.75rem 1rem', color: '#09090B', fontSize: '0.875rem', outline: 'none', textTransform: 'uppercase' }} 
                        />
                        <button type="submit" style={{ background: '#09090B', border: 'none', padding: '0 1.5rem', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>Apply</button>
                      </form>
                      {couponError && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.5rem' }}>{couponError}</p>}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Cross-Sell Accessories Slider */}
            <div className="pt-10 border-t border-[#E5E7EB]">
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-extrabold text-[#09090B] mb-6">
                Complete Your Setup
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((prod) => (
                  <div 
                    key={prod.product}
                    className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 flex gap-4 items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img src={prod.image} alt={prod.title} className="w-16 h-16 rounded-xl object-cover border border-[#E5E7EB]" />
                      <div>
                        <h4 className="text-xs font-bold text-black">{prod.title}</h4>
                        <p className="text-xs text-[#71717A] mt-0.5">${prod.price}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddRecommendToCart(prod)}
                      className="text-black hover:text-black/80 font-bold"
                    >
                      <ArrowRightCircle size={22} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Available Coupons Slide-over Drawer */}
      <AnimatePresence>
        {showCouponsDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCouponsDrawer(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E5E7EB]">
                <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                  <Tag size={16} /> Available Offers
                </h3>
                <button onClick={() => setShowCouponsDrawer(false)} className="text-[#71717A] hover:text-black">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 flex-grow overflow-y-auto">
                {availableCoupons.map((c) => (
                  <div 
                    key={c.code}
                    className="bg-[#F9FAFB] border-2 border-dashed border-[#E5E7EB] rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono font-bold text-sm text-black">{c.code}</span>
                        <span className="text-xs font-extrabold text-emerald-600">{c.percent}% OFF</span>
                      </div>
                      <p className="text-xs text-[#71717A]">{c.description}</p>
                    </div>

                    <button
                      onClick={() => handleApplyCoupon(null, c.code)}
                      className="bg-black text-white hover:bg-black/90 w-full py-2 rounded-xl text-xs font-bold transition-all mt-4"
                    >
                      Apply Code
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Cart;
