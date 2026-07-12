import { createSlice } from '@reduxjs/toolkit';

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const billingInfoFromStorage = localStorage.getItem('billingInfo')
  ? JSON.parse(localStorage.getItem('billingInfo'))
  : {};

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  billingInfo: billingInfoFromStorage,
  paymentMethod: 'Stripe',
  coupon: localStorage.getItem('coupon') ? JSON.parse(localStorage.getItem('coupon')) : null,
};

const calcPrices = (state) => {
  const itemsPrice = state.cartItems.reduce((acc, item) => {
    const activePrice = item.subscribed ? item.price * 0.9 : item.price;
    return acc + activePrice * item.quantity;
  }, 0);
  const discount = state.coupon ? itemsPrice * (state.coupon.percent / 100) : 0;
  const subtotalAfterDiscount = itemsPrice - discount;
  const shippingPrice = subtotalAfterDiscount > 10000 ? 0 : 150; // Free shipping above Rs. 10,000
  const taxPrice = 0.13 * subtotalAfterDiscount; // 13% tax
  const totalPrice = subtotalAfterDiscount + shippingPrice + taxPrice;

  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    shippingPrice: Number(shippingPrice.toFixed(2)),
    taxPrice: Number(taxPrice.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    saveBillingInfo: (state, action) => {
      state.billingInfo = action.payload;
      localStorage.setItem('billingInfo', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload; // { code: 'THAPA10', percent: 10 }
      localStorage.setItem('coupon', JSON.stringify(action.payload));
    },
    removeCoupon: (state) => {
      state.coupon = null;
      localStorage.removeItem('coupon');
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.coupon = null;
      localStorage.removeItem('cartItems');
      localStorage.removeItem('coupon');
    },
  },
});

export const {
  addToCart,
  setCartItems,
  removeFromCart,
  saveShippingAddress,
  saveBillingInfo,
  savePaymentMethod,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;

export { calcPrices };
export default cartSlice.reducer;
