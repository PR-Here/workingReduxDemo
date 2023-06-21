import { configureStore } from "@reduxjs/toolkit";
import GalleryDataSlice from "../slice/GalleryDataSlice";
import VideoNameSlice from "../slice/VideoNameSlice";

export const store = configureStore({
  reducer: {
    gallery: GalleryDataSlice,
    videoName: VideoNameSlice,
  },
});
