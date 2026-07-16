import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import cartReducer from './slices/cartSlice.js';
import wishlistReducer from './slices/wishlistSlice.js';
import { apiSlice } from './slices/apiSlice.js';
import api from './api.js';

const cartSyncMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type.startsWith('cart/')) {
    if (action.type !== 'cart/setCartItems') {
      const state = store.getState();
      const { userInfo } = state.auth;
      if (userInfo) {
        if (!navigator.onLine) {
          localStorage.setItem('cartNeedsSync', 'true');
        } else {
          api.put('/auth/cart', { cartItems: state.cart.cartItems })
            .then(() => {
              localStorage.removeItem('cartNeedsSync');
            })
            .catch((err) => {
              console.error('Failed to sync cart:', err);
              localStorage.setItem('cartNeedsSync', 'true');
            });
        }
      }
    }
  }

  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartSyncMiddleware, apiSlice.middleware),
});
