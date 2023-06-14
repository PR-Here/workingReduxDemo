import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      state.push(action.payload);
    },
    removeFromCart: (state, action) => {        
      state.pop();
    },
    cartCount: (state, action) => {
      state.length;
    },
  },
});

export const { addToCart, removeFromCart,cartCount } = cartSlice.actions;

export default cartSlice.reducer;
