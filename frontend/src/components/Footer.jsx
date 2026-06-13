import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-tight">
              ThapaMart
            </span>
            <p className="text-sm text-slate-400 mt-2">
              Shop Smart, Live Better. The ultimate premium online shopping experience curated with high-quality global standard goods.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors"><FiFacebook className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-accent transition-colors"><FiInstagram className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-secondary transition-colors"><FiTwitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-red-500 transition-colors"><FiYoutube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop" className="hover:text-primary transition-colors">Shop All Products</Link></li>
              <li><Link to="/categories" className="hover:text-primary transition-colors">All Categories</Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-primary transition-colors">Your Wishlist</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">F.A.Q.s</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start">
                <FiMapPin className="w-5 h-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                <span>123 Smart Retail Street, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="w-5 h-5 mr-3 text-accent flex-shrink-0" />
                <span>+977 1 4567890</span>
              </li>
              <li className="flex items-center">
                <FiMail className="w-5 h-5 mr-3 text-secondary flex-shrink-0" />
                <span>support@thapamart.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} ThapaMart. All rights reserved. Made with ❤️ for a modern shopping lifestyle.
          </p>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <span className="px-2 py-1 bg-slate-800 text-[10px] font-semibold tracking-wider text-slate-400 rounded-md">VISA</span>
            <span className="px-2 py-1 bg-slate-800 text-[10px] font-semibold tracking-wider text-slate-400 rounded-md">MASTERCARD</span>
            <span className="px-2 py-1 bg-slate-800 text-[10px] font-semibold tracking-wider text-slate-400 rounded-md">STRIPE</span>
            <span className="px-2 py-1 bg-slate-800 text-[10px] font-semibold tracking-wider text-slate-400 rounded-md">APPLE PAY</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
