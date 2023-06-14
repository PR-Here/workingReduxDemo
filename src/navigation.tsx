import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import Cart from './Cart';


const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Cart" component={Cart} />
  </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})