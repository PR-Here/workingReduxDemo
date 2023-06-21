import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavigation from "../bottom_navigation/BottmNavigation";
import VideoPlayer from "../screen/VideoPlayer";
import PlayVideo from "../screen/PlayVideo";
import { SEN_BOLD } from "../utils/MyFont";
import { getVideoName } from "../redux/slice/VideoNameSlice";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  const videoName = useSelector((state) => state?.videoName?.videoName);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerTitle: videoName,
          headerTitleStyle: {
            color: "black",
            fontFamily: SEN_BOLD,
          },
          headerStyle: {
            backgroundColor: "#d3d3d3d3",
          },
        }}
        initialRouteName="welcome"
      >
        <Stack.Screen name="bottom" component={BottomNavigation} options={{headerShown:true}} />
        <Stack.Screen name="playVideo" component={PlayVideo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
