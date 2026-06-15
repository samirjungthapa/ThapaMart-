import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ArrowRight, Trash2, ShoppingBag } from 'lucide-react';
import { removeFromWishlist } from '../store/slices/wishlistSlice.js';
import { addToCart } from '../store/slices/cartSlice.js';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const handleRemove = (id) => { dispatch(removeFromWishlist(id)); };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product: product.id || product._id, title: product.title, price: product.price, image: product.images[0], stock: product.stock, quantity: 1 }));
    dispatch(removeFromWishlist(product.id || product._id));
  };

  return (
    <div style={{ padding:'3rem 0', minHeight:'100vh', background:'#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div style={{ marginBottom:'3rem', textAlign:'center' }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'3rem', fontWeight:900, color:'#09090B', letterSpacing:'-0.02em', marginBottom:'0.5rem' }}>
            Your Wishlist
          </h1>
          <div style={{ width:'2rem', height:'1px', background:'#09090B', margin:'0 auto' }} />
        </div>

        {wishlistItems.length === 0 ? (
          <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'5rem 2rem', textAlign:'center', maxWidth:'32rem', margin:'0 auto' }}>
            <div style={{ display:'inline-flex', padding:'1rem', background:'#FFFFFF', border:'1px solid #E5E7EB', borderRadius:'50%', marginBottom:'1.5rem' }}>
              <Heart size={24} style={{ color:'#09090B' }} />
            </div>
            <p style={{ fontSize:'1.125rem', fontWeight:700, color:'#09090B', marginBottom:'0.5rem' }}>Your wishlist is empty.</p>
            <p style={{ fontSize:'0.875rem', color:'#71717A', marginBottom:'2rem' }}>Save items you love and buy them later.</p>
            <Link to="/shop" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'1rem 2rem', background:'#000000', color:'#FFFFFF', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', textDecoration:'none' }}>
              Explore Products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id || item._id} style={{ background:'#FFFFFF', border:'1px solid #E5E7EB', padding:'1.25rem', display:'flex', flexDirection:'column' }}>
                <Link to={`/products/${item.id || item._id}`} style={{ display:'block', marginBottom:'1.25rem', aspectRatio:'4/5', background:'#F9FAFB' }}>
                  <img src={item.images[0]} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </Link>
                
                <div style={{ flexGrow:1, display:'flex', flexDirection:'column' }}>
                  <Link to={`/products/${item.id || item._id}`} style={{ fontSize:'1rem', fontWeight:700, color:'#09090B', textDecoration:'none', marginBottom:'0.5rem', display:'block' }}>
                    {item.title}
                  </Link>
                  <p style={{ fontSize:'1.125rem', fontWeight:900, color:'#09090B', marginBottom:'1.5rem' }}>
                    Rs. {Number(item.price).toLocaleString('en-NP')}
                  </p>
                  
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginTop:'auto', paddingTop:'1rem', borderTop:'1px solid #E5E7EB' }}>
                    <button onClick={()=>handleAddToCart(item)} style={{ flexGrow:1, display:'flex', alignItems:'center', justifyItems:'center', justifyContent:'center', gap:'0.5rem', padding:'0.75rem', background:'#000000', color:'#FFFFFF', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', border:'none', cursor:'pointer' }}>
                      <ShoppingBag size={14} /> Add
                    </button>
                    <button onClick={()=>handleRemove(item.id || item._id)} style={{ padding:'0.75rem', background:'#FFFFFF', border:'1px solid #E5E7EB', color:'#09090B', cursor:'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
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
