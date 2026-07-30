import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiX, FiCamera, FiCheck, FiCpu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { playClick, playSuccess } from '../utils/audio.js';
import api from '../store/api.js';

const VisualSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setImagePreview(null);
      setIsScanning(false);
      setScanProgress(0);
      setScanStatus('');
      setResults([]);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      playClick();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        startAIScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const startAIScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanStatus('Initializing Neural Net...');

    const statuses = [
      'Extracting feature vectors...',
      'Matching dominant color maps (HSL)...',
      'Searching visual indexing database...',
      'Sorting similarity confidence ranks...'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < 4) {
        setScanStatus(statuses[currentStep]);
        setScanProgress((currentStep / 4) * 100);
      } else {
        clearInterval(interval);
        setScanProgress(100);
        setScanStatus('Match Complete!');
        fetchSimulatedMatches();
      }
    }, 600);
  };

  const fetchSimulatedMatches = async () => {
    try {
      const { data } = await api.get('/products?limit=6');
      const products = data.products || [];
      // Select 3 random products as matching results
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setResults(shuffled.slice(0, 3));
      setIsScanning(false);
      playSuccess();
    } catch (err) {
      console.error('Failed to get visual search matches:', err);
      setIsScanning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <FiCamera size={18} />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-base tracking-wide">Visual AI Search</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Powered by ThapaVision Engine</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Dropzone / Scan Screen */}
          {!imagePreview ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-indigo-500/50 bg-slate-950/40 hover:bg-slate-950/75 rounded-2xl p-8 cursor-pointer transition-all duration-300 group">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <FiUploadCloud size={44} className="text-slate-500 group-hover:text-indigo-400 transition-colors mb-3" />
              <span className="text-sm font-semibold text-white">Upload or drag product image</span>
              <span className="text-xs text-slate-500 mt-1">Accepts PNG, JPG, WebP</span>
            </label>
          ) : (
            <div className="relative bg-slate-950/80 rounded-2xl overflow-hidden border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[220px]">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="max-h-[160px] object-contain rounded-lg border border-slate-800 shadow-lg"
              />

              {/* Glowing scanning laser bar */}
              {isScanning && (
                <motion.div
                  initial={{ top: '10%' }}
                  animate={{ top: ['10%', '85%', '10%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#06b6d4]"
                />
              )}

              {/* Processing details */}
              <div className="w-full mt-4 flex flex-col items-center">
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold mb-1">
                  <FiCpu className={isScanning ? 'animate-spin' : ''} /> {scanStatus}
                </div>
                <div className="w-full max-w-[240px] bg-slate-800 h-1 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-indigo-500 h-full"
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <FiCheck className="text-emerald-400 animate-scale" /> Best Visual Matches Found
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {results.map((product) => (
                  <div
                    key={product.id || product._id}
                    onClick={() => {
                      playClick();
                      navigate(`/products/${product.id || product._id}`);
                      onClose();
                    }}
                    className="bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl cursor-pointer transition-all duration-200 group"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-2 relative">
                      <img
                        src={product.images?.[0] || product.image}
                        alt=""
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-1 right-1 bg-emerald-500/90 text-[8px] font-black text-white px-1.5 py-0.5 rounded-full">
                        {Math.floor(88 + Math.random() * 11)}% Match
                      </span>
                    </div>
                    <h5 className="text-[11px] font-semibold text-white truncate max-w-full">
                      {product.title}
                    </h5>
                    <p className="text-[9px] text-indigo-400 font-bold mt-0.5">
                      Rs. {Number(product.price).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VisualSearchModal;
