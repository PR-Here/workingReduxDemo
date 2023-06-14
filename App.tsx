import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation";
import { Provider } from "react-redux";
import store from "./redux/store/MyStore";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({});
