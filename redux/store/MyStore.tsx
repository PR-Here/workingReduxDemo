// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import ProductSlice from "../slice/ProductSlice";
import cartSlice from "../slice/CartSlice";

const store = configureStore({
  reducer: {
    posts: ProductSlice,
    cart: cartSlice,
  },
});

export default store;
