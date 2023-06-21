import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Alert,
  Image,
  Linking,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import storage from "@react-native-firebase/storage";
import * as Progress from "react-native-progress";
import RNFetchBlob from "react-native-fetch-blob";
import {
  getUniqueId,
  getManufacturer,
  getPhoneNumber,
  getDevice,
} from "react-native-device-info";
import { err } from "react-native-svg/lib/typescript/xml";
import { SEN, SEN_BOLD } from "../utils/MyFont";
import { addData } from "../redux/slice/GalleryDataSlice";
import { useSelector, useDispatch } from "react-redux";
import { saveVideoName } from "../redux/slice/VideoNameSlice";

var uploadedRefs;

export default function VideoPlayer({ navigation }) {
  const [galleryItems, setGalleryItems] = useState([]);
  const [deviceName, setDeviceName] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [video, setVideo] = useState([]);
  const dispatch = useDispatch();

  const supportedMimeTypesByTheBackEnd = [
    "image/jpeg",
    "image/png",
    "image/heif",
    "image/heic",
    "image/heif-sequence",
    "image/heic-sequence",
  ];

  useEffect(() => {
    fetchGalleryData();
  }, []);

  async function hasAndroidPermission() {
    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES &&
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === "granted";
  }

  fetchGalleryData = async () => {
    const permission = await hasAndroidPermission();
    getPhoneNumber().then((phoneNumber) => {
      getManufacturer().then((manufecture) => {
        getDevice().then((deviceName) => {
          setDeviceName(manufecture + " " + deviceName + " No - ", phoneNumber);
        });
      });
    });
    if (permission) {
      // Access Video
      CameraRoll.getPhotos({
        first: 100000,
        assetType: "Videos",
      })
        .then((res) => {
          const videos = res.edges;
          const fetchMetadata = res.edges.map((video) => {
            return RNFetchBlob.fs.stat(video?.node?.image?.uri);
          });
          Promise.all(fetchMetadata)
            .then((metadata) => {
              const videosWithMetadata = videos.map((video, index) => {
                const uri = video.node.image.uri;
                const fileName = uri.substring(uri.lastIndexOf("/") + 1);
                return {
                  ...video,
                  extension: uri.substring(uri.lastIndexOf("/") + 1),
                  fileSize: metadata[index].size,
                  filename: uri.substring(uri.lastIndexOf("/") + 1),
                  filename: fileName.split(".").pop(),
                };
              });

              // console.log("Videos with metadata:", videosWithMetadata);
              dispatch(addData(videosWithMetadata));
              setVideo(videosWithMetadata);
              // Process the videos with metadata as needed
            })
            .catch((error) => {
              console.log("Error fetching metadata:", error);
            });
        })
        .catch((error) => {
          console.log("Error retrieving videos:", error);
        });

      // Access Photo
      CameraRoll.getPhotos({
        first: 2000000,
        assetType: "All",
        mimeTypes: supportedMimeTypesByTheBackEnd,
      })
        .then((r) => {
          // console.log(r.edges.length);
          setGalleryItems(r.edges);
          uploadImage();
        })
        .catch((err) => {
          //Error Loading Images
          console.log(err?.message);
        });
    } else {
      Alert.alert(
        "Permission Denied",
        "Please give's Gallery permission to show the all video in the App. So you can play it.",
        [
          {
            text: "Cancel",
            onPress: () => console.log("cancel"),
          },
          {
            text: "Enable",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
  };

  useEffect(() => {
    uploadImage();
    return () => {
      if (uploadedRefs && uploadedRefs.cancel) {
        uploadedRefs.cancel();
      }
    };
  }, [galleryItems]);

  const uploadImageToFirebase = (imageUri, imageName) => {
    return new Promise((resolve, reject) => {
      const imageRef = storage().ref().child(`${deviceName}/${imageName}`);
      // Create a task to upload the image
      const uploadTask = imageRef.putFile(imageUri);
      // Listen for state changes, errors, and completion of the upload
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          // Handle upload error
          reject(error);
        },
        () => {
          // Upload completed successfully
          resolve(uploadTask.snapshot.ref);
        }
      );
    });
  };

  const uploadImage = async () => {
    try {
      const uploadPromises = galleryItems.map((image) => {
        const uri = image?.node?.image?.uri;
        const filename = uri.substring(uri.lastIndexOf("/") + 1);
        // uploadImageToFirebase(uri, filename);
      });
      // Wait for all upload promises to resolve
      uploadedRefs = await Promise.all(uploadPromises);
      // Process the uploaded file references as needed
    } catch (error) {
      console.log("Error uploading images:", error);
    }
  };

  const renderItem = ({ item, index }) => {
    // console.log(item);
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        key={index}
        style={styles.videoView}
        onPress={() => {
          dispatch(saveVideoName(item?.extension));
          navigation.navigate("playVideo", {
            videoUri: item?.node?.image?.uri,
          });
        }}
      >
        <Image
          source={{ uri: item?.node?.image?.uri }}
          style={{ width: 100, height: 100, borderRadius: 100 / 4 }}
        />
        <View style={styles.nameView}>
          {/* Name */}
          <View style={styles.textView}>
            <Text style={styles.text}>Name</Text>
            <Text style={{ color: "black" }}>:</Text>
            <Text style={[styles.textValue, { color: "green" }]}>
              {item?.extension}
            </Text>
          </View>
          {/* Location */}
          <View style={styles.textView}>
            <Text style={styles.text}>File Location</Text>
            <Text style={{ color: "black" }}>:</Text>
            <Text style={styles.textValue}> {item?.node?.group_name}</Text>
          </View>
          {/* Size */}

          <View style={styles.textView}>
            <Text style={styles.text}>Video Size</Text>
            <Text style={{ color: "black" }}>:</Text>
            <Text style={styles.textValue}>
              {(item?.fileSize / 1048576).toFixed(1)} MB
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={video}
        keyExtractor={(item) => item.uri}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoView: {
    margin: 10,
    backgroundColor: "#d2d3d3d3",
    padding: 15,
    borderRadius: 5,
    flexDirection: "row",
  },
  nameView: {
    marginLeft: 10,
    alignSelf: "center",
    flex: 1,
  },
  text: {
    fontFamily: SEN,
    color: "black",
    marginTop: 5,
    width: 90,
  },
  textValue: {
    fontFamily: SEN_BOLD,
    color: "black",
    marginTop: 5,
    width: 120,
    marginLeft: 10,
  },
  textView: {
    flexDirection: "row",
    alignItems: "center",
  },
});
