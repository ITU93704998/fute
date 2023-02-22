import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import uuid from "react-native-uuid";
import IoniconsS from "@expo/vector-icons/MaterialIcons";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import {
  View,
  ToastAndroid,
  FlatList,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";

const List = () => {
  const [nome, setNome] = useState("");
  const [dataa, setData] = useState([]);
  const [veri, setVeri] = useState(false);
  const [config, setConfig] = useState([]);

  const getData = async () => {
    try {
      const jsonValueConfig = await AsyncStorage.getItem("@fute:config_jogo");
      setConfig(jsonValueConfig != null ? JSON.parse(jsonValueConfig) : null);
      const jsonValue = await AsyncStorage.getItem("@fute:list_jogadores");
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

  const novaData = [{ id: 212121, nome: "Adcione um jogador acima", ordem: 1 }];
  const data = dataa != null ? dataa : novaData;
  const quantidade = config != null ? config["quantidade"] : 21;

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  async function AddJogador(nome) {
    const id = uuid.v4();
    if (nome == null) {
      const message = "Adcione um nome!";
      showToast(message);
    } else {
      const newData = {
        id,
        nome,
        ordem: data != null ? data.length + 1 : 1,
        vezes: 0,
      };

      try {
        const response = await AsyncStorage.getItem("@fute:list_jogadores");
        const responseData = response ? JSON.parse(response) : [];

        const dataTotal = [...responseData, newData];

        await AsyncStorage.setItem(
          "@fute:list_jogadores",
          JSON.stringify(dataTotal)
        );
        const message = "Jogador " + nome + ", adcionado!";
        setVeri(!veri);
        showToast(message);
        setNome();
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function Subir(id) {
    const index = data.findIndex((element) => element.id == id);

    const posision = index + 1;
    try {
      const jogadoresantes = data.slice(0, posision - 2);
      const jogadorASerPassado = data.slice(posision - 2, posision - 1);
      const jogadorPassar = data.slice(posision - 1, posision);
      const jogadoresDepos = data.slice(posision, data.length);

      const NovaFormacao = [
        ...jogadoresantes,
        ...jogadorPassar,
        ...jogadorASerPassado,
        ...jogadoresDepos,
      ];

      await AsyncStorage.setItem(
        "@fute:list_jogadores",
        JSON.stringify(NovaFormacao)
      );
      setVeri(!veri);
      const message = "Jogador passou na frende!";
      showToast(message);
    } catch (e) {
      console.log(e);
    }
  }

  async function RemoveJogador(id) {
    const index = data.findIndex((element) => element.id === id);
    const posision = index + 1;
    if (posision <= quantidade) {
      try {
        const jogadoresPrimeiroTime = data.slice(0, quantidade);
        const SemJogadorExcluido = jogadoresPrimeiroTime.filter(
          (item) => item.id !== id
        );
        const primeiroProximo = data.slice(quantidade * 2, quantidade * 2 + 1);
        const jogadoresSegundoTime = data.slice(quantidade, quantidade * 2);
        const jogadoresDepos = data.slice(quantidade * 2 + 1, data.length);

        const NovaFormacao = [
          ...SemJogadorExcluido,
          ...primeiroProximo,
          ...jogadoresSegundoTime,
          ...jogadoresDepos,
        ];

        await AsyncStorage.setItem(
          "@fute:list_jogadores",
          JSON.stringify(NovaFormacao)
        );
        setVeri(!veri);
        const message = "Jogador deletado!";
        showToast(message);
      } catch (e) {
        console.log(e);
      }
    } else {
      const response = await AsyncStorage.getItem("@fute:list_jogadores");
      const responseData = response ? JSON.parse(response) : [];

      const data = responseData.filter((item) => item.id !== id);

      await AsyncStorage.setItem("@fute:list_jogadores", JSON.stringify(data));

      setData(data);

      const message = "Jogador deletado!";
      showToast(message);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white",
      }}
    >
      <StatusBar style="dark" backgroundColor="white" />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 50,
        }}
      >
        <TextInput
          style={{
            backgroundColor: "#5555",
            height: 29,
            padding: 5,
            borderRadius: 5,
            height: 50,
            width: "80%",
            color: "#696969",
          }}
          placeholder="nome jogador"
          onChangeText={setNome}
          value={nome}
          keyboardType="default"
        />
        <TouchableOpacity
          onPress={() => AddJogador(nome)}
          style={{
            height: 50,
            width: "15%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#027381",
            borderRadius: 6,
            elevation: 5,
          }}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FlatList
          style={{
            height: "90%",
            width: "100%",
            marginTop: 10,
            paddingBottom: 5,
          }}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => RemoveJogador(item.id)}
                style={{
                  width: "10%",
                  backgroundColor: "#F44E3F",
                  borderRadius: 6,
                  height: 50,
                  padding: 5,
                  elevation: 5,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IoniconsS name="delete" size={20} color="white" />
              </TouchableOpacity>
              <View
                style={{
                  width:
                    data.findIndex((element) => element.id === item.id) + 1 == 1
                      ? "85%"
                      : "75%",
                  backgroundColor: "#dcdcdc",
                  borderRadius: 6,
                  height: 50,
                  padding: 5,
                  elevation: 5,
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#696969", fontWeight: "bold", fontSize: 17 }}
                >
                  <Text
                    style={{
                      color: "#696969",
                      fontWeight: "500",
                      fontSize: 15,
                    }}
                  >
                    {data.findIndex((element) => element.id === item.id) + 1}º
                  </Text>
                  {"  "}
                  {item.nome}
                </Text>
              </View>
              {data.findIndex((element) => element.id === item.id) + 1 == 1 ? (
                <TouchableOpacity></TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => Subir(item.id)}
                  style={{
                    width: "10%",
                    backgroundColor: "#696969",
                    borderRadius: 6,
                    height: 50,
                    padding: 5,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 5,
                  }}
                >
                  <IoniconsS name="arrow-upward" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default List;
