import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React from "react";
import VideoPlayer from "../screen/VideoPlayer";
import AudioPlayer from "../screen/AudioPlayer";
import Setting from "../screen/Setting";
import { Image } from "react-native";
import { AUDIO_IMAGE, SETTING_IMAGE, VIDEO_IMAGE } from "../utils/MyImage";
import { Text } from "react-native-paper";
import { SEN } from "../utils/MyFont";
import { useTheme } from "@react-navigation/native";

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="video"
      activeColor="green"
      inactiveColor="#3e2465"
      sceneAnimationEnabled
      sceneAnimationType="shifting"
      shifting
      labeled
      backBehavior="history"
      barStyle={{ backgroundColor: "#d3d3d3d3", paddingBottom: 0 }}
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="video"
        component={VideoPlayer}
        options={{
          tabBarLabel: (
            <Text style={{ textAlign: "center", fontFamily: SEN }}>Video</Text>
          ),
          tabBarIcon: ({ color }) => (
            <Image
              style={{ width: 25, height: 25 }}
              source={VIDEO_IMAGE}
              color={color}
            />
          ),
          tabBarColor: "red",
        }}
      />
      {/* <Tab.Screen
        name="audio"
        component={AudioPlayer}
        options={{
          tabBarLabel: (
            <Text style={{ textAlign: "center", fontFamily: SEN }}>Audio</Text>
          ),
          tabBarIcon: ({ color }) => (
            <Image
              style={{ width: 25, height: 25 }}
              source={AUDIO_IMAGE}
              color={color}
            />
          ),

          tabBarColor: "green",
        }}
      /> */}
      <Tab.Screen
        name="setting"
        component={Setting}
        options={{
          tabBarLabel: (
            <Text style={{ textAlign: "center", fontFamily: SEN }}>
              Setting
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Image
              style={{ width: 25, height: 25 }}
              source={SETTING_IMAGE}
              color={color}
            />
          ),
          tabBarColor: "#ffd700",
        }}
      />
    </Tab.Navigator>
  );
}
