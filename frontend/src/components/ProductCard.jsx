import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { addToCart, removeFromCart } from '../store/slices/cartSlice.js';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice.js';
import QuickViewModal from './QuickViewModal.jsx';
import { playClick, playSuccess } from '../utils/audio.js';
import { CompareContext } from '../App.jsx';

const ProductCard = ({ product, index = 0, layoutMode = 'grid' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const isWishlisted = wishlistItems.find((i) => (i.id || i._id) === (product.id || product._id));
  const cartItem = cartItems.find((i) => i.product === (product.id || product._id));
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  // Comparison context
  const compareContext = useContext(CompareContext);
  const compareList = compareContext ? compareContext.compareList : [];
  const addToCompare = compareContext ? compareContext.addToCompare : () => {};
  const removeFromCompare = compareContext ? compareContext.removeFromCompare : () => {};
  const isCompared = compareList.some((item) => (item.id || item._id) === (product.id || product._id));

  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    playSuccess();
    if (!userInfo) {
      navigate(`/login?redirect=${location.pathname}`);
      return;
    }
    dispatch(addToCart({
      product: product.id || product._id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      stock: product.stock,
      quantity: 1,
    }));
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    playSuccess();
    if (qtyInCart >= product.stock) return;
    dispatch(addToCart({
      ...cartItem,
      quantity: qtyInCart + 1
    }));
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    playClick();
    if (qtyInCart === 1) {
      dispatch(removeFromCart(product.id || product._id));
    } else {
      dispatch(addToCart({
        ...cartItem,
        quantity: qtyInCart - 1
      }));
    }
  };

  const handleCompareChange = (e) => {
    if (e.target.checked) {
      addToCompare(product);
    } else {
      removeFromCompare(product.id || product._id);
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    playClick();
    if (!userInfo) {
      navigate(`/login?redirect=${location.pathname}`);
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id || product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const renderStars = (rating = 4.5) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} size={11} style={{ fill: '#DE7921', color: '#DE7921' }} />);
      } else if (i === floor + 1 && rating % 1 !== 0) {
        stars.push(<Star key={i} size={11} style={{ fill: '#DE7921', color: '#DE7921', opacity: 0.5 }} />);
      } else {
        stars.push(<Star key={i} size={11} style={{ color: '#E5E7EB' }} />);
      }
    }
    return stars;
  };

  // Mock list price for retail strikethrough comparison
  const listPrice = Number(product.price * 1.25);
  const discountPercent = 20;

  // Mock sales volume for Amazon context
  const mockSalesCount = (index * 100 + 50) % 800 + 100;

  const renderRatingsBlock = () => {
    return (
      <div 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap', cursor: 'pointer', zIndex: 30 }}
      >
        <div style={{ display: 'flex', gap: '0.05rem' }}>{renderStars(product.ratings)}</div>
        <span style={{ fontSize: '0.75rem', color: '#007185' }} className="hover:underline">
          {mockSalesCount}
        </span>
        <span style={{ fontSize: '0.7rem', color: '#565959', marginLeft: '0.25rem' }}>
          {mockSalesCount}+ bought in past month
        </span>

        {/* Ratings Popover Tooltip */}
        {showTooltip && (
          <div style={{
            position: 'absolute',
            top: '1.25rem',
            left: '0',
            width: '240px',
            background: '#FFFFFF',
            border: '1px solid #D5D9D9',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 90,
            cursor: 'default'
          }}
          onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.05rem' }}>{renderStars(product.ratings)}</div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F1111' }}>{product.ratings || 4.5} out of 5</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#565959', marginBottom: '0.75rem' }}>
              {mockSalesCount} global ratings
            </div>
            
            {/* Histogram Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { stars: 5, pct: 70 },
                { stars: 4, pct: 18 },
                { stars: 3, pct: 7 },
                { stars: 2, pct: 3 },
                { stars: 1, pct: 2 }
              ].map(item => (
                <div key={item.stars} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                  <span style={{ width: '35px', color: '#007185', whiteSpace: 'nowrap' }} className="hover:underline">{item.stars} star</span>
                  <div style={{ flexGrow: 1, height: '16px', background: '#F0F2F2', borderRadius: '4px', overflow: 'hidden', border: '1px solid #D5D9D9' }}>
                    <div style={{ width: `${item.pct}%`, height: '100%', background: '#DE7921' }} />
                  </div>
                  <span style={{ width: '25px', textAlign: 'right', color: '#007185' }} className="hover:underline">{item.pct}%</span>
                </div>
              ))}
            </div>
            
            <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '0.75rem', paddingTop: '0.75rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#007185', fontWeight: 500 }} className="hover:underline">
                See all customer reviews
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (layoutMode === 'list') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, delay: index * 0.03 }}
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          background: '#FFFFFF', 
          border: '1px solid #E5E7EB', 
          borderRadius: '8px',
          overflow: 'visible',
          boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.25s ease',
          width: '100%'
        }}
      >
        {/* Left: Product Image Slider */}
        <div style={{ position: 'relative', width: '220px', minWidth: '150px', aspectRatio: '1/1', overflow: 'hidden', background: '#F7F7F7', flexShrink: 0, borderRadius: '8px 0 0 8px' }}>
          <Link to={`/products/${product.id || product._id}`} onClick={playClick} style={{ display: 'block', width: '100%', height: '100%', padding: '1rem' }}>
            <img src={product.images[activeImgIdx] || product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.5s ease', transform: isHovered ? 'scale(1.02)' : 'scale(1)' }} />
          </Link>
          
          {product.images && product.images.length > 1 && isHovered && (
            <>
              <button 
                onClick={handlePrevImage} 
                style={{ position: 'absolute', top: '50%', left: '0.5rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: '1px solid #D5D9D9', borderRadius: '50%', width: '1.75rem', height: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 11, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
              >
                <ChevronLeft size={14} style={{ color: '#0F1111' }} />
              </button>
              <button 
                onClick={handleNextImage} 
                style={{ position: 'absolute', top: '50%', right: '0.5rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: '1px solid #D5D9D9', borderRadius: '50%', width: '1.75rem', height: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 11, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
              >
                <ChevronRight size={14} style={{ color: '#0F1111' }} />
              </button>
              <div style={{ position: 'absolute', bottom: '0.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.25rem', zIndex: 11 }}>
                {product.images.map((_, idx) => (
                  <div key={idx} style={{ width: '5px', height: '5px', borderRadius: '50%', background: idx === activeImgIdx ? '#E47911' : 'rgba(0,0,0,0.3)' }} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Product Details */}
        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.35rem', justifyContent: 'space-between' }}>
          <div>
            {/* Top Badges */}
            <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              {index % 3 === 0 && (
                <span style={{ padding: '0.2rem 0.4rem', background: '#E47911', color: '#FFFFFF', fontSize: '0.55rem', fontWeight: 700, borderRadius: '2px', textTransform: 'uppercase' }}>Best Seller</span>
              )}
              {index % 3 === 1 && (
                <span style={{ padding: '0.2rem 0.4rem', background: '#002F36', color: '#FFFFFF', fontSize: '0.55rem', fontWeight: 700, borderRadius: '2px', textTransform: 'uppercase' }}>Thapa's Choice</span>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <span style={{ padding: '0.2rem 0.4rem', background: '#CC0C39', color: '#FFFFFF', fontSize: '0.55rem', fontWeight: 700, borderRadius: '2px', textTransform: 'uppercase' }}>Only {product.stock} left</span>
              )}
              {product.stock === 0 && (
                <span style={{ padding: '0.2rem 0.4rem', background: '#565959', color: '#FFFFFF', fontSize: '0.55rem', fontWeight: 700, borderRadius: '2px', textTransform: 'uppercase' }}>Out of Stock</span>
              )}
            </div>

            {/* Title */}
            <Link to={`/products/${product.id || product._id}`} onClick={playClick} style={{ textDecoration: 'none' }}>
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: 500, 
                color: '#0F1111', 
                margin: 0, 
                lineHeight: 1.3,
              }}>
                {product.title}
              </h3>
            </Link>

            {/* Ratings block */}
            <div style={{ marginTop: '0.25rem' }}>{renderRatingsBlock()}</div>

            {/* Prime Badge & Shipping Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
              <span style={{ background: '#00A8E1', color: '#FFFFFF', fontSize: '0.55rem', fontWeight: 900, padding: '0.1rem 0.25rem', borderRadius: '3px', fontStyle: 'italic' }}>PRIME</span>
              <span style={{ fontSize: '0.7rem', color: '#565959' }}>FREE Delivery Tomorrow</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
            <div>
              {/* Price and Deal comparisons */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#CC0C39', fontWeight: 500 }}>-{discountPercent}%</span>
                <div style={{ display: 'flex', color: '#0F1111' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, alignSelf: 'flex-start', marginTop: '0.1rem' }}>Rs.</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{Math.floor(product.price).toLocaleString('en-NP')}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, alignSelf: 'flex-start' }}>.{(product.price % 1 * 100).toFixed(0).padStart(2, '0')}</span>
                </div>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#565959', marginTop: '0.1rem' }}>
                Typical: <span style={{ textDecoration: 'line-through' }}>Rs. {Math.round(listPrice).toLocaleString('en-NP')}</span>
              </div>
              
              {/* Compare Toggle */}
              <div style={{ marginTop: '0.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.75rem', color: '#565959' }}>
                  <input 
                    type="checkbox" 
                    checked={isCompared} 
                    onChange={handleCompareChange} 
                    style={{ accentColor: '#E47911', width: '0.9rem', height: '0.9rem' }} 
                  />
                  <span>Compare</span>
                </label>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', minWidth: '240px' }}>
              {qtyInCart > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #D5D9D9', borderRadius: '100px', background: '#F0F2F2', padding: '0.2rem', flexGrow: 1, boxShadow: '0 2px 5px 0 rgba(213,217,217,.3)' }}>
                  <button onClick={handleDecrement} style={{ border: 'none', background: 'transparent', width: '1.75rem', height: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold', color: '#0F1111', cursor: 'pointer' }}>-</button>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F1111' }}>{qtyInCart} in Cart</span>
                  <button onClick={handleIncrement} disabled={qtyInCart >= product.stock} style={{ border: 'none', background: 'transparent', width: '1.75rem', height: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold', color: qtyInCart >= product.stock ? '#D5D9D9' : '#0F1111', cursor: qtyInCart >= product.stock ? 'not-allowed' : 'pointer' }}>+</button>
                </div>
              ) : (
                <button 
                  onClick={handleAddToCart} 
                  disabled={product.stock === 0}
                  style={{ 
                    flexGrow: 1,
                    padding: '0.5rem 1rem', 
                    background: product.stock === 0 ? '#F0F2F2' : '#FFD814', 
                    color: '#0F1111', 
                    fontSize: '0.75rem', 
                    fontWeight: 500, 
                    borderRadius: '100px',
                    border: product.stock === 0 ? '1px solid #E0E2E2' : '1px solid #FCD200', 
                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 5px 0 rgba(213,217,217,.5)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={e => { if (product.stock > 0) e.currentTarget.style.background = '#F7CA00'; }}
                  onMouseLeave={e => { if (product.stock > 0) e.currentTarget.style.background = '#FFD814'; }}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              )}
              
              <button onClick={toggleWishlist} style={{ background: '#FFFFFF', border: '1px solid #D5D9D9', borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Heart size={13} style={{ fill: isWishlisted ? '#CC0C39' : 'transparent', color: isWishlisted ? '#CC0C39' : '#0F1111' }} />
              </button>

              <button onClick={(e) => { e.preventDefault(); playClick(); setQuickViewOpen(true); }} style={{ background: '#FFFFFF', border: '1px solid #D5D9D9', borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }} title="Quick View">
                <Eye size={13} style={{ color: '#0F1111' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick View Modal */}
        <QuickViewModal product={product} isOpen={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, delay: index * 0.03 }}
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        background: '#FFFFFF', 
        border: '1px solid #E5E7EB', 
        borderRadius: '8px',
        overflow: 'visible',
        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.25s ease' 
      }}
    >
      
      {/* Top Badges */}
      <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', zIndex: 10 }}>
        {index % 3 === 0 && (
          <span style={{ padding: '0.2rem 0.4rem', background: '#E47911', color: '#FFFFFF', fontSize: '0.55rem', fontWeight: 700, borderRadius: '2px', textTransform: 'uppercase' }}>Best Seller</span>
        )}
        {index % 3 === 1 && (
          <span style={{ padding: '0.2rem 0.4rem', background: '#002F36', color: '#FFFFFF', fontSize: '0.55rem', fontWeight: 700, borderRadius: '2px', textTransform: 'uppercase' }}>Thapa's Choice</span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span style={{ padding: '0.2rem 0.4rem', background: '#CC0C39', color: '#FFFFFF', fontSize: '0.55rem', fontWeight: 700, borderRadius: '2px', textTransform: 'uppercase' }}>Only {product.stock} left</span>
        )}
        {product.stock === 0 && (
          <span style={{ padding: '0.2rem 0.4rem', background: '#565959', color: '#FFFFFF', fontSize: '0.55rem', fontWeight: 700, borderRadius: '2px', textTransform: 'uppercase' }}>Temporarily Out of Stock</span>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', zIndex: 10, opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease' }}>
        <button onClick={toggleWishlist} style={{ background: '#FFFFFF', border: '1px solid #D5D9D9', borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', transition: 'transform 0.1s' }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
          <Heart size={13} style={{ fill: isWishlisted ? '#CC0C39' : 'transparent', color: isWishlisted ? '#CC0C39' : '#0F1111' }} />
        </button>
        <button onClick={(e) => { e.preventDefault(); playClick(); setQuickViewOpen(true); }} style={{ background: '#FFFFFF', border: '1px solid #D5D9D9', borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', transition: 'transform 0.1s' }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'} title="Quick View">
          <Eye size={13} style={{ color: '#0F1111' }} />
        </button>
      </div>

      {/* Product Image Slider */}
      <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#F7F7F7', borderRadius: '8px 8px 0 0' }}>
        <Link to={`/products/${product.id || product._id}`} onClick={playClick} style={{ display: 'block', width: '100%', height: '100%', padding: '1rem' }}>
          <img src={product.images[activeImgIdx] || product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.5s ease', transform: isHovered ? 'scale(1.02)' : 'scale(1)' }} />
        </Link>
        
        {product.images && product.images.length > 1 && isHovered && (
          <>
            <button 
              onClick={handlePrevImage} 
              style={{ position: 'absolute', top: '50%', left: '0.5rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: '1px solid #D5D9D9', borderRadius: '50%', width: '1.75rem', height: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 11, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
            >
              <ChevronLeft size={14} style={{ color: '#0F1111' }} />
            </button>
            <button 
              onClick={handleNextImage} 
              style={{ position: 'absolute', top: '50%', right: '0.5rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: '1px solid #D5D9D9', borderRadius: '50%', width: '1.75rem', height: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 11, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
            >
              <ChevronRight size={14} style={{ color: '#0F1111' }} />
            </button>
            <div style={{ position: 'absolute', bottom: '0.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.25rem', zIndex: 11 }}>
              {product.images.map((_, idx) => (
                <div key={idx} style={{ width: '5px', height: '5px', borderRadius: '50%', background: idx === activeImgIdx ? '#E47911' : 'rgba(0,0,0,0.3)' }} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Content (Amazon Listing Aesthetic) */}
      <div style={{ padding: '0.75rem 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.4rem' }}>
        
        {/* Title */}
        <Link to={`/products/${product.id || product._id}`} onClick={playClick} style={{ textDecoration: 'none' }}>
          <h3 style={{ 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            color: '#0F1111', 
            margin: 0, 
            lineHeight: 1.3,
            height: '2.6rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.title}
          </h3>
        </Link>

        {/* Ratings block */}
        <div>{renderRatingsBlock()}</div>

        {/* Prime Badge & Shipping Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ background: '#00A8E1', color: '#FFFFFF', fontSize: '0.55rem', fontWeight: 900, padding: '0.1rem 0.25rem', borderRadius: '3px', fontStyle: 'italic' }}>PRIME</span>
          <span style={{ fontSize: '0.7rem', color: '#565959' }}>FREE Delivery Tomorrow</span>
        </div>

        {/* Price and Deal comparisons */}
        <div style={{ marginTop: 'auto', paddingTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#CC0C39', fontWeight: 500 }}>-{discountPercent}%</span>
            <div style={{ display: 'flex', color: '#0F1111' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, alignSelf: 'flex-start', marginTop: '0.1rem' }}>Rs.</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}>{Math.floor(product.price).toLocaleString('en-NP')}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, alignSelf: 'flex-start' }}>.{(product.price % 1 * 100).toFixed(0).padStart(2, '0')}</span>
            </div>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#565959', marginTop: '0.1rem' }}>
            Typical: <span style={{ textDecoration: 'line-through' }}>Rs. {Math.round(listPrice).toLocaleString('en-NP')}</span>
          </div>
        </div>

        {/* Compare & Subscribe block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.7rem', color: '#565959' }}>
            <input 
              type="checkbox" 
              checked={isCompared} 
              onChange={handleCompareChange} 
              style={{ accentColor: '#E47911', width: '0.8rem', height: '0.8rem' }} 
            />
            <span>Compare</span>
          </label>
          <span style={{ fontSize: '0.7rem', color: '#007185' }}>Save 10% with Subscribe</span>
        </div>

        {/* Add to Cart / Qty Manager Button */}
        {qtyInCart > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #D5D9D9', borderRadius: '100px', background: '#F0F2F2', padding: '0.2rem', marginTop: '0.5rem', width: '100%', boxShadow: '0 2px 5px 0 rgba(213,217,217,.3)' }}>
            <button onClick={handleDecrement} style={{ border: 'none', background: 'transparent', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: '#0F1111', cursor: 'pointer' }}>-</button>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F1111' }}>{qtyInCart} in Cart</span>
            <button onClick={handleIncrement} disabled={qtyInCart >= product.stock} style={{ border: 'none', background: 'transparent', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: qtyInCart >= product.stock ? '#D5D9D9' : '#0F1111', cursor: qtyInCart >= product.stock ? 'not-allowed' : 'pointer' }}>+</button>
          </div>
        ) : (
          <button 
            onClick={handleAddToCart} 
            disabled={product.stock === 0}
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              background: product.stock === 0 ? '#F0F2F2' : '#FFD814', 
              color: '#0F1111', 
              fontSize: '0.75rem', 
              fontWeight: 500, 
              borderRadius: '100px',
              border: product.stock === 0 ? '1px solid #E0E2E2' : '1px solid #FCD200', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 5px 0 rgba(213,217,217,.5)',
              marginTop: '0.5rem',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={e => { if (product.stock > 0) e.currentTarget.style.background = '#F7CA00'; }}
            onMouseLeave={e => { if (product.stock > 0) e.currentTarget.style.background = '#FFD814'; }}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}

      </div>

      {/* Quick View Modal */}
      <QuickViewModal product={product} isOpen={quickViewOpen} onClose={() => setQuickViewOpen(false)} />

    </motion.div>
  );
};

export default ProductCard;
