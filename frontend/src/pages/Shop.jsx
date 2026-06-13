import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../store/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { FiSearch, FiSliders, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const fallbackProducts = [
  {
    id: "prod-1",
    title: "Pro Sound Max Wireless Headphones",
    description: "Experience premium sound quality with active noise cancellation, 40-hour battery life, and comfortable memory foam earcups.",
    category: "electronics",
    price: 189.99,
    stock: 25,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.8
  },
  {
    id: "prod-13",
    title: "Nebula OLED Gaming Monitor",
    description: "Immersive 34-inch curved OLED gaming display featuring a 240Hz refresh rate, 0.03ms response time, and stunning HDR600 contrast.",
    category: "electronics",
    price: 699.99,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.9
  },
  {
    id: "prod-14",
    title: "StudioPro Mechanical Keyboard",
    description: "Hot-swappable custom mechanical keyboard with gasket-mounted design, pre-lubed linear switches, and triple-mode wireless connectivity.",
    category: "electronics",
    price: 179.99,
    stock: 30,
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.7
  },
  {
    id: "prod-3",
    title: "Classic Cotton Bomber Jacket",
    description: "Premium cotton bomber jacket designed for comfort and style. Water-resistant outer shell with thermal inner lining.",
    category: "fashion",
    price: 89.99,
    stock: 50,
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.5
  },
  {
    id: "prod-15",
    title: "Sartorial Wool Blend Trench Coat",
    description: "An elegant, double-breasted trench coat tailored from a premium heavyweight wool blend. Features classic lapels and adjustable waist belt.",
    category: "fashion",
    price: 219.99,
    stock: 25,
    images: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.6
  },
  {
    id: "prod-4",
    title: "Ergonomic Office Desk Chair",
    description: "Fully adjustable ergonomic desk chair with breathable mesh back, lumber support, and customizable 3D armrests.",
    category: "home-living",
    price: 299.99,
    stock: 10,
    images: ["https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.7
  },
  {
    id: "prod-17",
    title: "Nordic Ceramic Vase Collection",
    description: "Set of three minimal, matte-finished ceramic vases in earthy tones. Perfect for dried flowers or standalone structural styling.",
    category: "home-living",
    price: 59.99,
    stock: 45,
    images: ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.8
  },
  {
    id: "prod-5",
    title: "Pure Glow Organic Face Oil",
    description: "Infused with natural rosehip oil, vitamin E, and jojoba extract for clean, hydrated, and radiant skin.",
    category: "beauty",
    price: 34.99,
    stock: 100,
    images: ["https://images.unsplash.com/photo-1608248597481-496100c8c836?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.9
  },
  {
    id: "prod-20",
    title: "Velvet Petal Hydrating Lip Balm",
    description: "Nourishing lip treatment infused with rich organic shea butter, cold-pressed coconut oil, and a delicate vanilla rose aroma.",
    category: "beauty",
    price: 14.99,
    stock: 200,
    images: ["https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.9
  },
  {
    id: "prod-6",
    title: "Advanced Carbon Fiber Road Bike",
    description: "Ultralight carbon fiber frame with Shimano components, designed for fast road races and weekend mountain adventures.",
    category: "sports",
    price: 1299.99,
    stock: 5,
    images: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.4
  },
  {
    id: "prod-21",
    title: "Apex Smart Fitness Kettlebell",
    description: "Dynamic smart kettlebell with adjustable weight selector (10 to 40 lbs) and built-in motion sensors for rep and form tracking via Bluetooth app.",
    category: "sports",
    price: 149.99,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.7
  },
  {
    id: "prod-22",
    title: "HydroShield Insulated Water Bottle",
    description: "Double-walled vacuum insulated stainless steel flask. Keeps beverages ice-cold for up to 24 hours or steaming hot for 12 hours.",
    category: "sports",
    price: 39.99,
    stock: 150,
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80"],
    ratings: 4.8
  }
];

const Shop = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Filter States
  const [keyword, setKeyword] = useState(queryParams.get('search') || '');
  const [category, setCategory] = useState(queryParams.get('category') || 'all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync states from URL query (for navbar searches)
  useEffect(() => {
    const searchVal = queryParams.get('search') || '';
    const catVal = queryParams.get('category') || 'all';
    setKeyword(searchVal);
    setCategory(catVal);
    setPage(1);
  }, [location.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', {
        params: {
          keyword,
          category,
          minPrice,
          maxPrice,
          sort,
          page,
          limit: 6
        }
      });
      setProducts(data.products || []);
      setPages(data.pages || 1);
    } catch (err) {
      console.warn("ℹ️ API failed. Running local filtering simulation.");
      simulateLocalFilter();
    } finally {
      setLoading(false);
    }
  };

  const simulateLocalFilter = () => {
    let list = [...fallbackProducts];

    if (keyword) {
      list = list.filter(p => p.title.toLowerCase().includes(keyword.toLowerCase()));
    }
    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }
    if (minPrice) {
      list = list.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter(p => p.price <= Number(maxPrice));
    }

    if (sort === 'priceAsc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'priceDesc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.ratings - a.ratings);
    } else {
      list.reverse();
    }

    setProducts(list);
    setPages(1);
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword, category, minPrice, maxPrice, sort, page]);

  return (
    <div className="premium-mesh-bg min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Premium Catalog
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Browse our elegant curation of high-quality premium merchandise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Side Filter panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel rounded-2xl p-6 shadow-premium border border-slate-100 dark:border-slate-800">
              
              <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <FiSliders className="text-primary w-4 h-4" />
                <h2 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider">Filters</h2>
              </div>

              {/* Keyword Search */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Search</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><FiSearch /></span>
                  <input
                    type="text"
                    placeholder="Keywords..."
                    className="pl-9 pr-4 py-2 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>

              {/* Categories Filter */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home-living">Home & Living</option>
                  <option value="beauty">Beauty</option>
                  <option value="sports">Sports</option>
                  <option value="gaming">Gaming</option>
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Price Limit</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="py-2 px-3 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="py-2 px-3 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Sorting Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="newest">Newest Arrival</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

            </div>
          </div>

          {/* Catalog Listing Grid */}
          <div className="lg:col-span-3 space-y-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse glass-card rounded-2xl p-5 h-96 space-y-4">
                    <div className="bg-slate-200 dark:bg-slate-800 rounded-xl aspect-square w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 shadow-premium">
                <p className="text-base font-semibold">No products found matching filters.</p>
                <p className="text-xs mt-1 text-slate-400">Try modifying your search or clearing price parameters.</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product, index) => (
                    <ProductCard key={product.id || product._id} product={product} index={index} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pages > 1 && (
                  <div className="flex items-center justify-center space-x-3 mt-12">
                    <button
                      onClick={() => setPage(p => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-slate-900"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-200">
                      Page {page} of {pages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(p + 1, pages))}
                      disabled={page === pages}
                      className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-slate-900"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Shop;
