import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, User, LogOut, LayoutDashboard, Menu, X, ArrowRight } from 'lucide-react';
import { logout } from '../store/slices/authSlice.js';
import ThapaMartLogo from './ThapaMartLogo.jsx';
import CartDrawer from './CartDrawer.jsx';
import CommandPalette from './CommandPalette.jsx';



const BG      = '#FFFFFF';
const BORDER  = '#E5E7EB';
const TEXT    = '#09090B';
const MUTED   = '#71717A';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);


  const { cartItems } = useSelector(state => state.cart);
  const { wishlistItems } = useSelector(state => state.wishlist);
  const { userInfo } = useSelector(state => state.auth);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    ...(userInfo ? [
      { name: 'Shop', path: '/shop' },
      { name: 'Collections', path: '/collections' }
    ] : []),
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 50, width: '100%',
          background: isScrolled ? 'rgba(255,255,255,0.95)' : BG,
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          borderBottom: isScrolled ? `1px solid ${BORDER}` : '1px solid transparent',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Top Announcement Bar */}
        <div style={{ background: '#000000', color: '#FFFFFF', padding: '0.5rem 0', textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Free shipping on all premium orders over Rs. 10,000 <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>|</span> <Link to="/shop" style={{ marginLeft: '0.5rem', color: '#FFFFFF', textDecoration: 'underline' }}>Shop Now</Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '5rem' }}>
            
            {/* Logo */}
            <div style={{ flex: '1 1 0%' }}>
              <Link to="/">
                <ThapaMartLogo size="md" variant="wordmark" />
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex" style={{ flex: '1 1 auto', justifyContent: 'center', gap: '2rem' }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link key={link.name} to={link.path}
                    style={{
                      fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                      color: isActive ? TEXT : MUTED, textDecoration: 'none', position: 'relative', padding: '0.5rem 0',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = TEXT; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = MUTED; }}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div layoutId="nav-pill" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#000000' }} />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Icons */}
            <div style={{ flex: '1 1 0%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1.25rem' }}>
              
              {/* Search Toggle */}
              <button onClick={() => setCommandPaletteOpen(true)} style={{ background: 'transparent', border: 'none', color: TEXT, cursor: 'pointer', padding: '0.5rem' }} title="Search (Ctrl+K)">
                <Search size={20} strokeWidth={1.5} />
              </button>


              {/* Wishlist */}
              <Link to="/wishlist" style={{ color: TEXT, textDecoration: 'none', position: 'relative', padding: '0.5rem' }}>
                <Heart size={20} strokeWidth={1.5} />
                {wishlistItems.length > 0 && (
                  <span style={{ position: 'absolute', top: 2, right: 2, width: '14px', height: '14px', background: '#000000', color: '#FFFFFF', borderRadius: '50%', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button onClick={() => setCartDrawerOpen(true)} style={{ background: 'transparent', border: 'none', color: TEXT, textDecoration: 'none', position: 'relative', padding: '0.5rem', cursor: 'pointer' }}>
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartItems.length > 0 && (
                  <span style={{ position: 'absolute', top: 2, right: 2, width: '14px', height: '14px', background: '#000000', color: '#FFFFFF', borderRadius: '50%', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </span>
                )}
              </button>


              {/* Profile Dropdown */}
              <div style={{ position: 'relative' }}>
                {userInfo ? (
                  <button onClick={() => setProfileOpen(!profileOpen)} style={{ background: 'transparent', border: 'none', color: TEXT, cursor: 'pointer', padding: '0.5rem' }}>
                    <User size={20} strokeWidth={1.5} />
                  </button>
                ) : (
                  <Link to="/login" style={{ color: TEXT, textDecoration: 'none', padding: '0.5rem' }}>
                    <User size={20} strokeWidth={1.5} />
                  </Link>
                )}

                <AnimatePresence>
                  {profileOpen && userInfo && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.5rem', width: '14rem', background: '#FFFFFF', border: `1px solid ${BORDER}`, borderRadius: '0.5rem', padding: '0.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transformOrigin: 'top right' }}>
                      <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${BORDER}`, marginBottom: '0.5rem' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: TEXT }}>{userInfo.name}</p>
                        <p style={{ fontSize: '0.7rem', color: MUTED }}>{userInfo.email}</p>
                      </div>
                      {userInfo.isAdmin && (
                        <Link to="/admin/dashboard" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.8rem', color: TEXT, textDecoration: 'none', borderRadius: '0.25rem' }} onMouseEnter={e=>e.currentTarget.style.background='#F9FAFB'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <LayoutDashboard size={16} /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.8rem', color: TEXT, textDecoration: 'none', borderRadius: '0.25rem' }} onMouseEnter={e=>e.currentTarget.style.background='#F9FAFB'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <User size={16} /> My Account
                      </Link>
                      <button onClick={() => { dispatch(logout()); setProfileOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '0.25rem' }} onMouseEnter={e=>e.currentTarget.style.background='#FEF2F2'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(true)} style={{ background: 'transparent', border: 'none', color: TEXT, cursor: 'pointer', padding: '0.5rem' }}>
                  <Menu size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', background: '#FFFFFF', borderBottom: `1px solid ${BORDER}` }}>
              <div className="max-w-3xl mx-auto px-4 py-6">
                <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                  <Search size={20} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: MUTED }} strokeWidth={1.5} />
                  <input type="text" placeholder="Search for premium products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus
                    style={{ width: '100%', background: '#F9FAFB', border: 'none', padding: '1rem 1rem 1rem 3rem', fontSize: '1rem', color: TEXT, outline: 'none' }} />
                  <button type="submit" style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', background: '#000000', color: '#FFFFFF', border: 'none', padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>Search</button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '80%', maxWidth: '300px', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER}` }}>
                <ThapaMartLogo size="sm" variant="wordmark" />
                <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: TEXT, cursor: 'pointer' }}><X size={20} strokeWidth={1.5} /></button>
              </div>
              <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.25rem', fontWeight: 600, color: TEXT, textDecoration: 'none' }}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </>
  );
};
export default Navbar;
