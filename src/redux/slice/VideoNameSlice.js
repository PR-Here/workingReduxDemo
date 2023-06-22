import { createSlice } from "@reduxjs/toolkit";

export const VideoNameSlice = createSlice({
  name: "videoNameSlice",
  initialState: {
    videoName: "Video Player",
    showHeader: false,
    click: false,
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
    doubleClick: (state) => {
      state.click = true;
    },
    singleClick: (state) => {
      state.click = false;
    },
  },
});

export const {
  saveVideoName,
  getVideoName,
  showHeader,
  hideHeader,
  doubleClick,
  singleClick,
} = VideoNameSlice.actions;
export default VideoNameSlice.reducer;
