import { createSlice } from "@reduxjs/toolkit";

export const VideoNameSlice = createSlice({
  name: "videoNameSlice",
  initialState: {
    videoName: "Video Player",
  },
  reducers: {
    saveVideoName: (state, action) => {
      state.videoName = action.payload;
    },
    getVideoName: (state, action) => {
      state.videoName = action.payload;
    },
  },
});

export const { saveVideoName, getVideoName } = VideoNameSlice.actions;
export default VideoNameSlice.reducer;
