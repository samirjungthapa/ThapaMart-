import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiGift, FiZap, FiCheckCircle, FiCompass, FiUsers, FiDisc } from 'react-icons/fi';
import { playClick, playSuccess } from '../utils/audio.js';

const LoyaltyHub = () => {
  const [claimedQuests, setClaimedQuests] = useState([]);
  const [xp, setXp] = useState(720);
  const [points, setPoints] = useState(2450);

  const level = 4;
  const nextLevelXp = 1000;
  const progressPercent = (xp / nextLevelXp) * 100;

  const badges = [
    { id: 'first_buy', name: 'First Buy', desc: 'Placed your first order', icon: <FiCheckCircle />, unlocked: true },
    { id: 'spinner', name: 'Wheel Spinner', desc: 'Spinned the wheel of fortune', icon: <FiDisc />, unlocked: true },
    { id: 'ar_try', name: 'AR Trendsetter', desc: 'Tried on items in AR mode', icon: <FiCompass />, unlocked: true },
    { id: 'co_shop', name: 'Social Shopper', desc: 'Joined a collaborative room', icon: <FiUsers />, unlocked: false },
    { id: 'vip', name: 'VIP Status', desc: 'Spent over Rs. 50,000', icon: <FiAward />, unlocked: false },
    { id: 'gift_god', name: 'Gift Master', desc: 'Redeemed 3 reward codes', icon: <FiGift />, unlocked: false }
  ];

  const quests = [
    { id: 'q1', title: 'Spin the Fortune Wheel', xp: 50, points: 100, desc: 'Try your luck at checkout to get a discount coupon.' },
    { id: 'q2', title: 'Initiate a Collaborative Shop', xp: 100, points: 250, desc: 'Create a live shopping room and invite a partner.' },
    { id: 'q3', title: 'Product Details Customization', xp: 30, points: 50, desc: 'Engrave text on your custom model in the 3D Studio.' }
  ];

  const claimQuest = (questId, questPoints, questXp) => {
    if (claimedQuests.includes(questId)) return;
    playSuccess();
    setClaimedQuests([...claimedQuests, questId]);
    setPoints(prev => prev + questPoints);
    setXp(prev => {
      const nextXp = prev + questXp;
      return nextXp >= nextLevelXp ? nextXp - nextLevelXp : nextXp;
    });
  };

  return (
    <div className="min-h-screen py-12 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-10 p-8 md:p-12 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border border-indigo-500/20">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-xl">
            <span className="px-3 py-1 text-[10px] font-bold bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full uppercase tracking-wider">
              ThapaMart Club Elite
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mt-4">
              Your Rewards Dashboard
            </h1>
            <p className="text-sm text-slate-300 mt-2">
              Earn XP and MartPoints on every action. Level up to unlock premium discounts, early product drops, and exclusive free shipping tiers.
            </p>
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Level Circle Progress Card */}
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Club Progress</h3>
            
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="64" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                <motion.circle
                  cx="72"
                  cy="72"
                  r="64"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 64}
                  initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - progressPercent / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{level}</span>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Level</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-6 font-semibold">
              {xp} / {nextLevelXp} XP to Level {level + 1}
            </p>
          </div>

          {/* Points Card */}
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Available Balance</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
                  {points.toLocaleString()}
                </span>
                <span className="text-xs text-yellow-400 font-bold uppercase">MartPoints</span>
              </div>
            </div>
            <div className="mt-8 border-t border-slate-800 pt-6">
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Redeem your points at checkout for direct store credit or unique accessory bundles.
              </p>
              <button 
                onClick={() => { playClick(); }}
                className="w-full py-3 text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200"
              >
                Browse Reward Store
              </button>
            </div>
          </div>

          {/* Quests / Active Challenges */}
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Active Quests</h3>
              <div className="space-y-4">
                {quests.map((q) => {
                  const isClaimed = claimedQuests.includes(q.id);
                  return (
                    <div key={q.id} className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-white">{q.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{q.desc}</p>
                      </div>
                      <button
                        disabled={isClaimed}
                        onClick={() => claimQuest(q.id, q.points, q.xp)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${
                          isClaimed
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                        }`}
                      >
                        {isClaimed ? 'Claimed' : `+${q.points} P`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Scratch & Win Game */}
        <ScratchCard rewardPoints={500} onRedeem={(p) => setPoints(prev => prev + p)} />

        {/* Badges / Milestones Section */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <FiAward className="text-indigo-400" /> Unlockable Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`border p-6 rounded-2xl flex flex-col items-center text-center transition-all ${
                  b.unlocked
                    ? 'bg-slate-900/40 border-indigo-500/20 text-white'
                    : 'bg-slate-950/20 border-slate-900 text-slate-600'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg mb-3 ${
                  b.unlocked ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-900 text-slate-700'
                }`}>
                  {b.icon}
                </div>
                <h4 className="text-xs font-bold">{b.name}</h4>
                <p className="text-[9px] text-slate-400 mt-1 leading-normal">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const ScratchCard = ({ rewardPoints, onRedeem }) => {
  const canvasRef = useRef(null);
  const [scratched, setScratched] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Fill silver background
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add patterns
    ctx.fillStyle = '#A9A9A9';
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.fillRect(i + 5, j + 5, 2, 2);
      }
    }
    
    // Draw guide text
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#555555';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE TO REVEAL', canvas.width / 2, canvas.height / 2);
  }, []);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const draw = (e) => {
    if (!isDrawing.current || scratched) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getMousePos(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
    ctx.fill();
    
    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    if (scratched) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let cleared = 0;
    
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) {
        cleared++;
      }
    }
    
    const percent = (cleared / (pixels.length / 4)) * 100;
    if (percent > 45) {
      setScratched(true);
      playSuccess();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
      <div>
        <span className="px-2.5 py-0.5 text-[9px] font-bold bg-amber-500/10 border border-amber-500/35 text-amber-400 rounded-full uppercase tracking-wider">
          Daily Bonus Game
        </span>
        <h4 className="text-sm font-extrabold text-white mt-2">Elite Scratch & Win Card</h4>
        <p className="text-xs text-slate-400 mt-1 leading-normal max-w-sm font-medium">
          Use your cursor or touchscreen to scratch off the silver layer and unlock high-tier rewards.
        </p>
      </div>
      
      <div className="relative w-[260px] h-[100px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
        {/* Underlay Reward Code */}
        <div className="absolute text-center">
          <span className="text-[9px] text-indigo-400 font-bold tracking-widest block uppercase mb-1">PROMO CODE REVEALED</span>
          <span className="text-xl font-mono font-black text-amber-400 tracking-wider">LUCKY500</span>
          <span className="text-[10px] text-slate-400 block mt-1">+{rewardPoints} MartPoints</span>
        </div>
        
        {/* Canvas overlay */}
        <canvas
          ref={canvasRef}
          width="260"
          height="100"
          onMouseDown={() => { isDrawing.current = true; }}
          onMouseUp={() => { isDrawing.current = false; }}
          onMouseLeave={() => { isDrawing.current = false; }}
          onMouseMove={draw}
          onTouchStart={() => { isDrawing.current = true; }}
          onTouchEnd={() => { isDrawing.current = false; }}
          onTouchMove={draw}
          className={`absolute top-0 left-0 w-full h-full cursor-crosshair z-10 transition-opacity duration-500 ${scratched ? 'opacity-0 pointer-events-none' : ''}`}
        />
      </div>

      <div className="flex-shrink-0">
        <button
          disabled={!scratched || claimed}
          onClick={() => {
            playSuccess();
            onRedeem(rewardPoints);
            setClaimed(true);
          }}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
            claimed
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : scratched
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg'
              : 'bg-slate-900 border border-slate-800 text-slate-650 cursor-not-allowed'
          }`}
        >
          {claimed ? 'Claimed' : scratched ? 'Claim Rewards' : 'Scratch Card First'}
        </button>
      </div>
    </div>
  );
};

export default LoyaltyHub;
