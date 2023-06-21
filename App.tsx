import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import BottomNavigation from "./src/bottom_navigation/BottmNavigation";
import StackNavigation from "./src/stack_navigation/StackNavigation";
import { store } from "./src/redux/store/Store";

export default function App() {
  return (
    <Provider store={store}>
      <StackNavigation />
    </Provider>
  );
}

const styles = StyleSheet.create({});
