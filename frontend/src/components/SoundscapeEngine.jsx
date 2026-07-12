import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FiMusic, FiVolumeX, FiVolume2 } from 'react-icons/fi';
import { startAmbientLoop, stopAmbientLoop, isMuted, setMuted, playClick } from '../utils/audio.js';
import api from '../store/api.js';

const SoundscapeEngine = () => {
  const location = useLocation();
  const { id } = useParams();
  const [muted, setMutedState] = useState(isMuted());
  const [category, setCategory] = useState('default');

  // Handle mute toggling
  const toggleMute = () => {
    playClick();
    const nextMute = !muted;
    setMuted(nextMute);
    setMutedState(nextMute);
    if (nextMute) {
      stopAmbientLoop();
    } else {
      startAmbientLoop(category);
    }
  };

  // Determine current shopping category based on routes
  useEffect(() => {
    const fetchCategoryAndPlay = async () => {
      let currentCategory = 'default';
      
      // If we are looking at a specific product, fetch its details to determine category
      if (location.pathname.startsWith('/product/') && id) {
        try {
          const { data } = await api.get(`/products/${id}`);
          if (data && data.category) {
            currentCategory = data.category;
          }
        } catch (e) {
          console.warn("Could not determine product category for soundscape:", e);
        }
      } else if (location.pathname.startsWith('/shop')) {
        const params = new URLSearchParams(location.search);
        currentCategory = params.get('category') || 'shop';
      }

      setCategory(currentCategory);
      
      if (!muted) {
        startAmbientLoop(currentCategory);
      }
    };

    fetchCategoryAndPlay();

    return () => {
      stopAmbientLoop();
    };
  }, [location.pathname, location.search, id, muted]);

  return (
    <div className="fixed bottom-24 left-6 z-40">
      <button
        onClick={toggleMute}
        title={muted ? "Enable Ambient Soundscapes" : "Mute Soundscapes"}
        className={`p-3 rounded-full flex items-center justify-center shadow-premium border transition-all ${
          muted 
            ? 'bg-slate-900/90 dark:bg-slate-950/90 border-white/10 text-slate-400' 
            : 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400/25 text-white scale-105'
        }`}
      >
        {muted ? <FiVolumeX size={16} /> : (
          <div className="flex items-center gap-1.5">
            <FiVolume2 size={16} className="animate-bounce" />
            <div className="flex gap-0.5 items-end h-3">
              <span className="w-0.5 h-1 bg-white animate-[pulse_0.4s_infinite]" />
              <span className="w-0.5 h-2 bg-white animate-[pulse_0.6s_infinite_delay-100]" />
              <span className="w-0.5 h-3 bg-white animate-[pulse_0.5s_infinite_delay-200]" />
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default SoundscapeEngine;
