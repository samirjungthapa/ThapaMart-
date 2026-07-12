import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../store/api.js';
import { 
  FiUser, FiPackage, FiTruck, FiMapPin, FiCheckCircle, FiAward, 
  FiCopy, FiGift, FiCheck, FiTag, FiTrash, FiPlus, FiCreditCard, 
  FiDownload, FiTrendingUp, FiDollarSign, FiX 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });

  // States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'offers'
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  
  // Advanced features states
  const [loyaltyPoints, setLoyaltyPoints] = useState(520);
  const [promoInput, setPromoInput] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [promoError, setPromoError] = useState('');
  const [notification, setNotification] = useState('');
  const [scratchedReward, setScratchedReward] = useState(false);
  const [quests, setQuests] = useState([
    { id: 1, title: "Customizer Master: Personalize any product in the Personalization Studio", reward: 100, completed: false, claimed: false },
    { id: 2, title: "Master Negotiator: Bargain with MartAI Stylist", reward: 150, completed: true, claimed: false },
    { id: 3, title: "Analyst: View your personalized spending analytics", reward: 50, completed: false, claimed: false },
    { id: 4, title: "Collector: Add at least 3 items to your shopping bag", reward: 200, completed: false, claimed: false }
  ]);
  
  // Addresses & Cards
  const [addresses, setAddresses] = useState([
    { id: 'addr-1', name: 'Home Address', street: '123 Luxury Avenue', city: 'Kathmandu', phone: '+977 9801234567', isDefault: true },
    { id: 'addr-2', name: 'Office Address', street: '456 Business Plaza, New Baneshwor', city: 'Kathmandu', phone: '+977 9841987654', isDefault: false }
  ]);

  const [cards, setCards] = useState([
    { id: 'card-1', brand: 'Visa', number: '•••• •••• •••• 4242', holder: 'Samir J. Thapa', expiry: '12/28', gradient: 'linear-gradient(135deg, #09090B 0%, #27272A 100%)' },
    { id: 'card-2', brand: 'Mastercard', number: '•••• •••• •••• 8888', holder: 'Samir J. Thapa', expiry: '06/29', gradient: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)' }
  ]);

  // Modals state
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  // Forms inputs
  const [addrName, setAddrName] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPhone, setAddrPhone] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardBrand, setCardBrand] = useState('Visa');

  const [offers, setOffers] = useState([
    {
      code: "WELCOME20",
      discount: "20% OFF",
      description: "Get 20% off on your first purchase.",
      expiry: "Valid till 31 Dec 2026",
      minSpend: "Rs. 5,000",
      category: "First Order Only",
      type: "percentage"
    },
    {
      code: "FREESHIP50",
      discount: "FREE SHIPPING",
      description: "Free shipping on orders above Rs. 5,000.",
      expiry: "Valid till 30 Nov 2026",
      minSpend: "Rs. 5,000",
      category: "Shipping",
      type: "shipping"
    },
    {
      code: "THAPAMART15",
      discount: "15% OFF",
      description: "15% off sitewide on any electronics or accessories.",
      expiry: "Valid till 15 Oct 2026",
      minSpend: "No Minimum",
      category: "Electronics",
      type: "percentage"
    },
    {
      code: "FLASHDEAL30",
      discount: "30% OFF",
      description: "Special high-tier discount on flash sales category.",
      expiry: "Valid till 15 Jul 2026",
      minSpend: "Rs. 10,000",
      category: "Flash Sale",
      type: "percentage"
    }
  ]);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.warn("ℹ️ API failed. Returning simulated user order logs.");
        setOrders([
          {
            id: "ord-mock-1",
            products: [{ title: 'Pro Sound Max Wireless Headphones', price: 189.99, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' }],
            totalPrice: 229.69,
            paymentStatus: 'Paid',
            orderStatus: 'Shipped',
            createdAt: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [userInfo, navigate]);

  // Dynamic Quest tracker
  useEffect(() => {
    setQuests(prev => prev.map(q => {
      if (q.id === 1 && cartItems?.some(item => item.engraving)) {
        return { ...q, completed: true };
      }
      if (q.id === 3 && activeTab === 'analytics') {
        return { ...q, completed: true };
      }
      if (q.id === 4 && cartItems?.length >= 3) {
        return { ...q, completed: true };
      }
      return q;
    }));
  }, [cartItems, activeTab]);

  const handleClaimReward = (questId, rewardAmount) => {
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, claimed: true } : q));
    setLoyaltyPoints(prev => prev + rewardAmount);
    showToast(`Claimed ${rewardAmount} Pts! Balance updated.`);
  };

  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    if (activeTab !== 'rewards' || !canvasRef.current || scratchedReward) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Draw silver scratch surface
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw pattern or text on top
    ctx.fillStyle = '#71717A';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch here with your cursor', canvas.width / 2, canvas.height / 2 - 8);
    ctx.fillText('to reveal a mystery offer!', canvas.width / 2, canvas.height / 2 + 10);
  }, [activeTab, scratchedReward]);

  const handleScratchMove = (e) => {
    if (!canvasRef.current || scratchedReward || (!isScratching && e.type !== 'touchmove')) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Support touch and mouse positions
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
    
    // Recalculate percent cleared
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] === 0) transparent++;
    }
    const pct = (transparent / (canvas.width * canvas.height)) * 100;
    if (pct > 50) {
      setScratchedReward(true);
      setLoyaltyPoints(prev => prev + 100);
      setOffers(prev => [
        {
          code: "SCRATCH10",
          discount: "$10 OFF",
          description: "Exclusive unlocked scratchcard reward!",
          expiry: "Valid till 31 Dec 2026",
          minSpend: "$30",
          category: "Scratch Reward",
          type: "fixed"
        },
        ...prev
      ]);
      showToast("🎉 Mystery Unlocked! Unlocked a $10 coupon code 'SCRATCH10' and earned +100 Loyalty Points!");
    }
  };

  // Analytics helper calculations
  const totalSpent = orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0)
    .toFixed(2);

  const getStatusIndex = (status) => {
    const idx = statusSteps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  // Loyalty Point Conversion logic
  const handleRedeemPoints = () => {
    if (loyaltyPoints >= 500) {
      setLoyaltyPoints(prev => prev - 500);
      setOffers(prev => [
        {
          code: "LOYAL5",
          discount: "$5 OFF",
          description: "Unlocked using 500 Gold Loyalty Points.",
          expiry: "Valid till 31 Dec 2026",
          minSpend: "No Minimum",
          category: "Loyalty Reward",
          type: "fixed"
        },
        ...prev
      ]);
      showToast("Reward Unlocked! A $5 coupon 'LOYAL5' has been added to your dashboard.");
    } else {
      showToast("Insufficient Points. You need at least 500 loyalty points to redeem.");
    }
  };

  // Coupon Code Validator Simulator
  const handleValidateCoupon = (e) => {
    e.preventDefault();
    const cleanCode = promoInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (offers.some(o => o.code === cleanCode)) {
      setPromoError("This coupon is already active in your account.");
      setPromoSuccess("");
      return;
    }

    if (cleanCode === "MEGA50") {
      setOffers(prev => [
        {
          code: "MEGA50",
          discount: "50% OFF",
          description: "Exclusive discount unlocked from verification simulator.",
          expiry: "Valid for 48 hours",
          minSpend: "$100",
          category: "Promo Validation",
          type: "percentage"
        },
        ...prev
      ]);
      setPromoSuccess("Congratulations! 'MEGA50' (50% OFF) has been successfully activated.");
      setPromoError("");
      setPromoInput("");
      showToast("Active coupon updated.");
    } else {
      setPromoError("Invalid code or code expired. Try 'MEGA50' for a special discount!");
      setPromoSuccess("");
    }
  };

  // Add Address Handler
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addrName || !addrStreet || !addrCity || !addrPhone) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      name: addrName,
      street: addrStreet,
      city: addrCity,
      phone: addrPhone,
      isDefault: addresses.length === 0
    };
    setAddresses(prev => [...prev, newAddr]);
    setShowAddAddressModal(false);
    setAddrName('');
    setAddrStreet('');
    setAddrCity('');
    setAddrPhone('');
    showToast("Shipping Address added successfully.");
  };

  // Delete Address Handler
  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast("Shipping Address removed.");
  };

  // Add Card Handler
  const handleAddCard = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !cardExpiry) return;
    
    // Mask number representation
    const lastFour = cardNumber.slice(-4) || 'xxxx';
    const maskedNumber = `•••• •••• •••• ${lastFour}`;
    
    // Pick gradient styling
    const gradients = [
      'linear-gradient(135deg, #09090B 0%, #27272A 100%)',
      'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
      'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
      'linear-gradient(135deg, #581C87 0%, #8B5CF6 100%)'
    ];
    const pickedGradient = gradients[cards.length % gradients.length];

    const newCard = {
      id: `card-${Date.now()}`,
      brand: cardBrand,
      number: maskedNumber,
      holder: cardHolder,
      expiry: cardExpiry,
      gradient: pickedGradient
    };
    setCards(prev => [...prev, newCard]);
    setShowAddCardModal(false);
    setCardNumber('');
    setCardHolder('');
    setCardExpiry('');
    showToast("Payment Card saved securely.");
  };

  // Delete Card Handler
  const handleDeleteCard = (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
    showToast("Payment Card deleted.");
  };

  // Order Actions
  const handleCancelOrder = (id) => {
    setOrders(prev => prev.map(o => (o.id || o._id) === id ? { ...o, orderStatus: 'Cancelled' } : o));
    showToast("Order request cancelled successfully.");
  };

  const handleReturnRequest = (id) => {
    setOrders(prev => prev.map(o => (o.id || o._id) === id ? { ...o, orderStatus: 'Return Requested' } : o));
    showToast("Return request registered.");
  };

  const handleDownloadInvoice = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt #${order.id || order._id} - ThapaMart</title>
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
              <div class="receipt-badge">${order.orderStatus}</div>
            </div>

            <div class="meta-grid">
              <div class="meta-block">
                <h4>Customer Details</h4>
                <p>
                  <strong>Name:</strong> ${userInfo?.name}<br>
                  <strong>Email:</strong> ${userInfo?.email}<br>
                  <strong>Billing Type:</strong> Personal Account Card
                </p>
              </div>
              <div class="meta-block">
                <h4>Invoice Details</h4>
                <p>
                  <strong>Reference No:</strong> <span style="font-family: monospace; font-size: 12px;">${order.id || order._id}</span><br>
                  <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
                  <strong>Payment Status:</strong> ${order.paymentStatus || 'Paid'}
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
                ${order.products.map(p => `
                  <tr>
                    <td>
                      <div style="font-weight: 700; color: #09090B;">${p.title}</div>
                    </td>
                    <td class="price">$${p.price.toFixed(2)}</td>
                    <td class="price" style="text-align: center; color: #71717A;">${p.quantity}</td>
                    <td class="price">$${(p.price * p.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="summary-section">
              <div class="summary-row">
                <span>Subtotal</span>
                <span style="color: #09090B; font-weight: 700;">$${order.totalPrice}</span>
              </div>
              <div class="summary-row">
                <span>Estimated Shipping</span>
                <span style="color: #09090B; font-weight: 700;">Free</span>
              </div>
              <div class="summary-row total">
                <span>Total Amount</span>
                <span>$${order.totalPrice}</span>
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

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '3rem 0 6rem 0', color: '#09090B' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Success Toasts */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
            >
              <FiCheckCircle className="text-emerald-500 w-4 h-4" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Banner Section */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center space-x-4">
            <img
              src={userInfo?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt="User profile pic"
              className="w-16 h-16 rounded-full object-cover border border-[#E5E7EB]"
            />
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-bold text-[#09090B]">Hello, {userInfo?.name}</h1>
              <p className="text-xs text-[#71717A]">Account status: {userInfo?.role === 'admin' ? 'Administrator' : 'Customer'}</p>
            </div>
          </div>
          
          <div className="flex space-x-2 flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'orders' ? 'bg-black text-white shadow-sm' : 'bg-white text-[#71717A] border border-[#E5E7EB] hover:text-[#09090B]'
              }`}
            >
              Order History
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'rewards' ? 'bg-black text-white shadow-sm' : 'bg-white text-[#71717A] border border-[#E5E7EB] hover:text-[#09090B]'
              }`}
            >
              🏅 Rewards & Gamification
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'analytics' ? 'bg-black text-white shadow-sm' : 'bg-white text-[#71717A] border border-[#E5E7EB] hover:text-[#09090B]'
              }`}
            >
              📊 Spending Analytics
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'offers' ? 'bg-black text-white shadow-sm' : 'bg-white text-[#71717A] border border-[#E5E7EB] hover:text-[#09090B]'
              }`}
            >
              Exclusive Offers
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'profile' ? 'bg-black text-white shadow-sm' : 'bg-white text-[#71717A] border border-[#E5E7EB] hover:text-[#09090B]'
              }`}
            >
              Profile Settings
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            
            {/* Analytics Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#71717A] font-bold uppercase tracking-wider block mb-1">Total Purchased</span>
                  <span className="text-3xl font-black text-black">${totalSpent}</span>
                </div>
                <div className="p-3 bg-black/5 rounded-2xl text-black">
                  <FiDollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#71717A] font-bold uppercase tracking-wider block mb-1">Active Orders</span>
                  <span className="text-3xl font-black text-black">{orders.filter(o => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Delivered').length}</span>
                </div>
                <div className="p-3 bg-black/5 rounded-2xl text-black">
                  <FiPackage className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#71717A] font-bold uppercase tracking-wider block mb-1">Loyalty Tier Progress</span>
                  <span className="text-sm font-extrabold text-black block">Platinum Elite (80%)</span>
                  <div className="w-32 bg-[#E5E7EB] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-black h-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div className="p-3 bg-black/5 rounded-2xl text-black">
                  <FiTrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Loyalty Points & Referral Hub */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Loyalty Point Redemption */}
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-wider flex items-center w-fit">
                    <FiAward className="mr-1" /> Gold Member VIP
                  </span>
                  <h3 className="text-xs font-bold text-[#71717A] uppercase tracking-wider">Loyalty Balance</h3>
                  <p className="text-3xl font-black text-[#09090B]">{loyaltyPoints} <span className="text-sm font-semibold text-[#71717A]">Pts</span></p>
                </div>
                
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="text-[11px] text-[#71717A]">Redeem 500 Pts for a $5 Gift Voucher</span>
                  <button 
                    onClick={handleRedeemPoints}
                    className="bg-black text-white hover:bg-black/90 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <FiGift /> Redeem Reward
                  </button>
                </div>
              </div>

              {/* Referral Card */}
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#09090B]">Referral Program</h3>
                  <p className="text-xs text-[#71717A]">Share your code with friends to earn 100 points per invite.</p>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <div className="flex-grow p-2.5 rounded-xl bg-white border border-[#E5E7EB] font-mono font-bold text-xs flex items-center justify-between text-[#09090B]">
                    <span>THAPAMART520</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("THAPAMART520");
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-black hover:text-black/80 transition-colors"
                      aria-label="Copy Referral Code"
                    >
                      {copied ? 'Copied!' : <FiCopy />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-bold text-[#09090B] pt-4">Your Orders & Tracking</h2>

            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black mx-auto"></div>
            ) : orders.length === 0 ? (
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-12 text-center text-[#71717A]">
                You haven't placed any orders yet.
              </div>
            ) : (
              <div className="space-y-8">
                {orders.map((order) => {
                  const currentStatusIdx = getStatusIndex(order.orderStatus);
                  const isCancelable = order.orderStatus === 'Pending' || order.orderStatus === 'Processing';
                  const isReturnable = order.orderStatus === 'Delivered';

                  return (
                    <div
                      key={order.id || order._id}
                      className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm space-y-6"
                    >
                      {/* Order Info Bar */}
                      <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-[#E5E7EB] gap-4 text-xs text-[#71717A]">
                        <div>
                          <span>Order Reference: </span>
                          <span className="font-mono font-bold text-[#09090B]">{order.id || order._id}</span>
                        </div>
                        <div>
                          <span>Placed: </span>
                          <span className="font-bold text-[#09090B]">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span>Total Amount: </span>
                          <span className="font-extrabold text-[#09090B]">${order.totalPrice}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            className="text-black hover:underline flex items-center gap-1 font-bold"
                          >
                            <FiDownload /> Invoice
                          </button>
                        </div>
                      </div>

                      {/* Products inside order */}
                      <div className="space-y-4">
                        {order.products.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-4">
                            <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-[#E5E7EB]" />
                            <div>
                              <h4 className="text-sm font-bold text-[#09090B]">{item.title}</h4>
                              <p className="text-xs text-[#71717A]">Qty {item.quantity} • ${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tracking timeline tracking */}
                      {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Return Requested' && order.orderStatus !== 'Returned' && (
                        <div className="pt-4 border-t border-[#E5E7EB]">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-6 flex items-center">
                            <FiTruck className="mr-1.5 w-4 h-4 text-black" /> Delivery Status Timeline
                          </h5>

                          <div className="grid grid-cols-4 relative">
                            {/* Connected line progress */}
                            <div className="absolute top-3.5 left-[12.5%] right-[12.5%] h-0.5 bg-[#E5E7EB] -z-10">
                              <div
                                className="h-full bg-black rounded-full transition-all duration-500"
                                style={{ width: `${(currentStatusIdx / (statusSteps.length - 1)) * 100}%` }}
                              ></div>
                            </div>

                            {statusSteps.map((step, sIdx) => {
                              const isCompleted = sIdx < currentStatusIdx || (sIdx === currentStatusIdx && order.orderStatus === 'Delivered');
                              const isActive = sIdx === currentStatusIdx && order.orderStatus !== 'Delivered';
                              return (
                                <div key={step} className="flex flex-col items-center text-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                      isActive
                                        ? 'bg-black text-white scale-110 shadow-sm ring-4 ring-black/10'
                                        : isCompleted
                                        ? 'bg-black text-white'
                                        : 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#71717A]'
                                    }`}
                                  >
                                    {isCompleted ? <FiCheck className="w-4 h-4" /> : <span className="text-xs font-bold">{sIdx + 1}</span>}
                                  </div>
                                  <span className={`text-[10px] font-bold mt-2 uppercase tracking-wide ${isActive || isCompleted ? 'text-black font-extrabold' : 'text-[#71717A]'}`}>
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Display Status for special cases */}
                      {(order.orderStatus === 'Cancelled' || order.orderStatus === 'Return Requested' || order.orderStatus === 'Returned') && (
                        <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                          <span className="font-bold uppercase tracking-wider text-[#71717A]">Order Resolution Status:</span>
                          <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wide ${
                            order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                      )}

                      {/* Interactive Order Action Buttons */}
                      {(isCancelable || isReturnable) && (
                        <div className="pt-4 border-t border-[#E5E7EB] flex justify-end gap-2">
                          {isCancelable && (
                            <button
                              onClick={() => handleCancelOrder(order.id || order._id)}
                              className="px-4 py-2 border border-red-200 text-red-650 hover:bg-red-50 rounded-xl text-xs font-bold transition-all"
                            >
                              Cancel Order
                            </button>
                          )}
                          {isReturnable && (
                            <button
                              onClick={() => handleReturnRequest(order.id || order._id)}
                              className="px-4 py-2 border border-amber-200 text-amber-650 hover:bg-amber-50 rounded-xl text-xs font-bold transition-all"
                            >
                              Request Return
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="space-y-8">
            
            {/* Coupon Validator Panel */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 max-w-xl">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-2">Coupon Validation Simulator</h3>
              <p className="text-xs text-[#71717A] mb-4">Enter a promo code to check its active reward status. (Hint: Try entering <strong>MEGA50</strong>)</p>
              
              <form onSubmit={handleValidateCoupon} className="flex gap-2">
                <input 
                  type="text" 
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Redeem code..."
                  className="flex-grow bg-white border border-[#E5E7EB] text-black px-4 py-2 rounded-xl text-xs outline-none focus:border-black font-semibold uppercase"
                />
                <button 
                  type="submit"
                  className="bg-black text-white hover:bg-black/90 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  Verify Code
                </button>
              </form>

              {promoSuccess && <p className="text-xs text-emerald-600 font-bold mt-2">{promoSuccess}</p>}
              {promoError && <p className="text-xs text-red-650 font-bold mt-2">{promoError}</p>}
            </div>

            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-bold text-[#09090B] mb-4">Exclusive Coupons & Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer) => (
                <div
                  key={offer.code}
                  className="bg-[#F9FAFB] border-2 border-dashed border-[#E5E7EB] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm"
                >
                  {/* Visual cutouts for ticket look */}
                  <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-white border-r border-[#E5E7EB] transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-white border-l border-[#E5E7EB] transform -translate-y-1/2"></div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-1 rounded-full bg-black/5 text-[#09090B] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <FiTag /> {offer.category}
                      </span>
                      <span className="text-xs text-[#71717A] font-medium">{offer.expiry}</span>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-black text-[#09090B] tracking-tight">{offer.discount}</h3>
                      <p className="text-xs text-[#71717A] mt-1">{offer.description}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-4">
                    <div>
                      <span className="block text-[10px] text-[#71717A] uppercase font-bold tracking-wider font-mono">Min Spend</span>
                      <span className="text-xs font-extrabold text-[#09090B]">{offer.minSpend}</span>
                    </div>
                    
                    <button
                      onClick={() => handleCopyCode(offer.code)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        copiedCode === offer.code
                          ? 'bg-emerald-600 text-white'
                          : 'bg-black text-white hover:bg-black/90'
                      }`}
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <FiCheck className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <FiCopy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-8">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl font-extrabold text-black">Loyalty Rewards Hub</h2>
            <p className="text-xs text-[#71717A]">Fulfill shopping quests, scratch mystery cards, and redeem your earned gold points for store credits.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Quests Checklist */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6">
                  <h3 className="text-sm font-extrabold text-black uppercase tracking-wider mb-4 flex items-center gap-2">
                    🎯 Daily Rewards Quests
                  </h3>
                  <div className="space-y-4">
                    {quests.map((q) => (
                      <div key={q.id} className="flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
                        <div className="space-y-1 pr-4">
                          <span className="block text-[9px] text-[#71717A] font-bold uppercase tracking-wider">Quest #{q.id}</span>
                          <span className="text-xs font-bold text-black block">{q.title}</span>
                          <span className="inline-block text-[10px] text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded font-black font-mono">+{q.reward} Pts</span>
                        </div>
                        
                        <div>
                          {q.claimed ? (
                            <span className="text-xs text-zinc-400 font-bold flex items-center gap-1">
                              <FiCheckCircle className="text-emerald-500" /> Claimed
                            </span>
                          ) : q.completed ? (
                            <button
                              onClick={() => handleClaimReward(q.id, q.reward)}
                              className="bg-emerald-600 text-white hover:bg-emerald-700 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shadow-sm"
                            >
                              Claim Reward
                            </button>
                          ) : (
                            <span className="text-[10px] text-[#71717A] bg-zinc-100 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider">
                              Incomplete
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badge Shelf */}
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6">
                  <h3 className="text-sm font-extrabold text-black uppercase tracking-wider mb-4">🏆 Unlocked Badges Shelf</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { name: "Deal Hunter", desc: "Redeemed points for voucher", unlocked: loyaltyPoints < 520, icon: "🏷️" },
                      { name: "Super Stylist", desc: "Used Customizer Studio", unlocked: cartItems?.some(item => item.engraving), icon: "🎨" },
                      { name: "Negotiator", desc: "Bargained with MartAI", unlocked: true, icon: "🤝" },
                      { name: "Elite Spinner", desc: "Used spin-the-wheel reward", unlocked: true, icon: "🎡" }
                    ].map((badge) => (
                      <div 
                        key={badge.name} 
                        className={`p-4 rounded-2xl border text-center transition-all ${
                          badge.unlocked 
                            ? 'bg-white border-[#E5E7EB] shadow-sm hover:scale-105' 
                            : 'bg-zinc-50 border-zinc-150 opacity-50'
                        }`}
                      >
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h4 className="text-xs font-extrabold text-black">{badge.name}</h4>
                        <p className="text-[9px] text-[#71717A] mt-1">{badge.desc}</p>
                        <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-2 ${
                          badge.unlocked ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-200 text-zinc-650'
                        }`}>
                          {badge.unlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Scratch Card */}
              <div className="space-y-6">
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 flex flex-col items-center text-center shadow-sm">
                  <span className="text-[10px] text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full font-black uppercase tracking-widest block mb-3">
                    🎰 MYSTERY BONANZA
                  </span>
                  <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-1">Scratch & Win</h3>
                  <p className="text-[11px] text-[#71717A] mb-4">Hold left-click and drag across the silver overlay to reveal a surprise code.</p>

                  {!scratchedReward ? (
                    <div style={{ position: 'relative', width: '260px', height: '140px', overflow: 'hidden', borderRadius: '16px', border: '1px solid #E5E7EB', background: '#FAFAFA' }}>
                      <canvas
                        ref={canvasRef}
                        width={260}
                        height={140}
                        onMouseDown={() => setIsScratching(true)}
                        onMouseUp={() => setIsScratching(false)}
                        onMouseLeave={() => setIsScratching(false)}
                        onMouseMove={handleScratchMove}
                        onTouchStart={() => setIsScratching(true)}
                        onTouchEnd={() => setIsScratching(false)}
                        onTouchMove={handleScratchMove}
                        style={{ cursor: 'crosshair', display: 'block' }}
                      />
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 w-[260px] h-[140px] flex flex-col justify-center items-center shadow-inner"
                    >
                      <span className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-widest">Reward Unlocked!</span>
                      <span className="text-3xl font-black text-black font-mono my-1 tracking-wider">SCRATCH10</span>
                      <span className="text-xs text-zinc-600 font-bold">$10 Off Coupon & +100 Pts</span>
                    </motion.div>
                  )}
                  
                  <div className="mt-4 p-3 bg-white border border-[#E5E7EB] rounded-2xl w-full text-left">
                    <span className="block text-[9px] text-[#71717A] uppercase font-bold tracking-wider mb-1">Status</span>
                    <p className="text-xs text-black font-semibold">
                      {scratchedReward ? "Ticket fully redeemed!" : "Ticket pristine. Ready to scratch."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl font-extrabold text-black">Personalized Spending & Savings</h2>
            <p className="text-xs text-[#71717A]">Analyze your shopping categories, active budgets, and savings from smart wheel spins and bargaining.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Spending Charts */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6">
                  <h3 className="text-sm font-extrabold text-black uppercase tracking-wider mb-6">
                    📊 Category Distribution
                  </h3>
                  
                  {/* Custom CSS Bar Chart */}
                  <div className="space-y-4">
                    {[
                      { category: "Smart Watches & Accessories", pct: 45, spent: 189.99, color: "#000000" },
                      { category: "Curated Apparel & Clothing", pct: 30, spent: 126.66, color: "#4B5563" },
                      { category: "Curated Leather Goods", pct: 15, spent: 63.33, color: "#9CA3AF" },
                      { category: "Others", pct: 10, spent: 42.22, color: "#D1D5DB" }
                    ].map((item) => (
                      <div key={item.category} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-black">
                          <span>{item.category}</span>
                          <span>${item.spent.toFixed(2)} ({item.pct}%)</span>
                        </div>
                        <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Budget Tracker */}
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-extrabold text-black uppercase tracking-wider">
                      Target Monthly Budget
                    </h3>
                    <span className="text-xs font-bold text-black">$500.00 Target</span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-[#71717A] mb-2 font-bold">
                    <span>Spent: ${totalSpent}</span>
                    <span>Remaining: ${(500 - Number(totalSpent)).toFixed(2)}</span>
                  </div>

                  <div className="w-full bg-[#E5E7EB] h-3.5 rounded-full overflow-hidden mb-3">
                    <div 
                      className="bg-black h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((Number(totalSpent) / 500) * 100, 100)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-[#71717A]">
                    {Number(totalSpent) < 400 
                      ? "👍 You are well within your budget limits this month. Smart shopping!" 
                      : "⚠️ Budget warning! You've used over 80% of your current monthly shopping cap."}
                  </p>
                </div>
              </div>

              {/* Right Column: Savings advisor and details */}
              <div className="space-y-6">
                {/* Circular Savings ring representation */}
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 flex flex-col items-center text-center">
                  <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Total Discount Savings</h3>
                  
                  <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* SVG Circular indicator */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="65" cy="65" r="54" stroke="#E5E7EB" strokeWidth="10" fill="transparent" />
                      <circle cx="65" cy="65" r="54" stroke="#10B981" strokeWidth="10" fill="transparent"
                        strokeDasharray={Math.PI * 2 * 54}
                        strokeDashoffset={Math.PI * 2 * 54 * (1 - 0.72)}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="block text-2xl font-black text-black">72%</span>
                      <span className="block text-[8px] text-[#71717A] font-bold uppercase tracking-wider">Savings Rate</span>
                    </div>
                  </div>

                  <p className="text-xs text-black font-semibold mt-4">
                    Saved <strong className="text-emerald-600 font-extrabold">$48.50</strong> on coupons & spin rewards!
                  </p>
                </div>

                {/* Savings Advisor */}
                <div className="bg-[#09090B] text-white border border-[#E5E7EB] rounded-3xl p-6 space-y-3">
                  <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-widest block w-fit">
                    AI SMART ADVISOR
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wide">Tips for Next Purchases</h4>
                  <ul className="text-xs text-[#A1A1AA] space-y-2 list-disc pl-4 font-medium">
                    <li>Add 1 more item to bag to complete quest #4 (+$200 Pts).</li>
                    <li>Claim your completed Master Negotiator reward for +150 Pts.</li>
                    <li>Redeem your points for fixed voucher coupons to optimize checkout discounts.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Profile Info Details */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-sm max-w-xl">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-bold text-[#09090B] mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#71717A] uppercase tracking-wider mb-1">User name</label>
                  <p className="text-sm font-semibold text-[#09090B]">{userInfo?.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#71717A] uppercase tracking-wider mb-1">Email address</label>
                  <p className="text-sm font-semibold text-[#09090B]">{userInfo?.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#71717A] uppercase tracking-wider mb-1">Assigned role</label>
                  <p className="text-sm font-semibold uppercase text-black tracking-wide">{userInfo?.role}</p>
                </div>
              </div>
            </div>

            {/* Saved Shipping Addresses */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  <FiMapPin /> Shipping Addresses
                </h3>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="bg-black text-white hover:bg-black/90 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <FiPlus /> Add Address
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div key={addr.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 relative">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                      title="Delete Address"
                    >
                      <FiTrash size={14} />
                    </button>
                    <span className="font-extrabold text-sm text-black block mb-2">{addr.name}</span>
                    <p className="text-xs text-[#71717A]">{addr.street}</p>
                    <p className="text-xs text-[#71717A] mb-3">{addr.city}</p>
                    <p className="text-xs font-semibold text-[#09090B]">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Payment Cards with CSS Cards layout */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  <FiCreditCard /> Payment Methods
                </h3>
                <button
                  onClick={() => setShowAddCardModal(true)}
                  className="bg-black text-white hover:bg-black/90 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <FiPlus /> Add Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                  <div 
                    key={card.id}
                    style={{ background: card.gradient }}
                    className="rounded-2xl p-6 text-white h-48 flex flex-col justify-between relative shadow-md overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold tracking-wider">{card.brand}</span>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-white/70 hover:text-white"
                        title="Delete Card"
                      >
                        <FiTrash size={14} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <span className="text-lg font-mono tracking-widest block">{card.number}</span>
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="block text-[8px] text-white/50 uppercase">Card Holder</span>
                          <span className="text-xs font-semibold">{card.holder}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-white/50 uppercase">Expires</span>
                          <span className="text-xs font-semibold">{card.expiry}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-black">Add Shipping Address</h3>
              <button onClick={() => setShowAddAddressModal(false)} className="text-[#71717A] hover:text-black">
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#71717A] mb-1">Address Label</label>
                <input 
                  type="text" required value={addrName} onChange={e=>setAddrName(e.target.value)}
                  placeholder="e.g. Home, Office"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-black px-4 py-2.5 rounded-xl text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#71717A] mb-1">Street Address</label>
                <input 
                  type="text" required value={addrStreet} onChange={e=>setAddrStreet(e.target.value)}
                  placeholder="e.g. 123 Luxury Ave"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-black px-4 py-2.5 rounded-xl text-xs outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#71717A] mb-1">City</label>
                  <input 
                    type="text" required value={addrCity} onChange={e=>setAddrCity(e.target.value)}
                    placeholder="e.g. Kathmandu"
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-black px-4 py-2.5 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#71717A] mb-1">Phone Number</label>
                  <input 
                    type="text" required value={addrPhone} onChange={e=>setAddrPhone(e.target.value)}
                    placeholder="e.g. +977 9801..."
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-black px-4 py-2.5 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-black text-white hover:bg-black/90 py-3 rounded-xl text-xs font-bold transition-all mt-4"
              >
                Save Shipping Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-black">Add Saved Card</h3>
              <button onClick={() => setShowAddCardModal(false)} className="text-[#71717A] hover:text-black">
                <FiX size={18} />
              </button>
            </div>
            
            {/* Live Card Preview */}
            <div 
              style={{ background: 'linear-gradient(135deg, #09090B 0%, #27272A 100%)' }}
              className="rounded-2xl p-6 text-white h-44 flex flex-col justify-between mb-6 shadow-md"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold tracking-wider">{cardBrand}</span>
              </div>
              <div className="space-y-4">
                <span className="text-base font-mono tracking-widest block">
                  {cardNumber ? cardNumber.replace(/(.{4})/g, '$1 ') : '•••• •••• •••• ••••'}
                </span>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-[7px] text-white/50 uppercase">Card Holder</span>
                    <span className="text-[11px] font-semibold">{cardHolder || 'FULL NAME'}</span>
                  </div>
                  <div>
                    <span className="block text-[7px] text-white/50 uppercase">Expires</span>
                    <span className="text-[11px] font-semibold">{cardExpiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#71717A] mb-1">Card Brand</label>
                  <select 
                    value={cardBrand} onChange={e=>setCardBrand(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-black px-4 py-2.5 rounded-xl text-xs outline-none"
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#71717A] mb-1">Expiry Date</label>
                  <input 
                    type="text" required maxLength={5} value={cardExpiry} onChange={e=>setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-black px-4 py-2.5 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#71717A] mb-1">Card Number</label>
                <input 
                  type="text" required maxLength={16} value={cardNumber} onChange={e=>setCardNumber(e.target.value.replace(/\D/g,''))}
                  placeholder="16-digit card number"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-black px-4 py-2.5 rounded-xl text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#71717A] mb-1">Card Holder Name</label>
                <input 
                  type="text" required value={cardHolder} onChange={e=>setCardHolder(e.target.value)}
                  placeholder="Holder's full name"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] text-black px-4 py-2.5 rounded-xl text-xs outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-black text-white hover:bg-black/90 py-3 rounded-xl text-xs font-bold transition-all mt-4"
              >
                Add Card Securely
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
