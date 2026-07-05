import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFail } from '../store/slices/authSlice.js';
import api from '../store/api.js';
import ThapaMartLogo from '../components/ThapaMartLogo.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, loading, error } = useSelector((state) => state.auth);
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(authStart());
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(authSuccess(data));
      
      const guestCart = localStorage.getItem('cartItems');
      if (guestCart) {
        const parsed = JSON.parse(guestCart);
        parsed.forEach(item => {
          dispatch({ type: 'cart/addToCart', payload: item });
        });
      }
    } catch (err) {
      dispatch(authFail(err.response?.data?.message || 'Invalid email or password'));
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyItems:'center', justifyContent:'center', padding:'3rem 1rem', background:'#FFFFFF' }}>
      <div style={{ width:'100%', maxWidth:'28rem', border:'1px solid #E5E7EB', padding:'3rem' }}>
        
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'2.5rem' }}>
          <ThapaMartLogo size="md" variant="wordmark" />
          <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'2.5rem', fontWeight:900, color:'#09090B', margin:'1.5rem 0 0.5rem' }}>Sign In</h2>
        </div>

        {error && <div style={{ padding:'1rem', background:'#FEF2F2', border:'1px solid #FECACA', color:'#DC2626', fontSize:'0.75rem', fontWeight:600, marginBottom:'1.5rem', textAlign:'center' }}>{error}</div>}

        <form onSubmit={submitHandler} style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          <div>
            <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>Email Address</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} style={{ width:'100%', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'0.875rem 1rem', color:'#09090B', fontSize:'0.875rem', outline:'none' }} onFocus={e=>e.currentTarget.style.borderColor='#09090B'} onBlur={e=>e.currentTarget.style.borderColor='#E5E7EB'} />
          </div>

          <div>
            <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>Password</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} style={{ width:'100%', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'0.875rem 1rem', color:'#09090B', fontSize:'0.875rem', outline:'none' }} onFocus={e=>e.currentTarget.style.borderColor='#09090B'} onBlur={e=>e.currentTarget.style.borderColor='#E5E7EB'} />
          </div>

          <button type="submit" disabled={loading} style={{ width:'100%', padding:'1rem', background:'#000000', color:'#FFFFFF', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', border:'none', cursor:'pointer', marginTop:'1rem' }}>
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop:'2rem', textAlign:'center', fontSize:'0.875rem', color:'#71717A' }}>
          Don't have an account? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} style={{ color:'#09090B', fontWeight:700, textDecoration:'none', borderBottom:'1px solid #09090B' }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
