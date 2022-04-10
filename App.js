import React, { useState, useEffect, useCallback } from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import List from "./src/list";
import Jogo from "./src/jogo";
import Config from "./src/config";
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#027381" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Jogo") {
              iconName = focused ? "futbol-o" : "futbol-o";
            } else if (route.name === "Lista") {
              iconName = focused ? "list" : "align-left";
            } else {
              iconName = focused ? "gear" : "gear";
            }
            // You can return any component that you like here!
            return <FontAwesome name={iconName} size={24} color={color} />;
          },

          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Lista"
          component={List}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Jogo"
          component={Jogo}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Configuração"
          component={Config}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
