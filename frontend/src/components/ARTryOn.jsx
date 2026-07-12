import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiX, FiCheck, FiMaximize, FiPlus, FiMinus, FiRotateCw } from 'react-icons/fi';
import { playClick, playSuccess } from '../utils/audio.js';

const ARTryOn = ({ product, isOpen, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [posX, setPosX] = useState(0); // offset from center X
  const [posY, setPosY] = useState(-30); // offset from center Y (starting near face)
  const [isPhotoTaken, setIsPhotoTaken] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  // Auto-detect accessories type to select best image or default
  const productImg = product?.images?.[0] || product?.image;

  // Stop video stream
  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Start webcam
  useEffect(() => {
    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        .then((s) => {
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.error("Webcam access denied: ", err);
        });
    } else {
      stopStream();
      setIsPhotoTaken(false);
      setPhotoUrl(null);
    }
    return () => stopStream();
  }, [isOpen]);

  const captureSnapshot = () => {
    playClick();
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Overlay product image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = productImg;
    img.onload = () => {
      ctx.save();
      const centerX = canvas.width / 2 + posX;
      const centerY = canvas.height / 2 + posY;
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      
      const width = 160 * scale;
      const height = (img.height / img.width) * width;
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();

      const dataUrl = canvas.toDataURL('image/png');
      setPhotoUrl(dataUrl);
      setIsPhotoTaken(true);
      playSuccess();
    };
  };

  const handleDownload = () => {
    if (!photoUrl) return;
    const link = document.createElement('a');
    link.download = `thapamart-tryon-${product?.title || 'item'}.png`;
    link.href = photoUrl;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { stopStream(); onClose(); }}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        />

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 w-full max-w-2xl flex flex-col relative max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">ThapaMart Interactive AR</span>
              <h3 className="text-lg font-black text-white">Virtual Try-On: {product?.title || 'Premium Accessory'}</h3>
            </div>
            <button
              onClick={() => { stopStream(); onClose(); }}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* AR Frame area */}
          <div className="relative flex-grow flex items-center justify-center bg-slate-950 p-2 min-h-[300px]">
            {!isPhotoTaken ? (
              <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                
                {/* Dynamic Product Overlay */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: `calc(50% + ${posY}px)`,
                    left: `calc(50% + ${posX}px)`,
                    width: `${160 * scale}px`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    cursor: 'move',
                  }}
                  drag
                  dragMomentum={false}
                  onDrag={(event, info) => {
                    setPosX(prev => prev + info.delta.x);
                    setPosY(prev => prev + info.delta.y);
                  }}
                  className="pointer-events-auto"
                >
                  <img
                    src={productImg}
                    alt=""
                    className="w-full h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 border border-indigo-500/30 rounded-lg hover:border-indigo-500 transition-colors pointer-events-none" />
                </motion.div>
                
                <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-[10px] text-indigo-400 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Live View - Drag to position item
                </span>
              </div>
            ) : (
              <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15">
                <img src={photoUrl} alt="Captured preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 left-3 bg-emerald-500/90 text-[10px] text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Snapshot Captured!
                </span>
              </div>
            )}

            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} width="640" height="480" className="hidden" />
          </div>

          {/* Controls */}
          <div className="p-6 bg-slate-900/50 border-t border-white/10 space-y-4">
            {!isPhotoTaken ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Scale control */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Scale Size</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg"><FiMinus size={12} /></button>
                      <span className="text-xs font-bold text-white min-w-[35px] text-center">{Math.round(scale * 100)}%</span>
                      <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg"><FiPlus size={12} /></button>
                    </div>
                  </div>

                  {/* Rotation control */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rotate</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setRotation(r => r - 10)} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg"><FiRotateCw size={12} className="scale-x-[-1]" /></button>
                      <span className="text-xs font-bold text-white min-w-[35px] text-center">{rotation}°</span>
                      <button onClick={() => setRotation(r => r + 10)} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg"><FiRotateCw size={12} /></button>
                    </div>
                  </div>

                  {/* Reset Control */}
                  <div className="col-span-2 md:col-span-1 flex items-end">
                    <button
                      onClick={() => { setScale(1); setRotation(0); setPosX(0); setPosY(-30); }}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Reset Alignment
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <p className="text-[11px] text-slate-500">Enable webcam & align product correctly before capturing snapshot.</p>
                  <button
                    onClick={captureSnapshot}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-black shadow-premium"
                  >
                    <FiCamera />
                    <span>Capture Photo</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsPhotoTaken(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold"
                >
                  Retake Photo
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-premium"
                  >
                    Save to Device
                  </button>
                  <button
                    onClick={() => { stopStream(); onClose(); }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                  >
                    Keep & Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ARTryOn;
