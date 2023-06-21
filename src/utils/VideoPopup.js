import {
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { getData } from "../redux/slice/GalleryDataSlice";
import { useSelector, useDispatch } from "react-redux";
import { CLOSE } from "./MyImage";

export default function VideoPopup({ modalVisible, handlePopup }) {
  const galleryData = useSelector((state) => state.gallery.data);

  const closeModal = () => {
    handlePopup();
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={closeModal} style={styles.cutView}>
            <Image style={{ width: 20, height: 20 }} source={CLOSE} />
          </TouchableOpacity>
          <FlatList
            style={{ marginTop: 50 }}
            data={galleryData.flat()}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={styles.videoView}>
                  <ImageBackground
                    borderRadius={10}
                    style={styles.image}
                    source={{ uri: item?.node?.image?.uri }}
                  ></ImageBackground>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#d3d3d3d3",
    padding: 20,
    borderRadius: 8,
    width: "95%",
    height: "70%",
    alignItems: "center",
  },
  videoView: {
    width: 140,
    height: 80,
    justifyContent:'space-between',
    margin:10
  },
  image: {
    height: 100,
    height: 80,
  },
  cutView: {
    position: "absolute",
    right: 20,
    top: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
