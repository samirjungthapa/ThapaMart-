import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice.js';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice.js';

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.find((i) => (i.id || i._id) === (product.id || product._id));

  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      product: product.id || product._id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      stock: product.stock,
      quantity: 1,
    }));
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id || product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', background: '#FFFFFF', border: '1px solid #E5E7EB', transition: 'all 0.3s ease' }}
    >
      
      {/* Badges */}
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', right: '1rem', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        {product.stock <= 5 && product.stock > 0 && (
          <span style={{ padding: '0.25rem 0.5rem', background: '#EF4444', color: '#FFFFFF', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Low Stock</span>
        )}
        {product.stock === 0 && (
          <span style={{ padding: '0.25rem 0.5rem', background: '#09090B', color: '#FFFFFF', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sold Out</span>
        )}
        
        <button onClick={toggleWishlist} style={{ marginLeft: 'auto', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
          <Heart size={14} style={{ fill: isWishlisted ? '#09090B' : 'transparent', color: isWishlisted ? '#09090B' : '#09090B' }} />
        </button>
      </div>

      {/* Image */}
      <Link to={`/products/${product.id || product._id}`} style={{ display: 'block', position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: '#F9FAFB' }}>
        <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease', transform: isHovered ? 'scale(1.05)' : 'scale(1)' }} />
      </Link>

      {/* Info */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#71717A' }}>
            {product.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Star size={12} style={{ fill: '#D4AF37', color: '#D4AF37' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#52525B' }}>{product.ratings || '5.0'}</span>
          </div>
        </div>

        <Link to={`/products/${product.id || product._id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#09090B', marginBottom: '0.5rem', lineHeight: 1.4 }}>
            {product.title}
          </h3>
        </Link>
        
        <p style={{ fontSize: '0.875rem', fontWeight: 900, color: '#09090B', marginTop: 'auto' }}>
          Rs. {Number(product.price).toLocaleString('en-NP')}
        </p>
      </div>

      {/* Add to cart - Slides up on hover */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, transform: isHovered ? 'translateY(0)' : 'translateY(10px)', opacity: isHovered ? 1 : 0, transition: 'all 0.3s ease', padding: '0 1.25rem 1.25rem' }}>
        <button 
          onClick={handleAddToCart} disabled={product.stock === 0}
          style={{ width: '100%', padding: '0.875rem', background: '#000000', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}
        >
          <ShoppingBag size={14} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
        </button>
      </div>

    </motion.div>
  );
};
export default ProductCard;
