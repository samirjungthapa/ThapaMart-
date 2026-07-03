import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice.js';
import { addToWishlist } from '../store/slices/wishlistSlice.js';
import api from '../store/api.js';
import ProductCard from '../components/ProductCard.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  
  const [deliveryRegion, setDeliveryRegion] = useState('inside-ringroad');

  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [engravingText, setEngravingText] = useState('');
  const [engravingColor, setEngravingColor] = useState('#000000');
  const [accentColor, setAccentColor] = useState('#FFFFFF');

  const [is3DActive, setIs3DActive] = useState(false);
  const [rotation, setRotation] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  useEffect(() => {
    if (!is3DActive) return;
    const canvas = document.getElementById('customizer-3d-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const size = 95;
    const rad = (rotation * Math.PI) / 180;

    // Ambient shadow
    ctx.beginPath();
    ctx.ellipse(cx, cy + size + 20, size * 1.3, 16, 0, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fill();

    ctx.save();
    ctx.translate(cx, cy);

    // 3D vertices of product box
    const vertices = [
      { x: -size, y: -size * 1.2, z: -size },
      { x: size, y: -size * 1.2, z: -size },
      { x: size, y: size * 1.2, z: -size },
      { x: -size, y: size * 1.2, z: -size },
      { x: -size, y: -size * 1.2, z: size },
      { x: size, y: -size * 1.2, z: size },
      { x: size, y: size * 1.2, z: size },
      { x: -size, y: size * 1.2, z: size }
    ];

    const projected = vertices.map(v => {
      // Y-axis rotation
      const xRot = v.x * Math.cos(rad) - v.z * Math.sin(rad);
      const zRot = v.x * Math.sin(rad) + v.z * Math.cos(rad);
      const scale = 280 / (280 + zRot);
      return {
        x: xRot * scale,
        y: v.y * scale,
        z: zRot
      };
    });

    const faces = [
      { indices: [0, 1, 2, 3], label: 'Back', color: '#111827' },
      { indices: [0, 1, 5, 4], label: 'Top', color: '#1F2937' },
      { indices: [2, 3, 7, 6], label: 'Bottom', color: '#111827' },
      { indices: [0, 3, 7, 4], label: 'Left', color: '#374151' },
      { indices: [1, 2, 6, 5], label: 'Right', color: '#4B5563' },
      { indices: [4, 5, 6, 7], label: 'Front', color: accentColor === '#FFFFFF' || accentColor === '#ffffff' ? '#10B981' : accentColor }
    ];

    const faceDepths = faces.map(f => {
      const avgZ = f.indices.reduce((sum, idx) => sum + projected[idx].z, 0) / 4;
      return { face: f, avgZ };
    });
    faceDepths.sort((a, b) => b.avgZ - a.avgZ);

    faceDepths.forEach(({ face }) => {
      ctx.beginPath();
      ctx.moveTo(projected[face.indices[0]].x, projected[face.indices[0]].y);
      for (let i = 1; i < 4; i++) {
        ctx.lineTo(projected[face.indices[i]].x, projected[face.indices[i]].y);
      }
      ctx.closePath();

      const grad = ctx.createLinearGradient(-size, -size, size, size);
      grad.addColorStop(0, face.color);
      grad.addColorStop(1, '#020617');

      ctx.fillStyle = grad;
      ctx.fill();

      // Shiny overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      if (face.label === 'Front' && engravingText) {
        ctx.save();
        const fCenterX = (projected[4].x + projected[5].x + projected[6].x + projected[7].x) / 4;
        const fCenterY = (projected[4].y + projected[5].y + projected[6].y + projected[7].y) / 4;

        ctx.translate(fCenterX, fCenterY);
        const dx = projected[5].x - projected[4].x;
        const dy = projected[5].y - projected[4].y;
        ctx.rotate(Math.atan2(dy, dx));

        // Engraving Plate
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(-55, -9, 110, 18);
        ctx.lineWidth = 1;
        ctx.strokeStyle = engravingColor || '#000000';
        ctx.strokeRect(-55, -9, 110, 18);

        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = engravingColor || '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(engravingText.toUpperCase(), 0, 0);
        ctx.restore();
      }
    });

    ctx.restore();
  }, [is3DActive, rotation, accentColor, engravingText, engravingColor]);


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
    setActiveImg(0);
    setReviewSuccess(false);
    setReviewError('');
    setIsSubscribed(false);
    setEngravingText('');
    setEngravingColor('#000000');
    setAccentColor('#FFFFFF');
  }, [id]);

  const handleAddToCart = () => {
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
      quantity: Number(quantity),
      subscribed: isSubscribed,
      engraving: engravingText,
      customColor: accentColor
    }));
    navigate('/cart');
  };

  const handleAddToWishlist = () => { 
    if (!userInfo) {
      navigate(`/login?redirect=${location.pathname}`);
      return;
    }
    dispatch(addToWishlist(product)); 
  };

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
          <div style={{ position:'sticky', top:'5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
            {is3DActive ? (
              <div 
                style={{ 
                  aspectRatio:'4/5', 
                  background:'#0B0F19', 
                  overflow:'hidden', 
                  border:'1px solid #E5E7EB',
                  position:'relative',
                  cursor:'grab',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
                onMouseDown={(e) => {
                  setIsDragging(true);
                  setDragStart(e.clientX);
                }}
                onMouseMove={(e) => {
                  if (!isDragging) return;
                  const delta = e.clientX - dragStart;
                  setRotation(prev => prev + delta * 0.7);
                  setDragStart(e.clientX);
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              >
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', color: '#FFF', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', pointerEvents: 'none' }}>
                  Drag to Rotate 🔄
                </div>
                <canvas 
                  id="customizer-3d-canvas" 
                  width={400} 
                  height={450} 
                  style={{ width: '100%', height: '100%', maxHeight: '450px' }} 
                />
              </div>
            ) : (
              <div 
                onMouseMove={(e) => {
                  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - left) / width) * 100;
                  const y = ((e.clientY - top) / height) * 100;
                  setZoomPos({ x, y });
                }}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                style={{ 
                  aspectRatio:'4/5', 
                  background:'#F9FAFB', 
                  overflow:'hidden', 
                  border:'1px solid #E5E7EB',
                  position:'relative',
                  cursor:'zoom-in'
                }}
              >
                <img 
                  src={product.images[activeImg] || product.images[0]} 
                  alt={product.title} 
                  style={{ 
                    width:'100%', 
                    height:'100%', 
                    objectFit:'cover',
                    transform: isZooming ? 'scale(2.2)' : 'scale(1)',
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transition: isZooming ? 'none' : 'transform 0.2s ease-out'
                  }} 
                />
                {/* Color Accent Tint Overlay */}
                {accentColor && accentColor !== '#ffffff' && accentColor !== '#FFFFFF' && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: accentColor,
                      mixBlendMode: 'multiply',
                      opacity: 0.15,
                      pointerEvents: 'none'
                    }}
                  />
                )}
                {/* Laser Engraving Preview Overlay */}
                {engravingText && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      bottom: '15%', 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      color: engravingColor,
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      border: `1px dashed ${engravingColor}`,
                      padding: '6px 16px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '900',
                      fontFamily: 'monospace',
                      letterSpacing: '0.15em',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    {engravingText.toUpperCase()}
                  </div>
                )}
              </div>
            )}

            {/* Toggle 3D Mode vs Gallery */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setIs3DActive(false)}
                style={{ 
                  flex: 1, 
                  padding: '0.5rem', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  background: !is3DActive ? '#000' : '#FFF', 
                  color: !is3DActive ? '#FFF' : '#000',
                  border: '1px solid #000',
                  cursor: 'pointer' 
                }}
              >
                🖼️ PHOTO GALLERY
              </button>
              <button 
                onClick={() => setIs3DActive(true)}
                style={{ 
                  flex: 1, 
                  padding: '0.5rem', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  background: is3DActive ? '#000' : '#FFF', 
                  color: is3DActive ? '#FFF' : '#000',
                  border: '1px solid #000',
                  cursor: 'pointer' 
                }}
              >
                🌐 3D STUDIO MODE
              </button>
            </div>

            {/* Thumbnail Gallery Selector */}
            {product.images && product.images.length > 1 && (
              <div style={{ display:'flex', gap:'0.5rem', overflowX:'auto', paddingBottom:'0.5rem' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    style={{
                      width:'70px',
                      height:'85px',
                      border: activeImg === idx ? '2px solid #000000' : '1px solid #E5E7EB',
                      padding:0,
                      cursor:'pointer',
                      background:'#F9FAFB',
                      overflow:'hidden',
                      flexShrink:0
                    }}
                  >
                    <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </button>
                ))}
              </div>
            )}
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
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '0.75rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: '#09090B' }}>
                    <input 
                      type="radio" 
                      name="subscription_mode" 
                      checked={!isSubscribed} 
                      onChange={() => setIsSubscribed(false)} 
                      style={{ accentColor: '#000000' }}
                    />
                    One-time Purchase
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: '#09090B' }}>
                    <input 
                      type="radio" 
                      name="subscription_mode" 
                      checked={isSubscribed} 
                      onChange={() => setIsSubscribed(true)} 
                      style={{ accentColor: '#000000' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>Subscribe & Save (10% OFF) 🔄</span>
                      <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 500 }}>Deliver every month automatically</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Personalization Studio */}
            {product.stock > 0 && (
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '1rem', padding: '1.25rem', marginTop: '1rem' }}>
                <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                  🎨 Personalization Studio
                </span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#09090B', marginBottom: '0.25rem' }}>
                      Custom Laser Engraving
                    </label>
                    <input 
                      type="text" 
                      maxLength={25}
                      placeholder="e.g. THAPA ELITE"
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.75rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '0.5rem', color: '#09090B', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#09090B', marginBottom: '0.25rem' }}>
                        Laser Color
                      </label>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {['#000000', '#D4AF37', '#3B82F6', '#EF4444', '#10B981'].map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setEngravingColor(color)}
                            style={{ 
                              width: '18px', 
                              height: '18px', 
                              borderRadius: '50%', 
                              backgroundColor: color, 
                              border: engravingColor === color ? '2px solid #000' : '1px solid #ccc',
                              cursor: 'pointer',
                              padding: 0
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#09090B', marginBottom: '0.25rem' }}>
                        Color Accent Overlay
                      </label>
                      <input 
                        type="color" 
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        style={{ width: '100%', height: '20px', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer', background: 'none', padding: 0 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

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
