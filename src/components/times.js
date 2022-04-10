import React, { useState, useEffect } from "react";
import IoniconsS from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  ToastAndroid,
  FlatList,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";

function Times(props) {
  const [veri, setVeri] = useState(false);

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  return (
    <View style={{ padding: 5 }}>
      <FlatList
        style={{
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
        data={props.data}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#ffff", fontWeight: "bold", fontSize: 16 }}
              >
                {item.nome}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default Times;
