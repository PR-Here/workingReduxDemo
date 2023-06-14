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
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProduct } from "../redux/slice/ProductSlice";
import { addToCart } from "../redux/slice/CartSlice";
import { cartCount } from "../redux/slice/CartSlice";

export default function HomeScreen({ navigation }) {
  interface Post {
    id: number;
    title: string;
    image: string;
  }

  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const count = useSelector((state) => state.cart);

  console.log("-------->>>>>>>. ", count);

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={({ item, index }) => {
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
                <Text
                  onPress={() => navigation.navigate("Cart")}
                  numberOfLines={3}
                  style={{ marginTop: 10 }}
                >
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
                    dispatch(addToCart(item));
                  }}
                >
                  <Text>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <View style={{ marginLeft: 10 }}>
        <Text>{"" + count.length}</Text>
      </View>

      {/* Bottom View */}
      {loading ? (
        <ActivityIndicator color={"yellow"} style={styles.loader} />
      ) : null}
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
