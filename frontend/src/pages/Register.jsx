import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFail } from '../store/slices/authSlice.js';
import api from '../store/api.js';
import { FiUser, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, loading, error } = useSelector((state) => state.auth);
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      dispatch(authSuccess(data));
    } catch (err) {
      dispatch(
        authFail(err.response && err.response.data.message ? err.response.data.message : err.message)
      );
    }
  };

  return (
    <div className="premium-mesh-bg min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 shadow-premium border border-white/50 dark:border-white/5"
      >
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign up to get access to custom ThapaMart pricing
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center space-x-2.5">
            <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            
            {/* Name Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <FiUser className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="pl-11 pr-5 py-3 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <FiMail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  className="pl-11 pr-5 py-3 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <FiLock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="pl-11 pr-5 py-3 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-premium transition-all duration-300 hover:scale-102 disabled:bg-slate-350 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>

        </form>

        {/* Footer info links */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 text-center text-sm text-slate-500 dark:text-slate-400">
          <span>Already have an account? </span>
          <Link to={`/login?redirect=${redirect}`} className="font-semibold text-primary hover:text-primary-dark hover:underline">
            Login here
          </Link>
        </div>

      </motion.div>

    </div>
  );
};

export default Register;
