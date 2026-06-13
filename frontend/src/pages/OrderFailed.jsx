import React from 'react';
import { Link } from 'react-router-dom';
import { FiXCircle, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

const OrderFailed = () => {
  return (
    <div className="premium-mesh-bg min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 text-center shadow-premium border border-white/50 dark:border-white/5"
      >
        
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center mb-6">
          <FiXCircle className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Transaction Failed
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Your payment could not be processed. Please check your credit card details or contact support.
        </p>

        {/* CTA buttons */}
        <div className="space-y-3 mt-8">
          <Link
            to="/cart"
            className="w-full flex items-center justify-center py-3 px-6 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-premium transition-all duration-300 hover:scale-102"
          >
            <FiArrowLeft className="mr-2 w-4 h-4" />
            Return to Cart
          </Link>
          <Link
            to="/shop"
            className="w-full flex items-center justify-center py-3 px-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-premium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Go to Shop
          </Link>
        </div>

      </motion.div>

    </div>
  );
};

export default OrderFailed;
