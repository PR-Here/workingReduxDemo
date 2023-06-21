import React, { useEffect } from "react";
import { View, Text, ToastAndroid } from "react-native";
import Toast from "react-native-toast-message";

export default showToast = (message) => {
  ToastAndroid.showWithGravity(
    message.toString(),
    ToastAndroid.SHORT,
    ToastAndroid.CENTER
  );
};
