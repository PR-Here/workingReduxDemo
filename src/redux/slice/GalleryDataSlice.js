import { createSlice } from "@reduxjs/toolkit";
import { stat } from "react-native-fs";

export const GalleryDataSlice = createSlice({
  name: "galleryData",
  initialState: {
    loading: false,
    data: [],
    error: null,
  },
  reducers: {
    addData: (state, action) => {
      state.data.push(action.payload);
    },
    getData: (state, action) => {
      state.data = action.payload;
    },
   
  },
});

// Action creators are generated for each case reducer function
export const {
  addData,
  getData,
} = GalleryDataSlice.actions;

export default GalleryDataSlice.reducer;
