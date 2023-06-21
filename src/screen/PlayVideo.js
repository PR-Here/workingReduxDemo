import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  PinchGestureHandler,
  PanResponder,
  Easing,
} from "react-native";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Orientation from "react-native-orientation-locker";
import Video from "react-native-video";
import Slider from "react-native-slider";
import { SEN, SEN_BOLD } from "../utils/MyFont";
import {
  BACK,
  CLOSE,
  FIT,
  MUTE,
  NEW_PLAY,
  NEXT,
  PAUSE,
  PLAY,
  SOUND,
} from "../utils/MyImage";
import VideoPopup from "../utils/VideoPopup";
import Draggable from "react-native-draggable";
import { getData } from "../redux/slice/GalleryDataSlice";
import { useSelector, useDispatch } from "react-redux";
import Lottie from "lottie-react-native";
import showToast from "../utils/Constant";
import { saveVideoName } from "../redux/slice/VideoNameSlice";

const DeviceWidth = Dimensions.get("window").width;
const DeviceHeight = Dimensions.get("window").height;

export default function PlayVideo({ navigation, route }) {
  const dispatch= useDispatch();
  const videoRef = React.useRef(null);
  const flatListRef = React.useRef(null);
  const draggableRef = React.useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [resizeMode, setResizeMode] = useState("cover");
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;
  const [isLandscape, setIsLandscape] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoUri, setVideoUri] = useState(route?.params?.videoUri);
  const [scale, setScale] = useState(1);
  const [myIndex, setIndex] = useState(null);
  const animationRef = useRef(null);
  const animationProgress = useRef(new Animated.Value(0));
  const [mute, setMute] = useState(false);
  const lastTapRef = useRef(0);
  const [lastPressTime, setLastPressTime] = useState(0);

  // Redux Data
  const galleryData = useSelector((state) => state.gallery.data);

  useEffect(() => {
    Orientation.addOrientationListener(handleOrientationChange);
    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, [isLandscape]);

  const handleOrientationChange = (orientation) => {
    console.log(orientation);
    setIsLandscape(orientation === "LANDSCAPE-LEFT");
  };

  const toggleOrientation = () => {
    if (isLandscape) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
  };

  useEffect(() => {
    if (showControls) {
      Animated.spring(slideAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showControls]);

  useEffect(() => {
    if (showControls) {
      Animated.spring(translateYValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateYValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showControls]);

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  const onProgress = (data) => {
    const { currentTime, seekableDuration } = data;
    setCurrentTime(currentTime);
    setDuration(seekableDuration);
  };

  const onSliderChange = (value) => {
    if (videoRef.current) {
      videoRef.current.seek(value);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const formatPlayTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedTime = `${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
    return formattedTime;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        showToast("Play");
        videoRef.current.paused = false;
      } else {
        showToast("Pause");
        videoRef.current.paused = true;
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onVideoEnd = () => {
    console.log("Video ended");
    setIsPlaying(!isPlaying);
    setCurrentTime(0);
    videoRef.current.seek(0);
    showToast("Video End.");
    setModalVisible(true);
  };

  const fitVideoSize = () => {
    // if (resizeMode == "contain") {
    //   setResizeMode("cover");
    // } else if (resizeMode == "cover") {
    //   setResizeMode("stretch");
    // } else {
    //   setResizeMode("contain");
    // }
    toggleOrientation();
  };

  const skipForward = () => {
    if (videoRef.current) {
      showToast("10 Sec >>");
      videoRef.current.seek(currentTime + 10);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      showToast("<< 10 Sec.");
      videoRef.current.seek(currentTime - 10);
    }
  };

  const handlePopup = () => {
    setModalVisible(false);
  };

  const memoizedOnPress = React.useCallback(
    (bool, uri, index) => {
      setModalVisible(false);
      setVideoUri(uri);
      setIsPlaying(!isPlaying);
      setIndex(index);
    },
    [myIndex]
  );

  const scrollToIndex = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: myIndex,
        animated: true,
      });
    }
  };

  const handleSound = () => {
    setMute(!mute);
  };

  const handleDoubleClick = (side) => {
    const currentTime = new Date().getTime();
    const DOUBLE_PRESS_DELAY = 300; // Adjust this value as per your requirements

    if (currentTime - lastPressTime < DOUBLE_PRESS_DELAY) {
      // Double-click action
      setIsPlaying((prevState) => !prevState);
    } else {
      // Single click
      setLastPressTime(currentTime);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        setShowControls(!showControls);
      }}
      style={{
        flex: 1,
        backgroundColor: "white",
        position: "relative",
      }}
    >
      {/* Video */}
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        paused={isPlaying}
        style={{ width: DeviceWidth, height: DeviceHeight }}
        repeat={repeat}
        resizeMode={resizeMode}
        ignoreSilentSwitch="ignore"
        playInBackground={true}
        fullscreenAutorotate={true}
        muted={mute}
        onLoad={() => console.log("Video loaded")}
        onError={(error) => console.log("Video error:", error)}
        onProgress={onProgress}
        onFullscreenPlayerWillPresent={() =>
          console.log("Entering full screen")
        }
        onFullscreenPlayerDidDismiss={() => console.log("Exiting full screen")}
        onEnd={onVideoEnd}
      />
      {showControls && (
        <TouchableOpacity
          onPress={() => setShowControls(!showControls)}
          activeOpacity={0.8}
          style={[
            styles.allControlView,
            {
              transform: [
                {
                  translateY: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Slider View */}
          <View style={styles.sliderView}>
            {/* Volume Slider */}

            {/* Start Time Text */}
            <Text style={styles.timeText}>{formatPlayTime(currentTime)}</Text>
            {/* Slider */}
            <Slider
              style={{ width: "50%", marginLeft: 30 }}
              minimumValue={0}
              maximumValue={duration == 0 ? duration : duration - 1}
              value={currentTime}
              onValueChange={onSliderChange}
              thumbTintColor="green"
              minimumTrackTintColor="green"
              maximumTrackTintColor="#808080"
            />
            {/* Total time */}
            <Text style={[styles.timeText, { marginLeft: 30 }]}>
              {formatDuration(duration)}
            </Text>
          </View>
          {/* Control View */}
          <View style={styles.buttonControlView}>
            {/* BACK */}
            <TouchableOpacity style={styles.playButton} onPress={skipBackward}>
              <Image
                source={BACK}
                style={{ width: 20, height: 20, tintColor: "green" }}
              />
            </TouchableOpacity>
            {/* Play Button */}
            <TouchableOpacity
              style={[styles.playButton, { marginLeft: 20 }]}
              onPress={togglePlayPause}
            >
              <Image
                source={isPlaying ? PLAY : PAUSE}
                style={{ width: 20, height: 20, tintColor: "green" }}
              />
            </TouchableOpacity>
            {/* NEXT */}
            <TouchableOpacity
              style={[styles.playButton, { marginLeft: 20 }]}
              onPress={skipForward}
            >
              <Image
                source={NEXT}
                style={{ width: 20, height: 20, tintColor: "green" }}
              />
            </TouchableOpacity>
            {/* Resize */}
            <TouchableOpacity
              style={[styles.playButton, { marginLeft: 20 }]}
              onPress={fitVideoSize}
            >
              <Image
                source={FIT}
                style={{ width: 20, height: 20, tintColor: "green" }}
              />
            </TouchableOpacity>
            {/* Sound */}
            <TouchableOpacity
              style={[styles.playButton, { marginLeft: 20 }]}
              onPress={handleSound}
            >
              <Image
                source={!mute ? SOUND : MUTE}
                style={{ width: 20, height: 20, tintColor: "green" }}
              />
            </TouchableOpacity>
          </View>
          {/* Drag Button */}
          <Draggable
            ref={draggableRef}
            x={Dimensions.get("window").width - 80}
            y={Dimensions.get("window").height - 200}
            renderSize={66}
            renderColor="green"
            renderText="Click me"
            isCircle
            onShortPressRelease={() => {
              setIsPlaying(!isPlaying);
              setTimeout(() => {
                scrollToIndex();
              }, 100);
              setModalVisible(!modalVisible);
            }}
          >
            <Lottie
              ref={animationRef}
              source={require("../../assets/anim/video.json")}
              style={{ width: 50, height: 50 }}
              autoPlay
              progress={animationProgress.current}
            />
          </Draggable>
        </TouchableOpacity>
      )}
      {/* Bottom View Modal */}
      {modalVisible ? (
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.bottomPopupView,
            {
              transform: [],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              handlePopup();
            }}
            style={styles.cutView}
          >
            <Image
              style={{ width: 20, height: 20, tintColor: "white" }}
              source={CLOSE}
            />
          </TouchableOpacity>
          <FlatList
            style={{}}
            ref={flatListRef}
            onScrollToIndexFailed={(error) => {
              flatListRef.current.scrollToOffset({
                offset: error.averageItemLength * error.index,
                animated: true,
              });
              setTimeout(() => {
                if (flatListRef.current) {
                  flatListRef.current.scrollToIndex({
                    index: error.index,
                    animated: true,
                  });
                }
              }, 100);
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
            nestedScrollEnabled
            data={galleryData.flat()}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={{
                    margin: 10,
                    borderRadius: 10,
                    width: 85,
                    height: 85,
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: myIndex == index ? "red" : "transparent",
                    borderWidth: 5,
                    elevation: 5,
                  }}
                  onPress={() => {
                    dispatch(saveVideoName(item?.extension))
                    memoizedOnPress(false, item?.node?.image?.uri, index);
                  }}
                >
                  <ImageBackground
                    borderRadius={8}
                    style={[styles.imageBackground, {}]}
                    source={{ uri: item?.node?.image?.uri }}
                  >
                    <View style={styles.view}>
                      <Image style={styles.playImage} source={NEW_PLAY} />
                      <Text style={styles.durationText}>
                        {(item?.fileSize / 1048576).toFixed(1)} mb
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
          />
        </TouchableOpacity>
      ) : null}
      {/* <VideoPopup handlePopup={handlePopup} modalVisible={modalVisible}  /> */}
    </TouchableOpacity>
  );
}

var styles = StyleSheet.create({
  backgroundVideo: {
    flex: 1,
  },
  sliderView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    alignItems: "center",
    // backgroundColor: "red",
    alignContent: "center",
    flexWrap: "wrap",
  },
  timeText: {
    fontFamily: SEN_BOLD,
    color: "black",
  },
  allControlView: {
    height: "100%",
    position: "absolute",
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignSelf: "center",
    flex: 1,
    flexWrap: "wrap",
  },
  buttonControlView: {
    flexDirection: "row",
    // backgroundColor: "green",
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  playButton: {
    borderWidth: 1,
    borderRadius: 100 / 2,
    padding: 10,
    borderColor: "green",
  },
  portraitVideo: {},
  landscapeVideo: {},
  cutView: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  bottomPopupView: {
    position: "absolute",
    backgroundColor: "#00000099",
    height: "30%",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    alignItems: "flex-end",
    alignContent: "flex-end",
    bottom: 0,
  },
  imageBackground: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignSelf: "center",
  },
  playImage: {
    width: 12,
    height: 12,
    alignSelf: "center",
    tintColor: "white",
  },
  view: {
    flexDirection: "row",
    backgroundColor: "#d3d3d3d3",
    position: "absolute",
    bottom: 5,
    padding: 5,
    borderRadius: 10,
    alignSelf: "center",
  },
  durationText: {
    fontFamily: SEN,
    fontSize: 11,
    marginLeft: 5,
  },
  sliderVolume: {
    width: 300,
    marginTop: 20,
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});