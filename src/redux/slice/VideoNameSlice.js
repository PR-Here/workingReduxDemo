import { createSlice } from "@reduxjs/toolkit";

export const VideoNameSlice = createSlice({
  name: "videoNameSlice",
  initialState: {
    videoName: "Video Player",
    showHeader: false,
  },
  reducers: {
    saveVideoName: (state, action) => {
      state.videoName = action.payload;
    },
    getVideoName: (state, action) => {
      state.videoName = action.payload;
    },
    showHeader: (state) => {
      state.showHeader = true;
    },
    hideHeader: (state) => {
      state.showHeader = false;
    },
  },
});

export const {
  saveVideoName,
  getVideoName,
  showHeader,
  hideHeader,
} = VideoNameSlice.actions;
export default VideoNameSlice.reducer;
