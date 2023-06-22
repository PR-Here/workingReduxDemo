import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import storage from "@react-native-firebase/storage";

const bucketName = "videoplayer-60b96.appspot.com";
const endpoint = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o`;

export default function ImagePreview() {
  const [imageUrl, setImageUrl] = useState([]);

  useEffect(() => {
    const storageRef = storage().ref();
    fetchAllChildItems(storageRef);
  }, []);

  const fetchAllChildItems = async (storageRef) => {
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          // Loop through the items and access their URLs
          data.items.forEach((item) => {
            const { downloadUrl, name } = item;
            // console.log("Item name:", name);
            console.log("Item download URL:", item);
          });
        } else {
          console.log("No items found in the storage bucket.",data);
        }
      })
      .catch((error) => {
        console.log("Error retrieving items:", error);
      });
  };

  return (
    <View>
      <Text>ImagePreview</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
