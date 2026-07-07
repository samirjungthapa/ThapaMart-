import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight, FiPrinter, FiShoppingBag, FiMapPin, FiCalendar, FiCreditCard, FiCopy, FiCheck, FiMail, FiStar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../store/api.js';

// Setup colorful confetti arrays
const CONFETTI_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];
const CONFETTI_PARTICLES = Array.from({ length: 80 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100, // random start horizontal %
  y: Math.random() * -20 - 10, // start above screen
  size: Math.random() * 8 + 6,
  color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  delay: Math.random() * 2,
  duration: Math.random() * 3 + 3,
  rotate: Math.random() * 360,
  drift: Math.random() * 40 - 20 // random sway drift px
}));

const LiveDeliveryTracker = ({ orderStatus }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Preparing shipment...');

  useEffect(() => {
    let targetProgress = 10;
    let initialStatus = 'Preparing shipment...';

    if (orderStatus === 'Processing') {
      targetProgress = 35;
      initialStatus = 'Preparing shipment at ThapaMart Warehouse...';
    } else if (orderStatus === 'Shipped') {
      targetProgress = 75;
      initialStatus = 'Package picked up & dispatched via express delivery... 🛵';
    } else if (orderStatus === 'Delivered') {
      targetProgress = 100;
      initialStatus = 'Delivered! Thank you for choosing ThapaMart. 🎉';
    } else if (orderStatus === 'Pending') {
      targetProgress = 10;
      initialStatus = 'Awaiting payment confirmation... ⏳';
    }

    setProgress(targetProgress);
    setStatus(initialStatus);
  }, [orderStatus]);

  const pathLength = 500;
  const strokeDashoffset = pathLength - (progress / 100) * pathLength;

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: '1.5rem', padding: '1.5rem', marginTop: '0rem', marginBottom: '2rem' }} className="shadow-sm border-slate-100">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#09090B', margin: 0 }}>
            Live Delivery Tracker
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#71717A', margin: '0.25rem 0 0 0' }}>{status}</p>
        </div>
        <div style={{ background: '#ECFDF5', color: '#065F46', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '9999px' }}>
          {progress}%
        </div>
      </div>

      <div style={{ width: '100%', position: 'relative', overflow: 'hidden', borderRadius: '0.75rem', background: '#F8FAFC', border: '1px solid #F1F5F9', padding: '1rem' }}>
        <svg viewBox="0 0 600 200" style={{ width: '100%', height: 'auto' }}>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="600" height="200" fill="url(#grid)" />

          <path d="M50 150 L200 150 L250 80 L400 80 L450 150 L550 150" fill="none" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 150 L200 150 L250 80 L400 80 L450 150 L550 150" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={pathLength} strokeDashoffset={strokeDashoffset} />

          <circle cx="50" cy="150" r="10" fill="#09090B" />
          <circle cx="50" cy="150" r="6" fill="#FFFFFF" />
          <text x="50" y="180" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 700, fill: '#09090B' }}>Warehouse</text>

          <circle cx="550" cy="150" r="10" fill="#10B981" />
          <circle cx="550" cy="150" r="6" fill="#FFFFFF" />
          <text x="550" y="180" textAnchor="middle" style={{ fontSize: '10px', fontWeight: 700, fill: '#10B981' }}>Home</text>

          {(() => {
            let x = 50;
            let y = 150;
            if (progress <= 30) {
              const ratio = progress / 30;
              x = 50 + ratio * 150;
              y = 150;
            } else if (progress <= 47) {
              const ratio = (progress - 30) / 17;
              x = 200 + ratio * 50;
              y = 150 - ratio * 70;
            } else if (progress <= 77) {
              const ratio = (progress - 47) / 30;
              x = 250 + ratio * 150;
              y = 80;
            } else if (progress <= 90) {
              const ratio = (progress - 77) / 13;
              x = 400 + ratio * 50;
              y = 80 + ratio * 70;
            } else {
              const ratio = (progress - 90) / 10;
              x = 450 + ratio * 100;
              y = 150;
            }
            return (
              <g transform={`translate(${x}, ${y})`}>
                <circle r="15" fill="#10B981" opacity="0.3" className="animate-ping" style={{ animationDuration: '2s' }} />
                <circle r="10" fill="#10B981" />
                <text y="3" textAnchor="middle" style={{ fontSize: '10px', fill: '#FFFFFF' }}>🛵</text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
};

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get('orderId') || new URLSearchParams(location.search).get('id') || 'unknown';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Rating Feedback Widget states
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    const fetchOrderAndRecs = async () => {
      if (orderId === 'unknown') {
        setLoading(false);
        return;
      }
      try {
        // Fetch order details
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);

        // Fetch recommended products
        const recsRes = await api.get('/products', { params: { limit: 3 } });
        setRecommendedProducts(recsRes.data?.products || []);
      } catch (err) {
        console.error('Failed to fetch details:', err);
        setError(err.response?.data?.message || 'Could not fetch order details');
        
        // Fallback fetch recommendations anyway
        try {
          const recsRes = await api.get('/products', { params: { limit: 3 } });
          setRecommendedProducts(recsRes.data?.products || []);
        } catch (_) {}
      } finally {
        setLoading(false);
      }
    };
    fetchOrderAndRecs();
  }, [orderId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('TMART10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyRef = () => {
    const finalId = order?.id || order?._id || orderId;
    navigator.clipboard.writeText(finalId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handlePrint = () => {
    const finalOrderId = order?.id || order?._id || orderId;
    const userName = order?.user?.name || 'Thapa Customer';
    const subtotalVal = order?.products?.reduce((acc, p) => acc + (p.price || 0) * (p.quantity || 1), 0) || 0;
    const shippingVal = subtotalVal > 15000 ? 0 : 150; // free above 15000 NPR
    const taxVal = Math.round(subtotalVal * 0.13);
    const totalVal = subtotalVal + shippingVal + taxVal;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt #${finalOrderId} - ThapaMart</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; background-color: #FAFAFA; color: #18181B; margin: 0; padding: 40px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .receipt-container { max-width: 750px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 24px; padding: 48px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
            
            .brand-section { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #F4F4F5; padding-bottom: 24px; }
            .brand-logo { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 800; letter-spacing: -0.02em; color: #09090B; }
            .brand-sub { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #10B981; margin-top: 2px; }
            .receipt-badge { background: #ECFDF5; border: 1px solid #A7F3D0; color: #047857; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; border-radius: 99px; }
            
            .meta-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; margin: 32px 0; }
            .meta-block h4 { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #71717A; letter-spacing: 0.05em; margin: 0 0 10px 0; }
            .meta-block p { font-size: 13px; font-weight: 505; line-height: 1.6; color: #27272A; margin: 0; }
            .meta-block strong { color: #09090B; font-weight: 700; }
            
            .details-table { width: 100%; border-collapse: collapse; margin: 32px 0; }
            .details-table th { text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #71717A; letter-spacing: 0.05em; padding: 12px 16px; border-bottom: 1px solid #E4E4E7; background: #FAF9F6; }
            .details-table td { padding: 16px; font-size: 13px; font-weight: 600; color: #27272A; border-bottom: 1px solid #F4F4F5; }
            .details-table td.qty { color: #71717A; }
            .details-table td.price { text-align: right; }
            .details-table th.price { text-align: right; }
            
            .summary-section { margin-left: auto; width: 300px; display: flex; flex-direction: column; gap: 12px; border-top: 1px solid #E4E4E7; padding-top: 20px; }
            .summary-row { display: flex; justify-content: space-between; font-size: 13px; font-weight: 500; color: #71717A; }
            .summary-row.total { font-size: 18px; font-weight: 800; color: #09090B; margin-top: 4px; padding-top: 12px; border-top: 1px solid #F4F4F5; }
            
            .footer-note { text-align: center; margin-top: 48px; border-top: 1px dashed #E4E4E7; padding-top: 24px; }
            .footer-note p { font-size: 11px; color: #71717A; margin: 0 0 4px 0; font-weight: 500; }
            
            @media print {
              body { background-color: #FFFFFF; padding: 0; }
              .receipt-container { border: none; padding: 0; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="brand-section">
              <div>
                <div class="brand-logo">THAPAMART</div>
                <div class="brand-sub">Premium E-Commerce</div>
              </div>
              <div class="receipt-badge">${order?.orderStatus || 'Processing'}</div>
            </div>

            <div class="meta-grid">
              <div class="meta-block">
                <h4>Customer Details</h4>
                <p>
                  <strong>Name:</strong> ${userName}<br>
                  <strong>Email:</strong> ${order?.user?.email || 'customer@thapamart.com'}<br>
                  <strong>Billing Type:</strong> Personal Account Card
                </p>
              </div>
              <div class="meta-block">
                <h4>Invoice Details</h4>
                <p>
                  <strong>Reference No:</strong> <span style="font-family: monospace; font-size: 12px;">${finalOrderId}</span><br>
                  <strong>Order Date:</strong> ${order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}<br>
                  <strong>Payment Status:</strong> Paid
                </p>
              </div>
            </div>

            <table class="details-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th class="price" style="width: 100px;">Price</th>
                  <th class="price" style="width: 80px; text-align: center;">Qty</th>
                  <th class="price" style="width: 120px;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${(order?.products || []).map(p => `
                  <tr>
                    <td>
                      <div style="font-weight: 700; color: #09090B;">${p.title || p.name || 'Curated Item'}</div>
                    </td>
                    <td class="price">Rs. ${(p.price || 0).toLocaleString()}</td>
                    <td class="price" style="text-align: center; color: #71717A;">${p.quantity || p.qty || 1}</td>
                    <td class="price">Rs. ${((p.price || 0) * (p.quantity || p.qty || 1)).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="summary-section">
              <div class="summary-row">
                <span>Subtotal</span>
                <span style="color: #09090B; font-weight: 700;">Rs. ${subtotalVal.toLocaleString()}</span>
              </div>
              <div class="summary-row">
                <span>Estimated Shipping</span>
                <span style="color: #09090B; font-weight: 700;">${shippingVal === 0 ? 'Free' : `Rs. ${shippingVal.toLocaleString()}`}</span>
              </div>
              <div class="summary-row">
                <span>Sales Tax</span>
                <span style="color: #09090B; font-weight: 700;">Rs. ${taxVal.toLocaleString()}</span>
              </div>
              <div class="summary-row total">
                <span>Total Amount</span>
                <span>Rs. ${totalVal.toLocaleString()}</span>
              </div>
            </div>

            <div class="footer-note">
              <p>Thank you for choosing ThapaMart.</p>
              <p style="font-size: 10px; color: #A1A1AA;">For support questions, please contact support@thapamart.com</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getDeliveryDate = () => {
    const date = order?.createdAt ? new Date(order.createdAt) : new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl space-y-4">
          <div className="h-12 bg-slate-100 rounded-lg animate-pulse w-3/4 mx-auto"></div>
          <div className="h-6 bg-slate-100 rounded-lg animate-pulse w-1/2 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
            <div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const userName = order?.user?.name || 'Valued Customer';
  const finalOrderId = order?.id || order?._id || orderId;

  // Safe pricing calculation fallbacks
  const subtotalVal = order?.itemsPrice !== undefined 
    ? order.itemsPrice 
    : (order?.totalPrice !== undefined 
        ? (order.totalPrice - (order.shippingPrice || 0) - (order.taxPrice || 0)) 
        : 0);

  const shippingVal = order?.shippingPrice || 0;
  const taxVal = order?.taxPrice || 0;
  const totalVal = order?.totalPrice || 0;

  const formattedAddress = order?.shippingAddress
    ? [
        order.shippingAddress.address,
        order.shippingAddress.city,
        order.shippingAddress.postalCode,
        order.shippingAddress.country
      ].filter(Boolean).join(', ')
    : 'Not Specified';

  // Stepper steps configuration
  const trackingSteps = [
    { 
      label: 'Order Confirmed', 
      description: 'Order received', 
      active: true, 
      date: order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today' 
    },
    { 
      label: 'Preparing', 
      description: 'Item packaging', 
      active: order?.orderStatus === 'Processing' || order?.orderStatus === 'Shipped' || order?.orderStatus === 'Delivered', 
      date: order?.orderStatus === 'Processing' || order?.orderStatus === 'Shipped' || order?.orderStatus === 'Delivered' ? 'Completed' : 'Pending' 
    },
    { 
      label: 'In Transit', 
      description: 'On the way', 
      active: order?.orderStatus === 'Shipped' || order?.orderStatus === 'Delivered', 
      date: order?.orderStatus === 'Shipped' || order?.orderStatus === 'Delivered' ? 'Shipped' : 'Expected soon' 
    },
    { 
      label: 'Delivered', 
      description: 'At your doorstep', 
      active: order?.orderStatus === 'Delivered', 
      date: order?.orderStatus === 'Delivered' ? 'Delivered' : 'Expected 3 days' 
    }
  ];

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0 relative overflow-hidden">
      
      {/* Confetti Rain Particle Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden print-hide">
        {CONFETTI_PARTICLES.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ y: particle.y + '%', x: particle.x + 'vw', rotate: particle.rotate, opacity: 1 }}
            animate={{ 
              y: '110vh', 
              x: `calc(${particle.x}vw + ${particle.drift}px)`,
              rotate: particle.rotate + 360,
              opacity: [1, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: 'linear',
              repeat: Infinity
            }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: Math.random() > 0.4 ? '50%' : '2px',
              zIndex: 10
            }}
          />
        ))}
      </div>

      {/* Custom Print Stylesheet */}
      <style>{`
        @media print {
          header, footer, nav, .print-hide, #mart-ai-bubble, #spin-wheel-container, [class*="SpinWheel"], [class*="MartAI"] {
            display: none !important;
          }
          body, html, #root {
            background: #FFFFFF !important;
            color: #18181B !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-container {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 24px !important;
          }
          .print-avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            box-shadow: none !important;
            border: 1px solid #E4E4E7 !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto print-container relative z-20">
        
        {/* Top Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-slate-100 shadow-sm rounded-3xl p-8 sm:p-10 text-center mb-8 print:border-none print:shadow-none print-avoid-break"
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 print:w-16 print:h-16">
            <FiCheckCircle className="w-12 h-12" />
          </div>

          <h1 className="text-3.5xl font-black text-zinc-900 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Thank you, {userName}!
          </h1>
          <p className="mt-3 text-base text-zinc-500 max-w-xl mx-auto">
            Your payment was successful and your order has been received. We are preparing it for shipment.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-500">
            <button 
              onClick={handleCopyRef}
              className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 py-1.5 px-3 rounded-full flex items-center gap-1.5 transition-colors print:border-none print:bg-transparent cursor-pointer"
              title="Click to copy Order ID"
            >
              Order Ref: {finalOrderId}
              <span className="print-hide">
                {copiedRef ? <FiCheck className="text-emerald-600 w-3 h-3" /> : <FiCopy className="w-3 h-3 text-zinc-400" />}
              </span>
            </button>
            {order?.createdAt && (
              <span className="bg-zinc-50 border border-zinc-100 py-1.5 px-3 rounded-full flex items-center gap-1">
                <FiCalendar className="w-3.5 h-3.5" />
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </motion.div>

        {/* Order Lifecycle Progress Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 mb-8 print-avoid-break print-hide"
        >
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-400 mb-6">
            Order Lifecycle Progress
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {trackingSteps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center md:items-start text-center md:text-left">
                {/* Horizontal line indicator connecting steps */}
                {idx < trackingSteps.length - 1 && (
                  <div className="hidden md:block absolute top-4 left-8 right-0 h-0.5 bg-zinc-100 z-0">
                    <div 
                      className={`h-full ${step.active && trackingSteps[idx + 1].active ? 'bg-emerald-500' : 'bg-zinc-100'}`} 
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
                
                {/* Dot */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                  step.active 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                }`}>
                  {idx + 1}
                </div>
                
                {/* Step Content */}
                <h4 className="mt-3 text-sm font-bold text-zinc-950">{step.label}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">{step.description}</p>
                <span className="text-[10px] font-mono text-zinc-500 mt-2 bg-zinc-50 py-0.5 px-1.5 rounded">{step.date}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Map Delivery Tracker */}
        <LiveDeliveryTracker orderStatus={order?.orderStatus} />

        {/* Two-Column Invoice & Details Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start print-grid">
          
          {/* Left Column: Order Items & Promo Code */}
          <div className="space-y-8">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 print-avoid-break"
            >
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-6 border-b border-zinc-100 pb-4">
                <FiShoppingBag className="text-zinc-900 w-5 h-5" />
                Your Purchased Items
              </h2>

              <div className="divide-y divide-zinc-100 max-h-[360px] overflow-y-auto pr-1">
                {order?.products?.map((item, index) => {
                  const itemTitle = item.title || item.name || 'Premium Collection Item';
                  const itemQty = item.quantity || item.qty || 1;
                  const itemPrice = item.price || 0;
                  
                  return (
                    <div key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <img 
                        src={item.image} 
                        alt={itemTitle} 
                        className="w-16 h-20 object-cover rounded-xl bg-zinc-50 border border-zinc-100"
                      />
                      <div className="flex-grow flex flex-col justify-center">
                        <h3 className="text-sm font-semibold text-zinc-800 line-clamp-2">
                          {itemTitle}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-zinc-400">
                            Qty: {itemQty}
                          </span>
                          <span className="text-sm font-bold text-zinc-900">
                            Rs. {(itemPrice * itemQty).toLocaleString('en-NP')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }) || (
                  <p className="text-sm text-zinc-500">Order item details are currently unavailable.</p>
                )}
              </div>
            </motion.div>

            {/* Special Loyalty Reward Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-zinc-900 text-white rounded-3xl p-6 shadow-sm relative overflow-hidden print-hide"
            >
              <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-4 translate-y-4">
                <FiCheckCircle size={140} />
              </div>
              <h3 className="text-lg font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Exclusive Thank You Reward</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Enjoy 10% off your next premium collection order. Use code at checkout:
              </p>
              <div className="mt-4 flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="font-mono font-black text-lg tracking-wider text-white">TMART10</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 bg-white text-zinc-900 py-1.5 px-4 rounded-xl text-xs font-bold hover:bg-zinc-100 transition-colors shadow-sm"
                >
                  {copied ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Pricing Summary & Shipping/Delivery Details */}
          <div className="space-y-8">
            
            {/* Price breakdown & Shipping details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 print-avoid-break"
            >
              <h2 className="text-lg font-bold text-zinc-900 mb-6 border-b border-zinc-100 pb-4">
                Payment & Billing Details
              </h2>

              <div className="space-y-3.5 text-sm mb-6 border-b border-zinc-100 pb-6">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-800">
                    Rs. {subtotalVal.toLocaleString('en-NP')}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Shipping Cost</span>
                  <span className="font-semibold text-zinc-800">
                    {shippingVal === 0 ? 'Free' : `Rs. ${shippingVal.toLocaleString('en-NP')}`}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Sales Tax</span>
                  <span className="font-semibold text-zinc-800">
                    Rs. {taxVal.toLocaleString('en-NP')}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-zinc-900 pt-3 border-t border-zinc-100">
                  <span>Total Paid</span>
                  <span className="text-emerald-600 font-extrabold">
                    Rs. {totalVal.toLocaleString('en-NP')}
                  </span>
                </div>
              </div>

              {/* Delivery and Address details */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <FiMapPin className="text-zinc-400 w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Shipping Address</h4>
                    <p className="text-sm font-medium text-zinc-800 mt-0.5">
                      {formattedAddress}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <FiCreditCard className="text-zinc-400 w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Payment Mode</h4>
                    <p className="text-sm font-semibold text-zinc-800 mt-0.5">
                      {order?.paymentMethod || 'Not Specified'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <FiCalendar className="text-emerald-600 w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Estimated Delivery</h4>
                    <p className="text-sm font-bold text-zinc-800 mt-0.5">
                      {getDeliveryDate()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Experience Rating feedback Widget */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 text-center print-hide"
            >
              <h3 className="text-sm font-bold text-zinc-800 mb-2">How was your checkout experience?</h3>
              <p className="text-xs text-zinc-400 mb-4">Your rating helps us improve ThapaMart services.</p>
              
              <AnimatePresence mode="wait">
                {!ratingSubmitted ? (
                  <motion.div 
                    key="stars"
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-center gap-2"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setRating(star);
                          setRatingSubmitted(true);
                        }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-2xl transition-transform hover:scale-125 focus:outline-none"
                      >
                        <FiStar 
                          fill={star <= (hoverRating || rating) ? '#F59E0B' : 'transparent'} 
                          className={star <= (hoverRating || rating) ? 'text-amber-500' : 'text-zinc-300'} 
                        />
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="thankyou"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs font-semibold text-emerald-600 bg-emerald-50 py-2.5 px-4 rounded-2xl inline-block"
                  >
                    Thank you! We appreciate your feedback. ✓
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Interactive Bottom Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-slate-100 p-6 rounded-3xl shadow-sm print-hide"
        >
          <div className="text-center sm:text-left">
            <span className="text-xs text-zinc-400 block mb-1">Need help with your order?</span>
            <a href="mailto:support@thapamart.com" className="text-xs text-zinc-900 font-bold hover:underline flex items-center gap-1.5 justify-center sm:justify-start">
              <FiMail /> support@thapamart.com
            </a>
          </div>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-sm font-bold transition-all"
            >
              <FiPrinter /> Print Receipt
            </button>
            <Link
              to="/dashboard"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-black text-white hover:bg-zinc-900 text-sm font-bold transition-all"
            >
              Track Order
              <FiArrowRight />
            </Link>
          </div>
        </motion.div>

        {/* "You May Also Like" Recommended Products section */}
        {recommendedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 print-hide"
          >
            <h2 className="text-2xl font-black text-zinc-900 text-center mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Complete Your Collection
            </h2>
            <p className="text-xs text-zinc-400 text-center mb-8">Selected premium additions for your style</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recommendedProducts.map((prod) => (
                <Link
                  key={prod.id || prod._id}
                  to={`/products/${prod.id || prod._id}`}
                  className="bg-white border border-slate-100 hover:border-zinc-300 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-50 mb-4 relative">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:underline line-clamp-1">
                    {prod.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-zinc-400 capitalize">{prod.category}</span>
                    <span className="text-sm font-extrabold text-zinc-950">
                      Rs. {prod.price?.toLocaleString('en-NP')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back to Shop Link */}
        <div className="mt-12 text-center print-hide">
          <Link to="/shop" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            ← Return to Mart Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;

