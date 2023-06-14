import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import cartSlice from "../redux/slice/CartSlice";
import { removeFromCart } from "../redux/slice/CartSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchProduct } from "../redux/slice/ProductSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.cart);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={({ item, index }) => {
          console.log(item);
          
          return (
            <View style={styles.flatView}>
              <Image
                resizeMode="contain"
                style={styles.image}
                source={{ uri: item?.image }}
              />
              <View style={styles.textView}>
                {/* Title */}
                <Text>{item?.category}</Text>
                {/* Description */}
                <Text numberOfLines={3} style={{ marginTop: 10 }}>
                  {item?.description}
                </Text>
                {/* Price */}
                <Text style={{ marginTop: 10, color: "green" }}>
                  Rs. {item?.price}
                </Text>
                {/* Add to cart button */}
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => {
                    dispatch(removeFromCart(item));
                  }}
                >
                  <Text>Remove to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loader: {
    width: "100%",
    height: "100%",
    backgroundColor: "#00000099",
  },
  flatView: {
    marginTop: 10,
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    flexDirection: "row",
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    alignSelf: "center",
  },
  textView: {
    marginLeft: 20,
    alignItems: "flex-start",
    flex: 1,
  },
  addToCartButton: {
    marginTop: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
});
