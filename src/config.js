import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import uuid from "react-native-uuid";
import IoniconsS from "@expo/vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

import {
  View,
  ToastAndroid,
  FlatList,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";

const Config = () => {
  const [dataa, setData] = useState([]);
  const [veri, setVeri] = useState(false);

  const novaData = [
    { id: 212121, quantidade: 1, cortime01: "red", cortime02: "blue" },
  ];

  const data = dataa != null ? dataa : novaData;

  const quantidadeFilter = data["quantidade"] != null ? data["quantidade"] : 7;
  const cortime01Filter =
    data["cortime01"] != null ? data["cortime01"] : "#F44E3F";
  const cortime02Filter =
    data["cortime02"] != null ? data["cortime02"] : "#006494";

  const [quantidade, setQuantidade] = useState(parseInt(quantidadeFilter));
  const [cortime01, setCortime01] = useState(cortime01Filter);
  const [cortime02, setCortime02] = useState(cortime02Filter);

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  async function DeleteTudo() {
    try {
      await AsyncStorage.removeItem("@fute:list_jogadores");
      await AsyncStorage.removeItem("@fute:config_jogo");
      await AsyncStorage.removeItem("@fute:vezes_time_01");
      await AsyncStorage.removeItem("@fute:vezes_time_02");
      setVeri(!veri);
      const message = "Jogo deletado!";
      showToast(message);
    } catch (e) {
      console.log(e);
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@fute:config_jogo");
      setData(jsonValue != null ? JSON.parse(jsonValue) : null);
    } catch (e) {
      console.log(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [veri])
  );

  async function CriarConfig() {
    if (quantidade !== null) {
      const id = uuid.v4();
      const newData = {
        id,
        quantidade: parseInt(quantidade),
        cortime01,
        cortime02,
      };
      await AsyncStorage.setItem("@fute:config_jogo", JSON.stringify(newData));
      const message = "Configuração atualizada!";
      showToast(message);
    } else {
      const message = "adcione uma quantidade de jogador por time!";
      showToast(message);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#027381",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "flex-start",
          width: "100%",
          marginTop: 10,
          backgroundColor: "#ffff",
          padding: 10,
          borderRadius: 6,
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: "bold", color: "#696969" }}>
          Jogador por time?
        </Text>
        <TextInput
          style={{
            backgroundColor: "#dcdcdc",
            height: 29,
            padding: 5,
            borderRadius: 5,
            height: 50,
            marginTop: 10,
            width: "100%",
            color: "#696969",
          }}
          placeholder="00"
          onChangeText={setQuantidade}
          maxLength={2}
          value={quantidade.toString()}
          keyboardType="numeric"
        />

        <Text
          style={{
            fontSize: 17,
            fontWeight: "bold",
            color: "#696969",
            marginTop: 20,
          }}
        >
          Cor Colete primeiro time?
        </Text>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Ionicons name="shirt-sharp" size={24} color={cortime01} />
          <Picker
            style={{
              width: "90%",
              fontSize: 20,
              color: "#696969",
              fontWeight: "bold",
            }}
            selectedValue={cortime01}
            onValueChange={(itemValue, itemIndex) => setCortime01(itemValue)}
          >
            <Picker.Item label="Vermelho" value="#F44E3F" />
            <Picker.Item label="Azul" value="#006494" />
            <Picker.Item label="Laranja" value="#F28E36" />
            <Picker.Item label="Verde" value="#194B32" />
          </Picker>
        </View>
        <View
          style={{
            borderBottomColor: "#dcdcdc",
            borderBottomWidth: 1,
          }}
        />
        <Text
          style={{
            fontSize: 17,
            fontWeight: "bold",
            color: "#696969",
            marginTop: 20,
          }}
        >
          Cor Colete segundo time?
        </Text>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Ionicons name="shirt-sharp" size={24} color={cortime02} />
          <Picker
            style={{
              width: "90%",
              fontSize: 20,
              color: "#696969",
              fontWeight: "bold",
            }}
            selectedValue={cortime02}
            onValueChange={(itemValue, itemIndex) => setCortime02(itemValue)}
          >
            <Picker.Item label="Vermelho" value="#F44E3F" />
            <Picker.Item label="Azul" value="#006494" />
            <Picker.Item label="Laranja" value="#F28E36" />
            <Picker.Item label="Verde" value="#194B32" />
          </Picker>
        </View>

        <TouchableOpacity
          onPress={() => CriarConfig()}
          style={{
            width: "100%",
            backgroundColor: "green",
            borderRadius: 6,
            height: 50,
            padding: 5,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Salvar Configuração
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => DeleteTudo()}
        style={{
          width: "100%",
          backgroundColor: "#ffff",
          borderRadius: 6,
          height: 50,
          padding: 5,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: "#F44E3F",
            fontWeight: "500",
          }}
        >
          Excluir toda Configuração
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Config;
