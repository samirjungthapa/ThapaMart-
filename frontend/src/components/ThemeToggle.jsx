import React, { useEffect, useState } from 'react';
import { Sun, Moon, Crown, Zap } from 'lucide-react';

const ThemeToggle = () => {
  const themes = ['light', 'dark', 'luxury-gold', 'cyberpunk'];
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    themes.forEach(t => root.classList.remove(t));
    if (theme !== 'light') {
      root.classList.add(theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const renderIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'luxury-gold':
        return <Crown className="w-5 h-5 text-amber-500 animate-pulse" />;
      case 'cyberpunk':
        return <Zap className="w-5 h-5 text-pink-500 animate-bounce" />;
      default:
        return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark': return 'Dark Mode';
      case 'luxury-gold': return 'Luxury Gold';
      case 'cyberpunk': return 'Cyberpunk Neon';
      default: return 'Light Mode';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="relative p-2.5 rounded-full bg-opacity-20 hover:bg-opacity-35 transition-all duration-300 hover:scale-110 shadow-premium border border-gray-200/20 flex items-center justify-center gap-1 group"
      style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
      title={`Switch theme (Current: ${getThemeLabel()})`}
      aria-label="Cycle Custom Luxury Theme"
    >
      {renderIcon()}
      <span className="max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-500 text-[10px] uppercase font-bold tracking-widest leading-none">
        {theme}
      </span>
    </button>
  );
};

export default ThemeToggle;

