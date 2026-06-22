import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Gift } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, calcPrices } from '../store/slices/cartSlice.js';
import { playClick, playSwoosh } from '../utils/audio.js';

const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, coupon } = useSelector((state) => state.cart);

  const [addGiftWrap, setAddGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  const prices = calcPrices({ cartItems, coupon });

  // Multi-tier Reward Thresholds (Rs.)
  const WRAP_THRESHOLD = 5000;
  const SHIPPING_THRESHOLD = 10000;
  const ACCESSORY_THRESHOLD = 15000;

  const currentPrice = prices.itemsPrice;

  // Calculate tier levels
  const wrapUnlocked = currentPrice >= WRAP_THRESHOLD;
  const shippingUnlocked = currentPrice >= SHIPPING_THRESHOLD;
  const accessoryUnlocked = currentPrice >= ACCESSORY_THRESHOLD;

  // Maximum value for the progress indicator is Rs. 15,000
  const progressPercent = Math.min(100, (currentPrice / ACCESSORY_THRESHOLD) * 100);

  const handleQtyChange = (item, newQty) => {
    playClick();
    if (newQty <= 0) {
      dispatch(removeFromCart(item.product));
      return;
    }
    if (newQty > item.stock) return;
    dispatch(addToCart({ ...item, quantity: newQty }));
  };

  const handleCheckout = () => {
    playClick();
    onClose();
    navigate('/checkout');
  };

  const toggleGiftWrap = () => {
    playClick();
    setAddGiftWrap(!addGiftWrap);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { playSwoosh(); onClose(); }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '420px',
              height: '100%',
              background: '#FFFFFF',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 101,
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={20} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Bag</h3>
                <span style={{ fontSize: '0.8rem', color: '#71717A', fontWeight: 600 }}>
                  ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
                </span>
              </div>
              <button onClick={() => { playSwoosh(); onClose(); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <X size={20} />
              </button>
            </div>

            {/* Premium Multi-Tier Rewards Tracker */}
            <div style={{ padding: '1.25rem 1.5rem', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#71717A', marginBottom: '0.5rem' }}>
                <span>Free Wrap (5k)</span>
                <span>Free Ship (10k)</span>
                <span>Accessory (15k)</span>
              </div>

              {/* Progress Bar with markers */}
              <div style={{ position: 'relative', width: '100%', height: '6px', background: '#E5E7EB', borderRadius: '3px', marginBottom: '1rem' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ height: '100%', background: '#000000', borderRadius: '3px' }}
                />
                
                {/* Visual markers */}
                <div style={{ position: 'absolute', top: '-3px', left: '33.3%', width: '12px', height: '12px', borderRadius: '50%', background: wrapUnlocked ? '#000000' : '#FFFFFF', border: '2px solid #E5E7EB' }} title="Gift Wrap Upgrade" />
                <div style={{ position: 'absolute', top: '-3px', left: '66.6%', width: '12px', height: '12px', borderRadius: '50%', background: shippingUnlocked ? '#000000' : '#FFFFFF', border: '2px solid #E5E7EB' }} title="Free Shipping" />
                <div style={{ position: 'absolute', top: '-3px', left: '98%', width: '12px', height: '12px', borderRadius: '50%', background: accessoryUnlocked ? '#000000' : '#FFFFFF', border: '2px solid #E5E7EB' }} title="Cleaning Kit" />
              </div>

              {/* Reward status messages */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#09090B' }}>
                <Gift size={14} style={{ color: '#D4AF37' }} />
                <span>
                  {!wrapUnlocked && `Add Rs. ${(WRAP_THRESHOLD - currentPrice).toLocaleString()} for free luxury gift packaging.`}
                  {wrapUnlocked && !shippingUnlocked && `Gift Wrap Unlocked! Add Rs. ${(SHIPPING_THRESHOLD - currentPrice).toLocaleString()} for Free Shipping.`}
                  {shippingUnlocked && !accessoryUnlocked && `Free Shipping Unlocked! Add Rs. ${(ACCESSORY_THRESHOLD - currentPrice).toLocaleString()} for a Premium Accessory.`}
                  {accessoryUnlocked && '🎉 All premium tiers unlocked! Luxury wrap, shipping, & cleaning kit applied!'}
                </span>
              </div>
            </div>

            {/* Cart Items */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem' }} className="space-y-6">
              {cartItems.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: '1rem' }}>
                  <ShoppingBag size={48} style={{ strokeWidth: 1, color: '#A1A1AA' }} />
                  <p style={{ fontSize: '0.875rem', color: '#71717A' }}>Your bag is currently empty.</p>
                  <button onClick={() => { playClick(); onClose(); }} style={{ padding: '0.75rem 1.5rem', background: '#000000', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div key={item.product} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '1rem' }}>
                      <div style={{ width: '70px', height: '90px', flexShrink: 0, overflow: 'hidden', background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                        <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#09090B', margin: 0, lineHeight: 1.3 }}>{item.title}</h4>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#71717A', marginTop: '0.25rem' }}>
                            Rs. {Number(item.price).toLocaleString()}
                          </p>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                          {/* Qty selectors */}
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', padding: '2px' }}>
                            <button onClick={() => handleQtyChange(item, item.quantity - 1)} style={{ background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex' }}>
                              <Minus size={12} />
                            </button>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0 8px' }}>{item.quantity}</span>
                            <button onClick={() => handleQtyChange(item, item.quantity + 1)} style={{ background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex' }}>
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Remove button */}
                          <button onClick={() => { playClick(); dispatch(removeFromCart(item.product)); }} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Bespoke Gift Wrapping Selection */}
                  <div style={{ border: '1px solid #E5E7EB', padding: '1rem', borderRadius: '0.5rem', background: '#F9FAFB', marginTop: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#09090B' }}>
                      <input type="checkbox" checked={addGiftWrap} onChange={toggleGiftWrap} style={{ width: '1rem', height: '1rem', accentColor: '#000000' }} />
                      Add Luxury Gift Wrapping {wrapUnlocked ? <span style={{ color: '#10B981', fontSize: '0.7rem' }}>(FREE)</span> : <span style={{ color: '#71717A', fontSize: '0.7rem' }}>(+Rs. 350)</span>}
                    </label>
                    <AnimatePresence>
                      {addGiftWrap && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginTop: '0.75rem' }}>
                          <textarea
                            placeholder="Write your premium gift card message here..."
                            value={giftNote}
                            onChange={e => setGiftNote(e.target.value)}
                            rows={3}
                            style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '0.5rem', fontSize: '0.75rem', color: '#09090B', outline: 'none', resize: 'none' }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid #E5E7EB', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#71717A' }}>Subtotal</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#09090B' }}>Rs. {prices.itemsPrice.toLocaleString()}</span>
                </div>
                {addGiftWrap && !wrapUnlocked && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#71717A' }}>Gift Wrapping</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#09090B' }}>Rs. 350</span>
                  </div>
                )}
                {prices.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#10B981' }}>
                    <span style={{ fontSize: '0.85rem' }}>Discount ({coupon?.code})</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>- Rs. {prices.discount.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800 }}>Total</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800 }}>
                    Rs. {(prices.totalPrice + (addGiftWrap && !wrapUnlocked ? 350 : 0)).toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button onClick={handleCheckout} style={{ width: '100%', padding: '1rem', background: '#000000', color: '#FFFFFF', border: 'none', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    Proceed to Checkout <ArrowRight size={14} />
                  </button>
                  <Link to="/cart" onClick={() => { playClick(); onClose(); }} style={{ width: '100%', padding: '0.85rem', background: '#FFFFFF', color: '#09090B', border: '1px solid #E5E7EB', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>
                    View Full Bag
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
