import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { addToCart } from '../store/slices/cartSlice.js';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice.js';
import { CompareContext } from '../App.jsx';

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareList, addToCompare, removeFromCompare } = useContext(CompareContext);

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const productId = product.id || product._id;
  const isWishlisted = wishlistItems.some((x) => x.id === productId || x._id === productId);
  const isCompared = compareList.some((x) => (x.id || x._id) === productId);

  const handleCartAdd = (e) => {
    e.preventDefault();
    dispatch(
      addToCart({
        product: productId,
        title: product.title,
        price: product.price,
        image: product.images[0],
        stock: product.stock,
        quantity: 1,
      })
    );
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleCompareToggle = (e) => {
    e.preventDefault();
    if (isCompared) {
      removeFromCompare(productId);
    } else {
      addToCompare(product);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setCoords({ x, y });
  };

  const rotateX = -(coords.y / rectHeightFactor(coords.y));
  const rotateY = coords.x / rectWidthFactor(coords.x);

  function rectHeightFactor() { return 25; }
  function rectWidthFactor() { return 25; }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCoords({ x: 0, y: 0 });
      }}
      style={{
        transformStyle: 'preserve-3d',
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="glass-card rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-shadow duration-300 relative group flex flex-col h-full"
    >
      
      {/* Product Image Link Container */}
      <Link to={`/products/${productId}`} className="block relative overflow-hidden aspect-square">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Out of Stock Label */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
              Out Of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Wishlist Button Trigger */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
          isWishlisted
            ? 'bg-red-500 text-white shadow-md'
            : 'bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
        }`}
        aria-label="Add to Wishlist"
      >
        <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Compare Button Trigger */}
      <button
        onClick={handleCompareToggle}
        className={`absolute top-4 left-4 px-2.5 py-1 rounded-lg backdrop-blur-md text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
          isCompared
            ? 'bg-primary text-white shadow-md'
            : 'bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
        }`}
      >
        {isCompared ? 'Comparing' : 'Compare'}
      </button>

      {/* Content Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-0.5 rounded-full bg-primary/10 dark:bg-accent/10 text-[9px] font-bold text-primary dark:text-accent uppercase tracking-wider">
            {product.category}
          </span>
          {/* Rating Stars Pill */}
          <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-bold">
            <FiStar className="w-3 h-3 fill-current" />
            <span>{product.ratings || '5.0'}</span>
          </div>
        </div>

        <Link to={`/products/${productId}`} className="block mb-2">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-accent transition-colors line-clamp-2 min-h-[40px] leading-snug">
            {product.title}
          </h3>
        </Link>
        
        {/* Short description preview for modern UI */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {product.description || "Premium quality merchandise meticulously selected for your sophisticated lifestyle."}
        </p>

        {/* Footer Actions / Pricing */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100/80 dark:border-slate-800/60">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Price</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              ${product.price}
            </span>
          </div>
          
          <button
            onClick={handleCartAdd}
            disabled={product.stock <= 0}
            className="flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:scale-105 disabled:from-slate-200 disabled:to-slate-300 dark:disabled:from-slate-800 dark:disabled:to-slate-900 disabled:text-slate-500 disabled:scale-100 disabled:cursor-not-allowed"
            aria-label="Add to Cart"
          >
            <FiShoppingCart className="w-4 h-4" />
          </button>
        </div>

      </div>

    </motion.div>
  );
};

export default ProductCard;
