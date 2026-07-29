import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiMusic, FiVolumeX, FiVolume2, FiSettings } from 'react-icons/fi';
import { startAmbientLoop, stopAmbientLoop, isMuted, setMuted, playClick, getAmbientVolume, setAmbientVolume } from '../utils/audio.js';
import api from '../store/api.js';

const SoundscapeEngine = () => {
  const location = useLocation();
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [muted, setMutedState] = useState(isMuted());
  const [category, setCategory] = useState(localStorage.getItem('soundscapeCategory') || 'default');
  const [volume, setVolume] = useState(getAmbientVolume());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setMutedState(isMuted());
      setVolume(getAmbientVolume());
      setCategory(localStorage.getItem('soundscapeCategory') || 'default');
    };
    window.addEventListener('soundscape_settings_synced', handleSync);
    return () => window.removeEventListener('soundscape_settings_synced', handleSync);
  }, []);

  const syncPreferences = (updates) => {
    if (userInfo) {
      api.put('/auth/preferences', updates)
        .catch((e) => console.warn("Failed to sync preferences:", e));
    }
  };

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
    syncPreferences({ soundscapeMuted: nextMute });
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setAmbientVolume(newVol);
    syncPreferences({ soundscapeVolume: newVol });
  };

  const handleTrackChange = (e) => {
    playClick();
    const newTrack = e.target.value;
    setCategory(newTrack);
    localStorage.setItem('soundscapeCategory', newTrack);
    if (!muted) {
      startAmbientLoop(newTrack);
    }
    syncPreferences({ soundscapeTrack: newTrack });
  };

  // Determine current shopping category based on routes
  useEffect(() => {
    const fetchCategoryAndPlay = async () => {
      let currentCategory = category !== 'default' && category !== 'shop' ? category : 'default';
      
      // Only auto-switch track if user hasn't explicitly set a track
      if (category === 'default' || category === 'shop') {
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
    <div className="fixed bottom-24 left-6 z-40 flex items-center gap-2">
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

      {!muted && (
        <div className="relative">
          <button
            onClick={() => { playClick(); setShowSettings(!showSettings); }}
            title="Soundscape Settings"
            className="p-2.5 rounded-full bg-slate-900/90 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center justify-center"
          >
            <FiSettings size={14} className={showSettings ? 'rotate-90 transition-transform duration-300' : 'transition-transform duration-300'} />
          </button>

          {showSettings && (
            <div className="absolute bottom-12 left-0 w-52 bg-slate-950/95 border border-white/10 rounded-xl p-3.5 shadow-2xl flex flex-col gap-3 animate-fade-in-up">
              {/* Dynamic Visualizer Waveform */}
              <div className="h-7 flex items-end justify-center gap-[3px] bg-slate-900/60 rounded-lg p-1.5 border border-white/5 overflow-hidden">
                {Array.from({ length: 18 }).map((_, bar) => {
                  const duration = 0.4 + (bar % 3) * 0.15;
                  const delay = (bar % 4) * 0.08;
                  return (
                    <div
                      key={bar}
                      className="w-[2px] bg-emerald-500 rounded-full"
                      style={{
                        height: '100%',
                        animation: `visualizerBar ${duration}s ease-in-out ${delay}s infinite alternate`,
                        transformOrigin: 'bottom',
                        opacity: volume > 0 ? 0.3 + volume * 0.7 : 0.1
                      }}
                    />
                  );
                })}
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volume</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Soundscape theme</span>
                <select
                  value={category}
                  onChange={handleTrackChange}
                  className="w-full bg-slate-900 border border-white/10 text-[11px] text-white rounded-md p-1.5 outline-none cursor-pointer"
                >
                  <option value="default">Default Harmonizer</option>
                  <option value="rain">Kathmandu Rain</option>
                  <option value="lounge">Luxury Lounge</option>
                  <option value="cyberpunk">Cyberpunk Neon</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SoundscapeEngine;
