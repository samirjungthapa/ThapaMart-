import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all duration-300 hover:scale-110 shadow-premium border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
      aria-label="Toggle Light/Dark Theme"
    >
      {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5 text-amber-400" />}
    </button>
  );
};

export default ThemeToggle;
