import React, { useState, useCallback, useEffect } from "react";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  TextInput,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  View,
  Button,
  TouchableHighlight,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Timer } from "react-native-stopwatch-timer";
import { Audio } from "expo-av";

const Timer10 = () => {
  const [isTimerStart, setIsTimerStart] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(require("./apt.mp3"));
    sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;

    console.log("Playing Sound");
    await sound.playAsync();
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionStyle}>
        <Timer
          totalDuration={60000 * 10}
          msecs={false}
          //Time Duration
          start={isTimerStart}
          //To start
          reset={resetTimer}
          //To reset
          options={options}
          //options for the styling
          handleFinish={() => {
            playSound();
          }}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableHighlight
            onPress={() => {
              setIsTimerStart(!isTimerStart);
              setResetTimer(false);
            }}
          >
            <Entypo
              name={!isTimerStart ? "controller-play" : "controller-paus"}
              size={40}
              color="orange"
            />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              setIsTimerStart(false);
              setResetTimer(true);
            }}
          >
            <Entypo name="ccw" size={40} color="orange" />
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
};

export default Timer10;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
  buttonText: {
    fontSize: 20,
    marginTop: 10,
  },
});

const options = {
  container: {
    width: "100%",
    alignItems: "center",
  },
  text: {
    fontSize: 94,
    color: "white",
    marginLeft: 7,
  },
};
