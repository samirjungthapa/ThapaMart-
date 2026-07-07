import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import cartReducer from './slices/cartSlice.js';
import wishlistReducer from './slices/wishlistSlice.js';
import api from './api.js';

const cartSyncMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type.startsWith('cart/')) {
    // Avoid recursion if the action is loading database cart items
    if (action.type !== 'cart/setCartItems') {
      const state = store.getState();
      const { userInfo } = state.auth;
      if (userInfo) {
        api.put('/auth/cart', { cartItems: state.cart.cartItems })
          .catch((err) => console.error('Failed to sync cart:', err));
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartSyncMiddleware),
});
