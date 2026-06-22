import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../store/api.js';

const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products', { params: { search: query, limit: 6 } });
        setResults(data.products || []);
        setSelectedIndex(0);
      } catch (err) {
        console.error("Error fetching search results", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        } else if (query.trim()) {
          navigate(`/shop?search=${query}`);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, query]);

  const handleSelect = (product) => {
    navigate(`/products/${product.id || product._id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
            }}
          />

          {/* Dialog Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '640px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #E5E7EB',
              borderRadius: '1rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              zIndex: 201,
              margin: '0 1rem',
            }}
          >
            {/* Search Input Header */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', borderBottom: '1px solid #E5E7EB', padding: '1rem 1.5rem' }}>
              <Search size={22} style={{ color: '#71717A', marginRight: '0.75rem' }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search premium products or type..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flexGrow: 1,
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.1rem',
                  color: '#09090B',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '0.7rem', color: '#A1A1AA', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '2px 6px', marginRight: '0.5rem', fontWeight: 600 }}>
                ESC
              </span>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={18} />
              </button>
            </div>

            {/* Content / Results */}
            <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '1rem' }}>
              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                  <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', border: '2px solid #E5E7EB', borderTopColor: '#000000', animation: 'spin 1s linear infinite' }} />
                </div>
              )}

              {!loading && results.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.65rem', fontWeight: 800, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                    Products found ({results.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {results.map((product, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <div
                          key={product.id || product._id}
                          onClick={() => handleSelect(product)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            background: isSelected ? '#F3F4F6' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                        >
                          <div style={{ width: '40px', height: '50px', borderRadius: '4px', overflow: 'hidden', background: '#F9FAFB', border: '1px solid #E5E7EB', flexShrink: 0 }}>
                            <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ flexGrow: 1 }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#09090B', margin: 0 }}>{product.title}</p>
                            <p style={{ fontSize: '0.75rem', color: '#71717A', margin: 0 }}>{product.category}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#09090B', margin: 0 }}>
                              Rs. {Number(product.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!loading && query.trim() && results.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#71717A' }}>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>No premium products match "{query}"</p>
                  <button onClick={() => { navigate(`/shop?search=${query}`); onClose(); }} style={{ marginTop: '0.5rem', background: 'transparent', border: 'none', color: '#000000', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', borderBottom: '1px solid #000000' }}>
                    Search shop for "{query}"
                  </button>
                </div>
              )}

              {!query.trim() && (
                <div style={{ padding: '1rem 0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#000000' }}>
                    <Sparkles size={16} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Popular Searches</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['Watch', 'Premium Shirt', 'Leather Bag', 'Sneakers'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        style={{
                          background: '#F3F4F6',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#52525B',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#E5E7EB'; e.currentTarget.style.color = '#09090B'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#52525B'; }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ background: '#F9FAFB', borderTop: '1px solid #E5E7EB', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#71717A' }}>
                Use <kbd style={{ padding: '2px 4px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '3px' }}>↓</kbd> <kbd style={{ padding: '2px 4px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '3px' }}>↑</kbd> to navigate, <kbd style={{ padding: '2px 4px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '3px' }}>Enter</kbd> to select.
              </span>
              <button
                onClick={() => {
                  if (query) navigate(`/shop?search=${query}`);
                  else navigate('/shop');
                  onClose();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#000000',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                Go to Shop <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
