import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SEN_BOLD } from "../utils/MyFont";
import { RIGHT_ARROW } from "../utils/MyImage";

export default function Setting({ navigation }) {
  const isDoubleClick = useSelector((state) => state?.videoName?.click);

  useEffect(() => {}, []);

  const handleClick = () => {
    navigation.navigate("image");
  };

  return (
    <View style={styles.container}>
      {/* LOGIN */}
      {isDoubleClick?
      <TouchableOpacity
        onPress={handleClick}
        activeOpacity={0.6}
        style={styles.loginButton}
      >
        <Text style={styles.loginText}>Login</Text>
        <Image style={{ width: 30, height: 30 }} source={RIGHT_ARROW} />
      </TouchableOpacity>: null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loginButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#d3d3d3d3",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  loginText: {
    fontFamily: SEN_BOLD,
    color: "black",
    fontSize: 15,
  },
});
