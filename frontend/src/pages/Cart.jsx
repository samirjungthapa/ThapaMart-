import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, ArrowRight, X, Trash2 } from 'lucide-react';
import { addToCart, removeFromCart, applyCoupon, removeCoupon, calcPrices } from '../store/slices/cartSlice.js';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, coupon } = useSelector(s => s.cart);
  const { userInfo } = useSelector(s => s.auth);

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const prices = calcPrices({ cartItems, coupon });

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'THAPA10') { dispatch(applyCoupon({ code:'THAPA10', percent:10 })); setCouponCode(''); }
    else if (code === 'SMART20') { dispatch(applyCoupon({ code:'SMART20', percent:20 })); setCouponCode(''); }
    else { setCouponError('Invalid coupon code.'); }
  };

  return (
    <div style={{ padding:'3rem 0', minHeight:'100vh', background:'#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div style={{ marginBottom:'3rem', textAlign:'center' }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'3rem', fontWeight:900, color:'#09090B', letterSpacing:'-0.02em', marginBottom:'0.5rem' }}>
            Shopping Bag
          </h1>
          <div style={{ width:'2rem', height:'1px', background:'#09090B', margin:'0 auto' }} />
        </div>

        {cartItems.length === 0 ? (
          <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'5rem 2rem', textAlign:'center', maxWidth:'32rem', margin:'0 auto' }}>
            <div style={{ display:'inline-flex', padding:'1rem', background:'#FFFFFF', border:'1px solid #E5E7EB', borderRadius:'50%', marginBottom:'1.5rem' }}>
              <ShoppingBag size={24} style={{ color:'#09090B' }} />
            </div>
            <p style={{ fontSize:'1.125rem', fontWeight:700, color:'#09090B', marginBottom:'0.5rem' }}>Your shopping bag is empty.</p>
            <p style={{ fontSize:'0.875rem', color:'#71717A', marginBottom:'2rem' }}>Discover our premium collections.</p>
            <Link to="/shop" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'1rem 2rem', background:'#000000', color:'#FFFFFF', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', textDecoration:'none' }}>
              Start Shopping <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item.product} style={{ borderBottom:'1px solid #E5E7EB', paddingBottom:'1.5rem', display:'flex', flexWrap:'wrap', alignItems:'center', gap:'1.5rem', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', flexGrow:1 }}>
                    <Link to={`/products/${item.product}`}>
                      <img src={item.image} alt={item.title} style={{ width:'6rem', height:'8rem', objectFit:'cover', background:'#F9FAFB' }} />
                    </Link>
                    <div>
                      <Link to={`/products/${item.product}`} style={{ fontSize:'1rem', fontWeight:700, color:'#09090B', textDecoration:'none', marginBottom:'0.25rem', display:'block' }}>
                        {item.title}
                      </Link>
                      <p style={{ fontSize:'0.875rem', color:'#71717A' }}>Price: Rs. {Number(item.price).toLocaleString('en-NP')}</p>
                    </div>
                  </div>

                  <div style={{ display:'flex', alignItems:'center', gap:'2rem' }}>
                    <div>
                      <select value={item.quantity} onChange={e=>dispatch(addToCart({ ...item, quantity:Number(e.target.value) }))}
                        style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'0.5rem 1rem', color:'#09090B', fontSize:'0.875rem', outline:'none' }}>
                        {[...Array(item.stock || 10)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                      </select>
                    </div>
                    <div>
                      <span style={{ fontSize:'1rem', fontWeight:900, color:'#09090B' }}>Rs. {(item.price * item.quantity).toLocaleString('en-NP')}</span>
                    </div>
                    <button onClick={()=>dispatch(removeFromCart(item.product))} style={{ background:'transparent', border:'none', color:'#09090B', padding:'0.5rem', cursor:'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'2rem' }}>
                <h3 style={{ fontSize:'1rem', fontWeight:800, color:'#09090B', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1.5rem', paddingBottom:'1rem', borderBottom:'1px solid #E5E7EB' }}>
                  Order Summary
                </h3>

                <div style={{ display:'flex', flexDirection:'column', gap:'1rem', fontSize:'0.875rem', color:'#52525B' }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span>Subtotal</span>
                    <span style={{ color:'#09090B', fontWeight:700 }}>Rs. {prices.itemsPrice}</span>
                  </div>
                  {coupon && (
                    <div style={{ display:'flex', justifyContent:'space-between', color:'#10B981' }}>
                      <span>Discount ({coupon.code})</span>
                      <span style={{ fontWeight:700 }}>-Rs. {prices.discount}</span>
                    </div>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span>Estimated Shipping</span>
                    <span style={{ color:'#09090B', fontWeight:700 }}>{prices.shippingPrice === 0 ? 'Free' : `Rs. ${prices.shippingPrice}`}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span>Sales Tax</span>
                    <span style={{ color:'#09090B', fontWeight:700 }}>Rs. {prices.taxPrice}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:'0.5rem', paddingTop:'1rem', borderTop:'1px solid #E5E7EB', fontSize:'1.25rem', color:'#09090B', fontWeight:900 }}>
                    <span>Total</span>
                    <span>Rs. {prices.totalPrice}</span>
                  </div>
                </div>

                <button onClick={() => navigate(userInfo ? '/checkout' : '/login?redirect=/checkout')}
                  style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', padding:'1rem', background:'#000000', color:'#FFFFFF', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', border:'none', marginTop:'2rem', cursor:'pointer' }}>
                  Checkout <ArrowRight size={14} />
                </button>
              </div>

              {/* Coupons */}
              <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'1.5rem' }}>
                <h4 style={{ fontSize:'0.75rem', fontWeight:800, color:'#09090B', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1rem' }}>
                  Promo Code
                </h4>
                {coupon ? (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.75rem 1rem', background:'#FFFFFF', border:'1px solid #E5E7EB', fontSize:'0.875rem', color:'#09090B', fontWeight:700 }}>
                    <span>{coupon.code} Applied</span>
                    <button onClick={()=>dispatch(removeCoupon())} style={{ background:'transparent', border:'none', cursor:'pointer' }}><X size={16} /></button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={handleApplyCoupon} style={{ display:'flex' }}>
                      <input type="text" placeholder="Enter code" value={couponCode} onChange={e=>setCouponCode(e.target.value)}
                        style={{ flexGrow:1, background:'#FFFFFF', border:'1px solid #E5E7EB', padding:'0.75rem 1rem', color:'#09090B', fontSize:'0.875rem', outline:'none', textTransform:'uppercase' }} />
                      <button type="submit" style={{ background:'#09090B', border:'none', padding:'0 1.5rem', color:'#FFFFFF', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', cursor:'pointer' }}>Apply</button>
                    </form>
                    {couponError && <p style={{ fontSize:'0.75rem', color:'#EF4444', marginTop:'0.5rem' }}>{couponError}</p>}
                  </div>
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
