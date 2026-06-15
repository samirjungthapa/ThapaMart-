import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice.js';
import { addToWishlist } from '../store/slices/wishlistSlice.js';
import api from '../store/api.js';
import ProductCard from '../components/ProductCard.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const [deliveryRegion, setDeliveryRegion] = useState('inside-ringroad');
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchProductDetails = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      if (data && data.category) {
        const relatedRes = await api.get('/products', { params: { category: data.category, limit: 4 } });
        const list = (relatedRes.data.products || []).filter(p => (p.id || p._id) !== (data.id || data._id));
        setRelatedProducts(list.slice(0, 4));
      }
    } catch (err) {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    setQuantity(1);
    setReviewSuccess(false);
    setReviewError('');
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product: product.id || product._id, title: product.title, price: product.price, image: product.images[0], stock: product.stock, quantity: Number(quantity) }));
    navigate('/cart');
  };

  const handleAddToWishlist = () => { dispatch(addToWishlist(product)); };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    try {
      await api.post(`/products/${product.id || product._id}/reviews`, { rating, comment });
      setReviewSuccess(true);
      setComment('');
      fetchProductDetails(); 
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const getDeliveryInfo = () => {
    if (deliveryRegion === 'inside-ringroad') return { cost: 100, time: 'Same day or next day' };
    if (deliveryRegion === 'outside-ringroad') return { cost: 150, time: '1 to 2 business days' };
    return { cost: 250, time: '2 to 4 business days' };
  };

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', background:'#FFFFFF' }}>
        <div style={{ width:'3rem', height:'3rem', borderRadius:'50%', border:'2px solid #E5E7EB', borderTopColor:'#09090B', animation:'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign:'center', padding:'5rem 2rem', minHeight:'60vh', background:'#FFFFFF' }}>
        <p style={{ color:'#71717A', marginBottom:'1rem' }}>Product not found.</p>
        <Link to="/shop" style={{ color:'#09090B', textDecoration:'none', fontWeight:700, borderBottom:'1px solid #09090B' }}>Back to shop</Link>
      </div>
    );
  }

  const delivery = getDeliveryInfo();

  return (
    <div style={{ padding:'3rem 0', minHeight:'100vh', background:'#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
          
          {/* Images */}
          <div style={{ position:'sticky', top:'5rem' }}>
            <div style={{ aspectRatio:'4/5', background:'#F9FAFB', overflow:'hidden', border:'1px solid #E5E7EB' }}>
              <img src={product.images[0]} alt={product.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
          </div>

          {/* Details */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem', paddingTop:'2rem' }}>
            <div>
              <span style={{ display:'inline-block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>
                {product.category}
              </span>
              <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'3rem', fontWeight:900, color:'#09090B', lineHeight:1.1, letterSpacing:'-0.02em' }}>
                {product.title}
              </h1>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', paddingBottom:'1.5rem', borderBottom:'1px solid #E5E7EB' }}>
              <div style={{ display:'flex', color:'#D4AF37' }}><Star size={14} style={{ fill:'#D4AF37' }} /></div>
              <span style={{ fontSize:'0.875rem', fontWeight:700, color:'#09090B' }}>{product.ratings || '5.0'}</span>
              <span style={{ color:'#E5E7EB' }}>|</span>
              <span style={{ fontSize:'0.75rem', color:'#71717A' }}>{product.reviews?.length || 0} Reviews</span>
            </div>

            <div style={{ fontSize:'1.5rem', fontWeight:900, color:'#09090B' }}>
              Rs. {Number(product.price).toLocaleString('en-NP')}
            </div>

            <p style={{ fontSize:'0.875rem', color:'#52525B', lineHeight:1.8 }}>
              {product.description}
            </p>

            <div style={{ borderTop:'1px solid #E5E7EB', borderBottom:'1px solid #E5E7EB', padding:'1.5rem 0', display:'flex', alignItems:'center', gap:'1.5rem' }}>
              <span style={{ fontSize:'0.75rem', fontWeight:800, color:'#09090B', textTransform:'uppercase', letterSpacing:'0.05em' }}>Status:</span>
              {product.stock > 0 ? (
                <span style={{ color:'#10B981', fontSize:'0.75rem', fontWeight:700 }}>In Stock ({product.stock} available)</span>
              ) : (
                <span style={{ color:'#EF4444', fontSize:'0.75rem', fontWeight:700 }}>Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginTop:'1rem' }}>
                <select value={quantity} onChange={e=>setQuantity(Number(e.target.value))} style={{ width:'5rem', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'1rem', color:'#09090B', fontSize:'0.875rem', outline:'none', cursor:'pointer' }}>
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
                <button onClick={handleAddToCart} style={{ flexGrow:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', padding:'1rem 2rem', background:'#000000', color:'#FFFFFF', fontSize:'0.875rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', border:'none', cursor:'pointer', transition:'background 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='#27272A'} onMouseLeave={e=>e.currentTarget.style.background='#000000'}>
                  Add to Bag
                </button>
                <button onClick={handleAddToWishlist} style={{ padding:'1rem', background:'#FFFFFF', border:'1px solid #E5E7EB', color:'#09090B', cursor:'pointer', transition:'border-color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.borderColor='#09090B'} onMouseLeave={e=>e.currentTarget.style.borderColor='#E5E7EB'}>
                  <Heart size={20} />
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-4 mt-4">
              {[
                { Icon: ShieldCheck, text: 'Authentic' },
                { Icon: RefreshCw,   text: 'Returns' },
                { Icon: Truck,       text: 'Fast Ship' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <Icon size={16} style={{ color:'#09090B' }} />
                  <span style={{ fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.05em' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Delivery Estimator */}
            <div style={{ background:'#F9FAFB', padding:'1.5rem', marginTop:'2rem' }}>
              <h4 style={{ fontSize:'0.75rem', fontWeight:800, color:'#09090B', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1rem' }}>Delivery Estimate</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select value={deliveryRegion} onChange={e=>setDeliveryRegion(e.target.value)} style={{ width:'100%', background:'#FFFFFF', border:'1px solid #E5E7EB', padding:'0.75rem', color:'#09090B', fontSize:'0.8rem', outline:'none' }}>
                  <option value="inside-ringroad">Inside Ring Road</option>
                  <option value="outside-ringroad">Outside Ring Road</option>
                  <option value="outside-valley">Outside Valley</option>
                </select>
                <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', fontSize:'0.75rem' }}>
                  <p style={{ color:'#71717A' }}>Cost: <strong style={{ color:'#09090B' }}>Rs. {delivery.cost}</strong></p>
                  <p style={{ color:'#71717A', marginTop:'0.25rem' }}>Time: <strong style={{ color:'#09090B' }}>{delivery.time}</strong></p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews */}
        <div style={{ paddingTop:'4rem', borderTop:'1px solid #E5E7EB' }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'2.5rem', fontWeight:900, color:'#09090B', marginBottom:'3rem', textAlign:'center' }}>Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {!product.reviews || product.reviews.length === 0 ? (
                <div style={{ padding:'3rem', textAlign:'center', color:'#71717A', border:'1px solid #E5E7EB', background:'#F9FAFB' }}>
                  No reviews yet. Share your experience.
                </div>
              ) : (
                product.reviews.map((rev, idx) => (
                  <div key={idx} style={{ borderBottom:'1px solid #E5E7EB', paddingBottom:'1.5rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                      <h4 style={{ fontSize:'0.875rem', fontWeight:700, color:'#09090B' }}>{rev.name}</h4>
                      <div style={{ display:'flex', color:'#D4AF37' }}>
                        {[...Array(Math.floor(rev.rating))].map((_, i) => <Star key={i} size={12} style={{ fill:'#D4AF37' }} />)}
                      </div>
                    </div>
                    <p style={{ fontSize:'0.875rem', color:'#52525B', lineHeight:1.6 }}>{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            <div className="lg:col-span-1">
              <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'2rem' }}>
                <h3 style={{ fontSize:'1rem', fontWeight:800, color:'#09090B', marginBottom:'1.5rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Write a Review</h3>
                {userInfo ? (
                  <form onSubmit={handleReviewSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                    {reviewSuccess && <div style={{ padding:'0.75rem', background:'#ECFDF5', color:'#059669', fontSize:'0.75rem', border:'1px solid #A7F3D0' }}>Review submitted.</div>}
                    {reviewError && <div style={{ padding:'0.75rem', background:'#FEF2F2', color:'#DC2626', fontSize:'0.75rem', border:'1px solid #FECACA' }}>{reviewError}</div>}
                    
                    <div>
                      <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', marginBottom:'0.5rem' }}>Rating</label>
                      <select value={rating} onChange={e=>setRating(Number(e.target.value))} style={{ width:'100%', background:'#FFFFFF', border:'1px solid #E5E7EB', padding:'0.75rem', color:'#09090B', fontSize:'0.8rem', outline:'none' }}>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Average</option>
                        <option value="2">2 - Poor</option>
                        <option value="1">1 - Terrible</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', marginBottom:'0.5rem' }}>Review</label>
                      <textarea required rows="4" value={comment} onChange={e=>setComment(e.target.value)} style={{ width:'100%', background:'#FFFFFF', border:'1px solid #E5E7EB', padding:'0.75rem', color:'#09090B', fontSize:'0.8rem', outline:'none' }} />
                    </div>

                    <button type="submit" style={{ width:'100%', padding:'1rem', background:'#000000', color:'#FFFFFF', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', border:'none', cursor:'pointer' }}>Submit</button>
                  </form>
                ) : (
                  <p style={{ fontSize:'0.8rem', color:'#71717A' }}>Please <Link to="/login" style={{ color:'#09090B', fontWeight:700, borderBottom:'1px solid #09090B' }}>login</Link> to review.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div style={{ paddingTop:'6rem', marginTop:'6rem', borderTop:'1px solid #E5E7EB' }}>
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'2.5rem', fontWeight:900, color:'#09090B' }}>You May Also Like</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(prod => <ProductCard key={prod.id || prod._id} product={prod} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default ProductDetails;
