import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFail } from '../store/slices/authSlice.js';
import api from '../store/api.js';
import ThapaMartLogo from '../components/ThapaMartLogo.jsx';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // OTP Verification States
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, loading, error } = useSelector((state) => state.auth);
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo && userInfo.isVerified !== false) navigate(redirect);
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setMessage('');
    dispatch(authStart());
    try {
      const { data } = await api.post('/auth/register', { name, email, password, phone });
      
      // Save OTP code to display as hint for local testing convenience
      if (data.otp) {
        setDemoOtpHint(data.otp);
      }
      setShowOtpStep(true);
      dispatch(authFail('')); // Clear loading state or placeholder errors
    } catch (err) {
      dispatch(authFail(err.response?.data?.message || 'Registration failed'));
    }
  };

  const otpSubmitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    dispatch(authStart());
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp: otpCode });
      dispatch(authSuccess(data.user));
      localStorage.setItem('userInfo', JSON.stringify(data.user));

      const guestCart = localStorage.getItem('cartItems');
      if (guestCart) {
        const parsed = JSON.parse(guestCart);
        parsed.forEach(item => {
          dispatch({ type: 'cart/addToCart', payload: item });
        });
      }
    } catch (err) {
      dispatch(authFail(err.response?.data?.message || 'OTP verification failed'));
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyItems:'center', justifyContent:'center', padding:'3rem 1rem', background:'#FFFFFF' }}>
      <div style={{ width:'100%', maxWidth:'28rem', border:'1px solid #E5E7EB', padding:'3rem' }}>
        
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'2.5rem' }}>
          <ThapaMartLogo size="md" variant="wordmark" />
          <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'2.5rem', fontWeight:900, color:'#09090B', margin:'1.5rem 0 0.5rem' }}>
            {showOtpStep ? 'Verify OTP' : 'Register'}
          </h2>
        </div>

        {message && <div style={{ padding:'1rem', background:'#FEF2F2', border:'1px solid #FECACA', color:'#DC2626', fontSize:'0.75rem', fontWeight:600, marginBottom:'1.5rem', textAlign:'center' }}>{message}</div>}
        {error && <div style={{ padding:'1rem', background:'#FEF2F2', border:'1px solid #FECACA', color:'#DC2626', fontSize:'0.75rem', fontWeight:600, marginBottom:'1.5rem', textAlign:'center' }}>{error}</div>}

        {!showOtpStep ? (
          <form onSubmit={submitHandler} style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            <div>
              <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>Full Name</label>
              <input type="text" required value={name} onChange={e=>setName(e.target.value)} style={{ width:'100%', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'0.875rem 1rem', color:'#09090B', fontSize:'0.875rem', outline:'none' }} onFocus={e=>e.currentTarget.style.borderColor='#09090B'} onBlur={e=>e.currentTarget.style.borderColor='#E5E7EB'} />
            </div>

            <div>
              <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>Email Address</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} style={{ width:'100%', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'0.875rem 1rem', color:'#09090B', fontSize:'0.875rem', outline:'none' }} onFocus={e=>e.currentTarget.style.borderColor='#09090B'} onBlur={e=>e.currentTarget.style.borderColor='#E5E7EB'} />
            </div>

            <div>
              <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>Phone Number</label>
              <input type="tel" required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+977-98XXXXXXXX" style={{ width:'100%', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'0.875rem 1rem', color:'#09090B', fontSize:'0.875rem', outline:'none' }} onFocus={e=>e.currentTarget.style.borderColor='#09090B'} onBlur={e=>e.currentTarget.style.borderColor='#E5E7EB'} />
            </div>

            <div>
              <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>Password</label>
              <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} style={{ width:'100%', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'0.875rem 1rem', color:'#09090B', fontSize:'0.875rem', outline:'none' }} onFocus={e=>e.currentTarget.style.borderColor='#09090B'} onBlur={e=>e.currentTarget.style.borderColor='#E5E7EB'} />
            </div>

            <div>
              <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>Confirm Password</label>
              <input type="password" required value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} style={{ width:'100%', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'0.875rem 1rem', color:'#09090B', fontSize:'0.875rem', outline:'none' }} onFocus={e=>e.currentTarget.style.borderColor='#09090B'} onBlur={e=>e.currentTarget.style.borderColor='#E5E7EB'} />
            </div>

            <button type="submit" disabled={loading} style={{ width:'100%', padding:'1rem', background:'#000000', color:'#FFFFFF', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', border:'none', cursor:'pointer', marginTop:'1rem' }}>
              {loading ? 'Processing...' : 'Create Account'}
            </button>
          </form>
        ) : (
          <form onSubmit={otpSubmitHandler} style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#71717A', textAlign: 'center', lineHeight: '1.5' }}>
              We have generated a 6-digit One-Time Password (OTP) for registration verification. Enter the code below.
            </p>

            {demoOtpHint && (
              <div style={{ padding: '0.875rem', background: '#EFF6FF', border: '1px dashed #3B82F6', color: '#1E40AF', fontSize: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>
                🔑 Developer Demo Mode OTP: <span style={{ fontSize: '1rem', color: '#09090B' }}>{demoOtpHint}</span>
              </div>
            )}

            <div>
              <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>6-Digit OTP Code</label>
              <input type="text" required maxLength="6" placeholder="000000" value={otpCode} onChange={e=>setOtpCode(e.target.value)} style={{ width:'100%', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'0.875rem 1rem', color:'#09090B', fontSize:'1.25rem', letterSpacing: '0.5em', textAlign: 'center', outline:'none' }} onFocus={e=>e.currentTarget.style.borderColor='#09090B'} onBlur={e=>e.currentTarget.style.borderColor='#E5E7EB'} />
            </div>

            <button type="submit" disabled={loading} style={{ width:'100%', padding:'1rem', background:'#000000', color:'#FFFFFF', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', border:'none', cursor:'pointer', marginTop:'1rem' }}>
              {loading ? 'Verifying...' : 'Verify & Activate'}
            </button>

            <button type="button" onClick={() => setShowOtpStep(false)} style={{ width:'100%', padding:'0.5rem', background:'transparent', color:'#71717A', fontSize:'0.75rem', fontWeight:600, border:'none', cursor:'pointer' }}>
              Go Back
            </button>
          </form>
        )}

        <div style={{ marginTop:'2rem', textAlign:'center', fontSize:'0.875rem', color:'#71717A' }}>
          Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={{ color:'#09090B', fontWeight:700, textDecoration:'none', borderBottom:'1px solid #09090B' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
export default Register;
