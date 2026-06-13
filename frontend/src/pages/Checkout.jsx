import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress, saveBillingInfo, clearCart, calcPrices } from '../store/slices/cartSlice.js';
import api from '../store/api.js';
import { FiMapPin, FiCreditCard, FiLock, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, shippingAddress, billingInfo, coupon } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // Form states
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  // Payment states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const prices = calcPrices({ cartItems, coupon });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const shippingDetails = { address, city, postalCode, country, fullName: userInfo.name };
    dispatch(saveShippingAddress(shippingDetails));

    try {
      // Create order in backend
      const orderItems = cartItems.map(item => ({
        product: item.product,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      }));

      const { data: order } = await api.post('/orders', {
        orderItems,
        shippingAddress: shippingDetails,
        billingInfo: shippingDetails,
        paymentMethod: 'Stripe',
        itemsPrice: prices.itemsPrice,
        taxPrice: prices.taxPrice,
        shippingPrice: prices.shippingPrice,
        totalPrice: prices.totalPrice,
      });

      // Process payment (simulated or real Stripe transaction depending on key status)
      const { data: payment } = await api.post('/payment/process', {
        amount: prices.totalPrice,
      });

      if (payment.success) {
        // Mark order as paid
        await api.put(`/orders/${order.id || order._id}/pay`, {
          id: payment.client_secret,
          status: 'succeeded'
        });

        dispatch(clearCart());
        navigate(`/order-success?orderId=${order.id || order._id}`);
      } else {
        navigate('/order-failed');
      }

    } catch (err) {
      setError(
        err.response && err.response.data.message ? err.response.data.message : 'Checkout transaction failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-mesh-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Secure Checkout</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Complete your details to place the order.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Shipping Details & Card payment info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Address box */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-premium">
              <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <FiMapPin className="text-primary w-5 h-5" />
                <h2 className="font-bold text-slate-800 dark:text-white text-base">Shipping Destination</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Street Address</label>
                  <input
                    type="text"
                    required
                    className="p-3 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    className="p-3 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Postal Code</label>
                  <input
                    type="text"
                    required
                    className="p-3 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Country</label>
                  <input
                    type="text"
                    required
                    className="p-3 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-premium">
              <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <FiCreditCard className="text-accent w-5 h-5" />
                <h2 className="font-bold text-slate-800 dark:text-white text-base">Payment Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Card Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><FiCreditCard /></span>
                    <input
                      type="text"
                      required
                      placeholder="4242 4242 4242 4242"
                      className="pl-9 pr-4 py-3 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Expiration Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM / YY"
                      className="p-3 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">CVC / CVV</label>
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      className="p-3 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none"
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center space-x-2 text-[10px] text-slate-400 font-semibold uppercase">
                  <FiLock className="text-emerald-500" />
                  <span>Payments are processed securely via Stripe.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Checkout Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-panel rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-premium">
              <h3 className="font-bold text-slate-800 dark:text-white text-base pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                Order Summary
              </h3>

              {/* Items Summary list */}
              <div className="divide-y divide-slate-100 dark:divide-slate-850 max-h-48 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.product} className="py-3 flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.title} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="font-medium text-slate-700 dark:text-slate-300 line-clamp-1 max-w-[120px]">{item.title}</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">
                      x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-white">${prices.itemsPrice}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">-${prices.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {prices.shippingPrice === 0 ? 'Free' : `$${prices.shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-semibold text-slate-800 dark:text-white">${prices.taxPrice}</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex justify-between text-sm font-extrabold text-slate-800 dark:text-white">
                  <span>Grand Total</span>
                  <span>${prices.totalPrice}</span>
                </div>
              </div>

              {/* Place Order submit button */}
              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full flex items-center justify-center py-3.5 px-6 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-premium transition-all duration-300 hover:scale-102 mt-6 disabled:opacity-40 disabled:scale-100"
              >
                {loading ? 'Processing Transaction...' : 'Authorize Payment'}
              </button>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Checkout;
