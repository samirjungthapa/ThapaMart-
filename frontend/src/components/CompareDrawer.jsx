import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiXCircle, FiStar, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CompareDrawer = ({ compareList, removeFromCompare, clearCompare }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (compareList.length === 0) return null;

  return (
    <>
      {/* Bottom Sticky Floating Indicator */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl">
        <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-glass flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white">
              {compareList.length}
            </span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Items to Compare
            </span>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setIsOpen(true)}
              disabled={compareList.length < 2}
              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed hover:scale-105 transition-all text-white rounded-xl text-xs font-bold shadow-premium"
            >
              {compareList.length < 2 ? 'Select 2+ Items' : 'Compare Now'}
            </button>
            <button
              onClick={clearCompare}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 z-10 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Product Comparison</h3>
                  <p className="text-xs text-slate-500">Compare specs side-by-side to make the smart choice.</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Grid content */}
              <div className="overflow-x-auto p-6 flex-grow">
                <table className="w-full min-w-[700px] border-collapse text-left text-sm text-slate-700 dark:text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="py-4 font-bold text-slate-400 w-1/4">Specification</th>
                      {compareList.map((product) => (
                        <th key={product.id || product._id} className="py-4 px-4 w-1/4 align-top">
                          <div className="relative group">
                            <button
                              onClick={() => removeFromCompare(product.id || product._id)}
                              className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FiX className="w-3.5 h-3.5" />
                            </button>
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-24 h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700 mb-3"
                            />
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs line-clamp-2">
                              {product.title}
                            </h4>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-4 font-bold text-slate-500 dark:text-slate-400">Category</td>
                      {compareList.map((product) => (
                        <td key={product.id || product._id} className="py-4 px-4 font-semibold uppercase text-[10px] text-primary dark:text-accent tracking-wider">
                          {product.category}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-4 font-bold text-slate-500 dark:text-slate-400">Price</td>
                      {compareList.map((product) => (
                        <td key={product.id || product._id} className="py-4 px-4 font-black text-slate-900 dark:text-white text-base">
                          ${product.price}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-4 font-bold text-slate-500 dark:text-slate-400">Ratings</td>
                      {compareList.map((product) => (
                        <td key={product.id || product._id} className="py-4 px-4">
                          <div className="flex items-center space-x-1.5">
                            <FiStar className="w-3.5 h-3.5 text-amber-400 fill-current" />
                            <span className="font-bold">{product.ratings || '5.0'}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-4 font-bold text-slate-500 dark:text-slate-400">Availability</td>
                      {compareList.map((product) => (
                        <td key={product.id || product._id} className="py-4 px-4">
                          {product.stock > 0 ? (
                            <span className="inline-flex items-center text-xs text-emerald-500 font-semibold">
                              <FiCheck className="mr-1 w-3.5 h-3.5" /> In Stock ({product.stock})
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs text-red-500 font-semibold">
                              <FiXCircle className="mr-1 w-3.5 h-3.5" /> Out of stock
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-slate-500 dark:text-slate-400">Description</td>
                      {compareList.map((product) => (
                        <td key={product.id || product._id} className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed align-top">
                          {product.description}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CompareDrawer;
