import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Sparkles, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { applyCoupon } from '../store/slices/cartSlice.js';
import { playClick, playSuccess, playTick } from '../utils/audio.js';

const SECTORS = [
  { label: '10% OFF', code: 'THAPA10', percent: 10, color: '#09090B' },
  { label: 'TRY AGAIN', code: null, percent: 0, color: '#E5E7EB' },
  { label: '20% OFF', code: 'THAPA20', percent: 20, color: '#18181B' },
  { label: '5% OFF', code: 'WELCOME5', percent: 5, color: '#D4AF37' },
  { label: 'TRY AGAIN', code: null, percent: 0, color: '#F3F4F6' },
  { label: '15% OFF', code: 'SUPERSAVE', percent: 15, color: '#27272A' },
];

const SpinWheel = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const canvasRef = useRef(null);

  const [rotationDegrees, setRotationDegrees] = useState(0);

  // Check if user has already spun today
  useEffect(() => {
    const lastSpun = localStorage.getItem('lastSpunDate');
    if (lastSpun) {
      const today = new Date().toDateString();
      if (lastSpun === today) {
        setHasSpunToday(true);
      }
    }
  }, []);

  // Draw the wheel using Canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;

    ctx.clearRect(0, 0, size, size);

    const arcSize = (2 * Math.PI) / SECTORS.length;

    SECTORS.forEach((sec, i) => {
      const angle = i * arcSize;
      ctx.beginPath();
      ctx.fillStyle = sec.color;
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, angle, angle + arcSize);
      ctx.lineTo(center, center);
      ctx.fill();

      // Draw lines
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = sec.color === '#E5E7EB' || sec.color === '#F3F4F6' ? '#09090B' : '#FFFFFF';
      ctx.font = 'bold 12px Cormorant Garamond, serif';
      ctx.fillText(sec.label, radius - 20, 5);
      ctx.restore();
    });

    // Draw center pin
    ctx.beginPath();
    ctx.arc(center, center, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#09090B';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [isOpen]);

  const spin = () => {
    if (isSpinning || hasSpunToday) return;
    playClick();
    setIsSpinning(true);
    setPrize(null);

    // Generate random rotation: 5 full spins + random index angle
    const targetIdx = Math.floor(Math.random() * SECTORS.length);
    const degreePerSector = 360 / SECTORS.length;
    // Calculate the angle to align the winning sector with the top pointer (at 270 degrees)
    const targetAngle = 270 - (targetIdx * degreePerSector + degreePerSector / 2);
    const extraSpins = 360 * 5;
    const finalRotation = extraSpins + targetAngle;

    setRotationDegrees(finalRotation);

    // Play physical sound ticks matching ease-out deceleration
    let tickCount = 0;
    const totalTicks = 28;
    const playSpinTicks = (count) => {
      if (count >= totalTicks) return;
      playTick();
      const progress = count / totalTicks;
      const nextDelay = 40 + progress * progress * 500; // decelerates from 40ms to 540ms
      setTimeout(() => {
        playSpinTicks(count + 1);
      }, nextDelay);
    };
    playSpinTicks(0);

    setTimeout(() => {
      setIsSpinning(false);
      const wonPrize = SECTORS[targetIdx];
      setPrize(wonPrize);
      
      if (wonPrize && wonPrize.code) {
        playSuccess();
      } else {
        playClick();
      }
      
      // Mark spun today
      const today = new Date().toDateString();
      localStorage.setItem('lastSpunDate', today);
      setHasSpunToday(true);
    }, 4500);
  };

  return (
    <>
      {/* Floating Gift Trigger Badge */}
      <motion.button
        onClick={() => { playClick(); setIsOpen(true); }}
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          zIndex: 90,
          background: '#09090B',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '9999px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        }}
      >
        <Gift size={18} className="animate-bounce" />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spin & Win</span>
      </motion.button>

      {/* Wheel Modal */}
      <AnimatePresence>
        {isOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!isSpinning) { playClick(); setIsOpen(false); } }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'relative',
                background: '#FFFFFF',
                borderRadius: '1rem',
                padding: '2.5rem 2rem',
                width: '100%',
                maxWidth: '440px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                textAlign: 'center',
                zIndex: 401,
              }}
            >
              {/* Close Button */}
              {!isSpinning && (
                <button
                  onClick={() => { playClick(); setIsOpen(false); }}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center', color: '#D4AF37', marginBottom: '0.5rem' }}>
                  <Sparkles size={18} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#09090B', margin: 0 }}>
                    ThapaMart Rewards
                  </h3>
                  <Sparkles size={18} />
                </div>
                <p style={{ fontSize: '0.8rem', color: '#71717A', margin: 0 }}>
                  Spin once daily to unlock premium discount coupons!
                </p>
              </div>

              {/* Spin Wheel Visuals */}
              <div style={{ position: 'relative', display: 'inline-block', margin: '1rem 0' }}>
                {/* Pointer Arrow */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '12px solid transparent',
                    borderRight: '12px solid transparent',
                    borderTop: '20px solid #EF4444',
                    zIndex: 10,
                  }}
                />

                <motion.div
                  animate={{ rotate: rotationDegrees }}
                  transition={{
                    duration: isSpinning ? 4.5 : 0,
                    ease: [0.25, 0.1, 0.25, 1], // Cubic-bezier deceleration
                  }}
                  style={{ display: 'flex', transformOrigin: 'center' }}
                >
                  <canvas ref={canvasRef} width={280} height={280} style={{ borderRadius: '50%', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} />
                </motion.div>
              </div>

              {/* Action area */}
              <div style={{ marginTop: '1.5rem' }}>
                {hasSpunToday && !prize && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: '#FEF2F2', borderRadius: '0.5rem', color: '#EF4444', fontSize: '0.8rem', fontWeight: 600 }}>
                    <AlertCircle size={16} />
                    You've already had your spin today! Come back tomorrow.
                  </div>
                )}

                {!hasSpunToday && (
                  <button
                    onClick={spin}
                    disabled={isSpinning}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: '#000000',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    {isSpinning ? 'Best of luck...' : 'Spin the Wheel'}
                  </button>
                )}

                {prize && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1rem' }}>
                    {prize.code ? (
                      <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1rem', borderRadius: '0.5rem' }}>
                        <p style={{ fontSize: '0.8rem', color: '#065F46', margin: '0 0 0.25rem 0', fontWeight: 600 }}>CONGRATULATIONS!</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857', margin: '0 0 0.5rem 0' }}>
                          You won {prize.label}!
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#065F46', margin: '0 0 0.75rem 0' }}>
                          Code: <strong className="font-mono">{prize.code}</strong>
                        </p>
                        <button
                          onClick={() => {
                            playSuccess();
                            dispatch(applyCoupon({ code: prize.code, percent: prize.percent }));
                            setCouponApplied(true);
                          }}
                          disabled={couponApplied}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: couponApplied ? '#10B981' : '#09090B',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            cursor: couponApplied ? 'default' : 'pointer',
                            borderRadius: '0.375rem',
                            transition: 'all 0.2s'
                          }}
                        >
                          {couponApplied ? 'Coupon Applied ✓' : 'Apply Discount'}
                        </button>
                      </div>
                    ) : (
                      <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '1rem', borderRadius: '0.5rem' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#52525B', margin: 0 }}>
                          Better luck next time! Remember to try again tomorrow!
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SpinWheel;
