import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get('orderId') || 'unknown';

  return (
    <div className="premium-mesh-bg min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 text-center shadow-premium border border-white/50 dark:border-white/5"
      >
        
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
          <FiCheckCircle className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Payment Success!
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Thank you for choosing ThapaMart. Your order has been placed successfully and is being processed.
        </p>

        {/* Order ID display */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 select-all font-mono">
          Order Reference: {orderId}
        </div>

        {/* CTA buttons */}
        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center py-3 px-6 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-premium transition-all duration-300 hover:scale-102"
          >
            Track in Dashboard
            <FiArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link
            to="/shop"
            className="w-full flex items-center justify-center py-3 px-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-premium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

      </motion.div>

    </div>
  );
};

export default OrderSuccess;
