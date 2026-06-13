import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const getInitialState = () => {
  const savedCart = localStorage.getItem("cart");

  return savedCart
    ? JSON.parse(savedCart)
    : {
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "PayPal",
      };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialState(),

  reducers: {
    addToCart: (state, action) => {
      const itemData = action.payload;

      const cartItem = Object.keys(itemData)
        .filter(
          (key) =>
            key !== "user" &&
            key !== "rating" &&
            key !== "numReviews" &&
            key !== "reviews"
        )
        .reduce((obj, key) => {
          obj[key] = itemData[key];
          return obj;
        }, {});

      const existingItem = state.cartItems.find(
        (item) => item._id === cartItem._id
      );

      if (existingItem) {
        state.cartItems = state.cartItems.map((item) =>
          item._id === cartItem._id ? cartItem : item
        );
      } else {
        state.cartItems.push(cartItem);
      }

      return updateCart(state, cartItem);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );

      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: () => getInitialState(),
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;