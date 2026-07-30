import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiCheck, FiArrowRight, FiTruck, FiAlertCircle } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { applyCoupon } from '../store/slices/cartSlice.js';
import { playClick, playSuccess } from '../utils/audio.js';

const SmartCartOptimizer = ({ cartItems, subtotal, currentCoupon, onApplied }) => {
  const dispatch = useDispatch();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizerLogs, setOptimizerLogs] = useState('');
  const [optimized, setOptimized] = useState(false);

  const shippingThreshold = 10000;
  const remainingForFreeShipping = Math.max(shippingThreshold - subtotal, 0);

  const runOptimizer = () => {
    playClick();
    setIsOptimizing(true);
    setOptimizerLogs('Analyzing cart structure...');

    setTimeout(() => {
      setOptimizerLogs('Checking free shipping threshold...');
    }, 400);

    setTimeout(() => {
      setOptimizerLogs('Searching best available promo codes...');
    }, 800);

    setTimeout(() => {
      // Apply the best coupon automatically
      let bestCode = 'THAPA10';
      let discountPercent = 10;
      
      if (subtotal > 5000) {
        bestCode = 'SMART20';
        discountPercent = 20;
      }
      
      dispatch(applyCoupon({ code: bestCode, percent: discountPercent }));
      setOptimizerLogs(`Successfully applied ${bestCode}!`);
      setIsOptimizing(false);
      setOptimized(true);
      playSuccess();
      if (onApplied) onApplied(`Code ${bestCode} applied automatically!`);
    }, 1500);
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-indigo-500/20 p-5 rounded-2xl shadow-premium space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
          <FiCpu size={15} />
        </div>
        <h4 className="text-xs font-black uppercase tracking-wider text-white">Smart Cart Optimizer</h4>
      </div>

      <div className="space-y-2">
        {/* Free Shipping Progress bar */}
        {remainingForFreeShipping > 0 ? (
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
              <FiTruck className="text-amber-500" /> Free Shipping Threshold
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-1">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
              Add <span className="text-indigo-400 font-black">Rs. {remainingForFreeShipping.toLocaleString()}</span> more to unlock free shipping.
            </p>
          </div>
        ) : (
          <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20 flex items-center gap-2">
            <FiCheck className="text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Free Shipping Unlocked!</span>
          </div>
        )}

        {/* Coupon Optimization Status */}
        {!currentCoupon && !optimized && (
          <button
            onClick={runOptimizer}
            disabled={isOptimizing}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all cursor-pointer"
          >
            {isOptimizing ? (
              <>
                <FiCpu className="animate-spin text-white" />
                <span className="text-[10px]">{optimizerLogs}</span>
              </>
            ) : (
              <>
                Optimize Cart Discounts <FiArrowRight />
              </>
            )}
          </button>
        )}

        {currentCoupon && (
          <div className="bg-indigo-950/20 p-3 rounded-xl border border-indigo-500/20 flex items-center justify-between gap-2">
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Best Discount Active ({currentCoupon.code})</span>
            <span className="text-[10px] text-indigo-400 font-black">{currentCoupon.percent}% OFF</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartCartOptimizer;
