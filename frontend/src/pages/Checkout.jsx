import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, calcPrices } from '../store/slices/cartSlice.js';
import api from '../store/api.js';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems, coupon } = useSelector((state) => state.cart);

  const prices = calcPrices({ cartItems, coupon });

  useEffect(() => {
    if (!userInfo) navigate('/login?redirect=/checkout');
    if (cartItems.length === 0) navigate('/cart');
  }, [userInfo, cartItems, navigate]);

  const [shippingAddress, setShippingAddress] = useState({ address:'', city:'', postalCode:'', country:'Nepal' });
  const [paymentMethod, setPaymentMethod] = useState('eSewa');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const orderData = {
      orderItems: cartItems.map(item => ({ name: item.title, qty: item.quantity, image: item.image, price: item.price, product: item.product })),
      shippingAddress,
      paymentMethod,
      itemsPrice: prices.itemsPrice,
      taxPrice: prices.taxPrice,
      shippingPrice: prices.shippingPrice,
      totalPrice: prices.totalPrice,
    };

    try {
      const { data } = await api.post('/orders', orderData);
      dispatch(clearCart());
      if (paymentMethod === 'Cash On Delivery') {
        navigate('/order-success?id=' + data._id);
      } else {
        alert(`Proceeding to ${paymentMethod} payment gateway...`);
        navigate('/order-success?id=' + data._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding:'3rem 0', minHeight:'100vh', background:'#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div style={{ marginBottom:'3rem', textAlign:'center' }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'3rem', fontWeight:900, color:'#09090B', letterSpacing:'-0.02em', marginBottom:'0.5rem' }}>
            Checkout
          </h1>
          <div style={{ width:'2rem', height:'1px', background:'#09090B', margin:'0 auto' }} />
        </div>

        {error && <div style={{ padding:'1rem', background:'#FEF2F2', border:'1px solid #FECACA', color:'#DC2626', marginBottom:'2rem', textAlign:'center' }}>{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Form */}
          <div>
            <form id="checkout-form" onSubmit={submitHandler} style={{ display:'flex', flexDirection:'column', gap:'3rem' }}>
              
              <div>
                <h2 style={{ fontSize:'1.125rem', fontWeight:800, color:'#09090B', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1.5rem', borderBottom:'1px solid #09090B', paddingBottom:'0.5rem' }}>
                  Shipping Information
                </h2>

                <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                  <div>
                    <label style={{ display:'block', fontSize:'0.75rem', fontWeight:700, color:'#71717A', marginBottom:'0.5rem' }}>Street Address</label>
                    <input type="text" required value={shippingAddress.address} onChange={e=>setShippingAddress({...shippingAddress, address:e.target.value})} style={{ width:'100%', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'0.875rem 1rem', color:'#09090B', fontSize:'0.875rem', outline:'none' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={{ display:'block', fontSize:'0.75rem', fontWeight:700, color:'#71717A', marginBottom:'0.5rem' }}>City</label>
                      <input type="text" required value={shippingAddress.city} onChange={e=>setShippingAddress({...shippingAddress, city:e.target.value})} style={{ width:'100%', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'0.875rem 1rem', color:'#09090B', fontSize:'0.875rem', outline:'none' }} />
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:'0.75rem', fontWeight:700, color:'#71717A', marginBottom:'0.5rem' }}>Postal Code</label>
                      <input type="text" required value={shippingAddress.postalCode} onChange={e=>setShippingAddress({...shippingAddress, postalCode:e.target.value})} style={{ width:'100%', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'0.875rem 1rem', color:'#09090B', fontSize:'0.875rem', outline:'none' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:'0.75rem', fontWeight:700, color:'#71717A', marginBottom:'0.5rem' }}>Country</label>
                    <input type="text" required value={shippingAddress.country} onChange={e=>setShippingAddress({...shippingAddress, country:e.target.value})} style={{ width:'100%', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'0.875rem 1rem', color:'#09090B', fontSize:'0.875rem', outline:'none' }} />
                  </div>
                </div>
              </div>

              <div>
                <h2 style={{ fontSize:'1.125rem', fontWeight:800, color:'#09090B', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1.5rem', borderBottom:'1px solid #09090B', paddingBottom:'0.5rem' }}>
                  Payment Method
                </h2>

                <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  {['eSewa', 'Khalti', 'IME Pay', 'Cash On Delivery'].map(method => (
                    <label key={method} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1rem', border:`1px solid ${paymentMethod===method ? '#09090B' : '#E5E7EB'}`, background: paymentMethod===method ? '#F9FAFB' : '#FFFFFF', cursor:'pointer' }}>
                      <input type="radio" name="paymentMethod" value={method} checked={paymentMethod===method} onChange={e=>setPaymentMethod(e.target.value)} style={{ accentColor:'#000000' }} />
                      <span style={{ fontSize:'0.875rem', fontWeight:700, color:'#09090B' }}>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

            </form>
          </div>

          {/* Order Summary */}
          <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'2.5rem' }}>
            <h2 style={{ fontSize:'1.125rem', fontWeight:800, color:'#09090B', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'2rem' }}>
              Your Order
            </h2>

            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem', marginBottom:'2rem' }}>
              {cartItems.map(item => (
                <div key={item.product} style={{ display:'flex', gap:'1rem' }}>
                  <img src={item.image} alt={item.title} style={{ width:'4rem', height:'5rem', objectFit:'cover', background:'#FFFFFF' }} />
                  <div style={{ flexGrow:1, display:'flex', flexDirection:'column' }}>
                    <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#09090B' }}>{item.title}</div>
                    <div style={{ fontSize:'0.75rem', color:'#71717A' }}>Qty: {item.quantity}</div>
                    <div style={{ fontSize:'0.875rem', fontWeight:900, color:'#09090B', marginTop:'auto' }}>Rs. {(item.price*item.quantity).toLocaleString('en-NP')}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'1rem', fontSize:'0.875rem', color:'#52525B', borderTop:'1px solid #E5E7EB', paddingTop:'2rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color:'#09090B', fontWeight:700 }}>Rs. {prices.itemsPrice}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span>Estimated Shipping</span>
                <span style={{ color:'#09090B', fontWeight:700 }}>{prices.shippingPrice === 0 ? 'Free' : `Rs. ${prices.shippingPrice}`}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span>Sales Tax</span>
                <span style={{ color:'#09090B', fontWeight:700 }}>Rs. {prices.taxPrice}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid #09090B', fontSize:'1.5rem', color:'#09090B', fontWeight:900 }}>
                <span>Total</span>
                <span>Rs. {prices.totalPrice}</span>
              </div>
            </div>

            <button type="submit" form="checkout-form" disabled={loading} style={{ width:'100%', padding:'1rem', background:'#000000', color:'#FFFFFF', fontSize:'0.875rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', border:'none', cursor:'pointer', marginTop:'2.5rem' }}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Checkout;
