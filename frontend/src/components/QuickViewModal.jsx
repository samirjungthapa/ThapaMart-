import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice.js';
import { addToWishlist } from '../store/slices/wishlistSlice.js';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!userInfo) {
      navigate(`/login?redirect=${location.pathname}`);
      return;
    }
    dispatch(
      addToCart({
        product: product.id || product._id,
        title: product.title,
        price: product.price,
        image: product.images[activeImageIdx] || product.images[0],
        stock: product.stock,
        quantity: Number(quantity),
      })
    );
    onClose();
  };

  const handleAddToWishlist = () => {
    if (!userInfo) {
      navigate(`/login?redirect=${location.pathname}`);
      return;
    }
    dispatch(addToWishlist(product));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              background: '#FFFFFF',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
              overflowY: 'auto',
              zIndex: 301,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#F3F4F6',
                border: 'none',
                borderRadius: '50%',
                width: '2.5rem',
                height: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
              {/* Product Images Gallery */}
              <div>
                <div style={{ aspectRatio: '4/5', background: '#F9FAFB', overflow: 'hidden', border: '1px solid #E5E7EB', borderRadius: '0.5rem' }}>
                  <img
                    src={product.images[activeImageIdx] || product.images[0]}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        style={{
                          width: '50px',
                          height: '60px',
                          border: activeImageIdx === idx ? '2px solid #000000' : '1px solid #E5E7EB',
                          padding: 0,
                          cursor: 'pointer',
                          background: '#F9FAFB',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 800, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>
                    {product.category}
                  </span>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#09090B', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                    {product.title}
                  </h2>
                </div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', color: '#D4AF37' }}>
                    <Star size={14} style={{ fill: '#D4AF37' }} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{product.ratings || '5.0'}</span>
                  <span style={{ color: '#E5E7EB' }}>|</span>
                  <span style={{ fontSize: '0.75rem', color: '#71717A' }}>{product.reviews?.length || 0} reviews</span>
                </div>

                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#09090B' }}>
                  Rs. {Number(product.price).toLocaleString()}
                </div>

                <p style={{ fontSize: '0.8rem', color: '#52525B', lineHeight: 1.6 }}>
                  {product.description}
                </p>

                {/* Stock Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: '1rem 0' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#09090B', textTransform: 'uppercase' }}>Availability:</span>
                  {product.stock > 0 ? (
                    <span style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 700 }}>In Stock ({product.stock} left)</span>
                  ) : (
                    <span style={{ color: '#EF4444', fontSize: '0.75rem', fontWeight: 700 }}>Out of Stock</span>
                  )}
                </div>

                {product.stock > 0 && (
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {/* Quantity Picker */}
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      style={{
                        background: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        padding: '0.75rem',
                        fontSize: '0.85rem',
                        outline: 'none',
                        cursor: 'pointer',
                        width: '4rem',
                      }}
                    >
                      {[...Array(Math.min(product.stock, 8))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleAddToCart}
                      style={{
                        flexGrow: 1,
                        background: '#000000',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <ShoppingBag size={14} /> Add to Bag
                    </button>

                    <button
                      onClick={handleAddToWishlist}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Heart size={16} />
                    </button>
                  </div>
                )}

                {/* Additional details */}
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                  {[
                    { Icon: ShieldCheck, text: 'Genuine' },
                    { Icon: RefreshCw, text: 'Returns' },
                    { Icon: Truck, text: 'Fast Delivery' },
                  ].map(({ Icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Icon size={14} />
                      <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', color: '#71717A' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
