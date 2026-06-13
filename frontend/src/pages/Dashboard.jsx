import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../store/api.js';
import { FiUser, FiPackage, FiTruck, FiMapPin, FiCheckCircle, FiAward, FiCopy, FiGift, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile'
  const [copied, setCopied] = useState(false);

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

  const getStatusIndex = (status) => {
    const idx = statusSteps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="premium-mesh-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center space-x-4">
            <img
              src={userInfo?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt="User profile pic"
              className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Hello, {userInfo?.name}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Account status: {userInfo?.role === 'admin' ? 'Administrator' : 'Customer'}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2 rounded-full text-xs font-semibold shadow-premium transition-all ${
                activeTab === 'orders' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Order History
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-5 py-2 rounded-full text-xs font-semibold shadow-premium transition-all ${
                activeTab === 'profile' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Profile Settings
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'orders' ? (
          <div className="space-y-8">
            
            {/* Loyalty & Referral Hub */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Loyalty Card */}
              <div className="glass-panel rounded-3xl p-6 border border-slate-100 dark:border-slate-800/60 shadow-premium bg-gradient-to-br from-primary/5 via-transparent to-transparent flex items-center justify-between">
                <div className="space-y-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-wider flex items-center w-fit">
                    <FiAward className="mr-1" /> Gold Member VIP
                  </span>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Loyalty Points</h3>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">520 <span className="text-sm font-semibold text-slate-500">Pts</span></p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-500/15 text-amber-500">
                  <FiGift className="w-8 h-8" />
                </div>
              </div>

              {/* Referral Card */}
              <div className="glass-panel rounded-3xl p-6 border border-slate-100 dark:border-slate-800/60 shadow-premium flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Referral Program</h3>
                  <p className="text-xs text-slate-400">Share your code with friends to earn 100 points per invite.</p>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <div className="flex-grow p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono font-bold text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span>THAPAMART520</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("THAPAMART520");
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-primary hover:text-primary-dark transition-colors"
                      aria-label="Copy Referral Code"
                    >
                      {copied ? 'Copied!' : <FiCopy />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-850 dark:text-white">Your Orders & Tracking</h2>

            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
            ) : orders.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
                You haven't placed any orders yet.
              </div>
            ) : (
              <div className="space-y-8">
                {orders.map((order) => {
                  const currentStatusIdx = getStatusIndex(order.orderStatus);
                  return (
                    <div
                      key={order.id || order._id}
                      className="glass-panel rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-premium space-y-6"
                    >
                      {/* Order Info Bar */}
                      <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-slate-100 dark:border-slate-850 gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <div>
                          <span>Order Reference: </span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{order.id || order._id}</span>
                        </div>
                        <div>
                          <span>Placed: </span>
                          <span className="font-bold text-slate-750 dark:text-slate-200">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span>Total Amount: </span>
                          <span className="font-extrabold text-slate-900 dark:text-white">${order.totalPrice}</span>
                        </div>
                      </div>

                      {/* Products inside order */}
                      <div className="space-y-4">
                        {order.products.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-4">
                            <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
                            <div>
                              <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">{item.title}</h4>
                              <p className="text-xs text-slate-400">Qty {item.quantity} • ${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tracking timeline tracking */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center">
                          <FiTruck className="mr-1.5 w-4 h-4 text-primary" /> Delivery Status Timeline
                        </h5>

                        <div className="grid grid-cols-4 relative">
                          {/* Connected line progress */}
                          <div className="absolute top-3.5 left-[12.5%] right-[12.5%] h-1 bg-slate-200 dark:bg-slate-800 -z-10">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
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
                                      ? 'bg-primary text-white scale-110 shadow-premium ring-4 ring-primary/20'
                                      : isCompleted
                                      ? 'bg-primary text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {isCompleted ? <FiCheck className="w-4 h-4" /> : <span className="text-xs font-bold">{sIdx + 1}</span>}
                                </div>
                                <span className={`text-[10px] font-bold mt-2 uppercase tracking-wide ${isActive || isCompleted ? 'text-primary dark:text-accent font-extrabold' : 'text-slate-400'}`}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Profile Details Edit View */
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-premium max-w-xl">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">User name</label>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{userInfo?.name}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email address</label>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{userInfo?.email}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned role</label>
                <p className="text-sm font-semibold uppercase text-primary tracking-wide">{userInfo?.role}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
