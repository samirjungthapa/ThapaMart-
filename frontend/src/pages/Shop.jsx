import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SlidersHorizontal, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../store/api.js';
import ProductCard from '../components/ProductCard.jsx';

const ALL_CATEGORIES = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home-living', name: 'Home & Living' },
  { id: 'beauty', name: 'Beauty & Wellness' },
  { id: 'sports', name: 'Sports & Fitness' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'jewelry', name: 'Fine Jewelry' },
  { id: 'art', name: 'Art Collection' },
  { id: 'footwear', name: 'Designer Footwear' }
];

const PRICE_RANGES = [
  { id: 'all', name: 'All Prices', min: '', max: '' },
  { id: 'range1', name: 'Under Rs. 50,000', min: '', max: '50000' },
  { id: 'range2', name: 'Rs. 50,000 - Rs. 200,000', min: '50000', max: '200000' },
  { id: 'range3', name: 'Rs. 200,000 - Rs. 500,000', min: '200000', max: '500000' },
  { id: 'range4', name: 'Over Rs. 500,000', min: '500000', max: '' }
];

const Shop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/shop');
    }
  }, [userInfo, navigate]);

  const queryParams = new URLSearchParams(location.search);

  const initialCategory = queryParams.get('category');
  
  const [keyword, setKeyword] = useState(queryParams.get('search') || '');
  const [categories, setCategories] = useState(initialCategory ? (initialCategory === 'all' ? [] : initialCategory.split(',')) : []);
  const [priceRange, setPriceRange] = useState('all');
  const [customMin, setCustomMin] = useState('');
  const [customMax, setCustomMax] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setKeyword(queryParams.get('search') || '');
    const catParam = queryParams.get('category');
    setCategories(catParam ? (catParam === 'all' ? [] : catParam.split(',')) : []);
    setPage(1);
  }, [location.search]);

  const toggleCategory = (catId) => {
    setCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
    setPage(1);
  };

  const handlePriceRangeChange = (rangeId) => {
    setPriceRange(rangeId);
    setCustomMin('');
    setCustomMax('');
    setPage(1);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let minPrice = customMin;
    let maxPrice = customMax;
    
    if (priceRange !== 'all' && priceRange !== 'custom') {
      const range = PRICE_RANGES.find(r => r.id === priceRange);
      if (range) {
        minPrice = range.min;
        maxPrice = range.max;
      }
    }

    try {
      const categoryParam = categories.length > 0 ? categories.join(',') : 'all';
      const { data } = await api.get('/products', { 
        params: { keyword, category: categoryParam, minPrice, maxPrice, sort, page, limit: 9 } 
      });
      setProducts(data.products || []);
      setPages(data.pages || 1);
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchProducts(); 
  }, [keyword, categories, priceRange, customMin, customMax, sort, page]);

  return (
    <div style={{ padding:'3rem 0', minHeight:'100vh', background:'#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div style={{ marginBottom:'3rem', textAlign:'center' }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'3rem', fontWeight:900, color:'#09090B', letterSpacing:'-0.02em', marginBottom:'0.5rem' }}>
            The Collection
          </h1>
          <div style={{ width:'2rem', height:'1px', background:'#09090B', margin:'0 auto' }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'1.5rem', position:'sticky', top:'5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.5rem', paddingBottom:'1rem', borderBottom:'1px solid #E5E7EB' }}>
                <SlidersHorizontal size={16} style={{ color:'#09090B' }} />
                <h2 style={{ fontSize:'0.75rem', fontWeight:800, color:'#09090B', textTransform:'uppercase', letterSpacing:'0.1em' }}>Filters</h2>
              </div>

              {/* Search */}
              <div style={{ marginBottom:'2rem' }}>
                <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.75rem' }}>Search</label>
                <div style={{ position:'relative' }}>
                  <Search size={14} style={{ position:'absolute', top:'50%', left:'0.875rem', transform:'translateY(-50%)', color:'#71717A' }} />
                  <input type="text" placeholder="Keywords..." value={keyword} onChange={e=>setKeyword(e.target.value)}
                    style={{ width:'100%', background:'#FFFFFF', border:'1px solid #E5E7EB', padding:'0.75rem 1rem 0.75rem 2.25rem', color:'#09090B', fontSize:'0.8rem', outline:'none' }}
                    onFocus={e=>e.currentTarget.style.borderColor='#09090B'} onBlur={e=>e.currentTarget.style.borderColor='#E5E7EB'} />
                </div>
              </div>

              {/* Multiple Categories */}
              <div style={{ marginBottom:'2rem' }}>
                <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.75rem' }}>Categories</label>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                  {ALL_CATEGORIES.map(cat => (
                    <label key={cat.id} style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={categories.includes(cat.id)} 
                        onChange={() => toggleCategory(cat.id)}
                        style={{ accentColor: '#09090B', width: '1rem', height: '1rem', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize:'0.875rem', color:'#52525B' }}>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div style={{ marginBottom:'2rem' }}>
                <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.75rem' }}>Price Range</label>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1rem' }}>
                  {PRICE_RANGES.map(range => (
                    <label key={range.id} style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer' }}>
                      <input 
                        type="radio" 
                        name="priceRange"
                        checked={priceRange === range.id} 
                        onChange={() => handlePriceRangeChange(range.id)}
                        style={{ accentColor: '#09090B', width: '1rem', height: '1rem', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize:'0.875rem', color:'#52525B' }}>{range.name}</span>
                    </label>
                  ))}
                  <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer' }}>
                    <input 
                      type="radio" 
                      name="priceRange"
                      checked={priceRange === 'custom'} 
                      onChange={() => setPriceRange('custom')}
                      style={{ accentColor: '#09090B', width: '1rem', height: '1rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize:'0.875rem', color:'#52525B' }}>Custom Range</span>
                  </label>
                </div>

                {priceRange === 'custom' && (
                  <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                    <input type="number" placeholder="Min" value={customMin} onChange={e=>setCustomMin(e.target.value)} style={{ width:'100%', background:'#FFFFFF', border:'1px solid #E5E7EB', padding:'0.75rem', color:'#09090B', fontSize:'0.8rem', outline:'none' }} />
                    <span style={{ color:'#71717A' }}>-</span>
                    <input type="number" placeholder="Max" value={customMax} onChange={e=>setCustomMax(e.target.value)} style={{ width:'100%', background:'#FFFFFF', border:'1px solid #E5E7EB', padding:'0.75rem', color:'#09090B', fontSize:'0.8rem', outline:'none' }} />
                  </div>
                )}
              </div>

              {/* Sort */}
              <div>
                <label style={{ display:'block', fontSize:'0.65rem', fontWeight:800, color:'#71717A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.75rem' }}>Sort By</label>
                <select value={sort} onChange={e=>setSort(e.target.value)}
                  style={{ width:'100%', background:'#FFFFFF', border:'1px solid #E5E7EB', padding:'0.75rem 1rem', color:'#09090B', fontSize:'0.8rem', outline:'none', cursor:'pointer' }}>
                  <option value="newest">Newest Arrival</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

            </div>
          </div>

          {/* Catalog */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ background:'#FFFFFF', border:'1px solid #E5E7EB', padding:'1rem' }}>
                    <div style={{ aspectRatio:'4/5', background:'#F9FAFB', animation:'pulse 2s infinite', marginBottom:'1rem' }} />
                    <div style={{ height:'1rem', width:'70%', background:'#F9FAFB', animation:'pulse 2s infinite', marginBottom:'0.5rem' }} />
                    <div style={{ height:'0.75rem', width:'40%', background:'#F9FAFB', animation:'pulse 2s infinite' }} />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', padding:'4rem 2rem', textAlign:'center' }}>
                <p style={{ fontSize:'1rem', fontWeight:700, color:'#09090B', marginBottom:'0.5rem' }}>No products found.</p>
                <p style={{ fontSize:'0.8rem', color:'#71717A' }}>Try modifying your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, i) => <ProductCard key={product.id || product._id} product={product} index={i} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'1rem', marginTop:'4rem', borderTop:'1px solid #E5E7EB', paddingTop:'2rem' }}>
                    <button onClick={()=>setPage(p=>Math.max(p-1,1))} disabled={page===1} style={{ padding:'0.5rem 1rem', background:'transparent', border:'1px solid #E5E7EB', color: page===1 ? '#D4D4D8' : '#09090B', cursor: page===1 ? 'not-allowed' : 'pointer', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase' }}>
                      Previous
                    </button>
                    <span style={{ fontSize:'0.875rem', fontWeight:700, color:'#09090B' }}>{page} / {pages}</span>
                    <button onClick={()=>setPage(p=>Math.min(p+1,pages))} disabled={page===pages} style={{ padding:'0.5rem 1rem', background:'transparent', border:'1px solid #E5E7EB', color: page===pages ? '#D4D4D8' : '#09090B', cursor: page===pages ? 'not-allowed' : 'pointer', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase' }}>
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
export default Shop;
