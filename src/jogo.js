import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import IoniconsS from "@expo/vector-icons/MaterialIcons";
import Times from "./components/times";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Timer from "./components/timer";
import Timer10 from "./components/timer10";

import {
  View,
  ToastAndroid,
  FlatList,
  Alert,
  TextInput,
  Modal,
  Text,
  TouchableOpacity,
} from "react-native";

const Jogo = () => {
  const [config, setConfig] = useState([]);
  const [data, setData] = useState([]);
  const [veszezTime01, setVezezTime01] = useState([]);
  const [veszezTime02, setVezezTime02] = useState([]);
  const novaData = { id: 1, vezes: 1 };
  const quantidade = config != null ? config["quantidade"] : 7;
  const cortime01 = config != null ? config["cortime01"] : "red";
  const cortime02 = config != null ? config["cortime02"] : "green";
  const [modalVisible, setModalVisible] = useState(false);
  const [valorTimer, setValoTimer] = useState(10);

  const vezes2filter =
    veszezTime02 != null ? veszezTime02["vezes"] : novaData["vezes"];
  const vezes1filter =
    veszezTime01 != null ? veszezTime01["vezes"] : novaData["vezes"];

  const [veri, setVeri] = useState(false);

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@fute:config_jogo");
      setConfig(jsonValue != null ? JSON.parse(jsonValue) : null);
      const jsonValueData = await AsyncStorage.getItem("@fute:list_jogadores");
      setData(jsonValueData != null ? JSON.parse(jsonValueData) : null);
      const jasonVezes01 = await AsyncStorage.getItem("@fute:vezes_time_01");
      setVezezTime01(jasonVezes01 != null ? JSON.parse(jasonVezes01) : null);
      const jasonVezes02 = await AsyncStorage.getItem("@fute:vezes_time_02");
      setVezezTime02(jasonVezes02 != null ? JSON.parse(jasonVezes02) : null);
    } catch (e) {
      console.log(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [veri])
  );

  async function Subir(id) {
    const index = data.findIndex((element) => element.id === id);

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
      const message = "Jogador Mudou de lugar!";
      showToast(message);
    } catch (e) {
      console.log(e);
    }
  }

  const time01 = data !== null ? data.slice(0, parseInt(quantidade)) : [];
  const time02 =
    data !== null
      ? data.slice(parseInt(quantidade), parseInt(quantidade) * 2)
      : [];
  const proximos =
    data !== null ? data.slice(parseInt(quantidade) * 2, 100) : [];
  const proximosFilter =
    data !== null
      ? data.slice(parseInt(quantidade) * 2, parseInt(quantidade) * 3)
      : [];

  async function SubirTime1() {
    try {
      const jogadoresTopo = data.slice(0, parseInt(quantidade) - 1);
      const primeirojogador = proximos.slice(0, 1);
      const proximosSemPrimeiro = proximos.slice(1, proximos.length);
      const ultimoDoTime = data.slice(
        parseInt(quantidade) - 1,
        parseInt(quantidade)
      );
      const NovaFormacao = [
        ...jogadoresTopo,
        ...primeirojogador,
        ...time02,
        ...ultimoDoTime,
        ...proximosSemPrimeiro,
      ];

      await AsyncStorage.setItem(
        "@fute:list_jogadores",
        JSON.stringify(NovaFormacao)
      );
      setVeri(!veri);
      const message = "Jogador Mudou de lugar!";
      showToast(message);
    } catch (e) {
      const message = "Erro, tente novamente!";
      showToast(message);
      console.log(e);
    }
  }
  async function SubirTime2() {
    try {
      const jogadoresTopo = data.slice(
        parseInt(quantidade),
        parseInt(quantidade) * 2 - 1
      );
      const primeirojogador = proximos.slice(0, 1);
      const proximosSemPrimeiro = proximos.slice(1, proximos.length);
      const ultimoDoTime = data.slice(
        parseInt(quantidade) * 2 - 1,
        parseInt(quantidade) * 2
      );
      const NovaFormacao = [
        ...time01,
        ...jogadoresTopo,
        ...primeirojogador,
        ...ultimoDoTime,
        ...proximosSemPrimeiro,
      ];

      await AsyncStorage.setItem(
        "@fute:list_jogadores",
        JSON.stringify(NovaFormacao)
      );
      setVeri(!veri);
      const message = "Jogador Mudou de lugar!";
      showToast(message);
    } catch (e) {
      console.log(e);
    }
  }

  async function TimerPerdeu1() {
    const timePrimerio = time01;
    const timeSegundo = time02;
    const timeProximos = proximos;
    const FiltrarPrimeirosProximo = timeProximos.slice(0, quantidade);
    const SobrouProximosFilter = timeProximos.slice(
      quantidade,
      timeProximos.length
    );
    if (proximos.length < parseInt(quantidade)) {
      const message =
        "Não tem próximos suficientes para montar um time, faça isso manualmente!";
      showToast(message);
    } else {
      try {
        const NovaFormacao = [
          ...FiltrarPrimeirosProximo,
          ...timeSegundo,
          ...SobrouProximosFilter,
          ...timePrimerio,
        ];

        const newDataPerdeu = {
          id: 1,
          vezes: 1,
        };
        const newDataGanhou = {
          id: 1,
          vezes: vezes2filter + 1,
        };

        await AsyncStorage.setItem(
          "@fute:vezes_time_01",
          JSON.stringify(newDataPerdeu)
        );
        await AsyncStorage.setItem(
          "@fute:vezes_time_02",
          JSON.stringify(newDataGanhou)
        );
        await AsyncStorage.setItem(
          "@fute:list_jogadores",
          JSON.stringify(NovaFormacao)
        );
        setVeri(!veri);
        const message = "Subiu os próximos para o primeiro time!";
        showToast(message);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function TimerPerdeu2() {
    const timePrimerio = time01;
    const timeSegundo = time02;
    const timeProximos = proximos;
    const FiltrarPrimeirosProximo = timeProximos.slice(0, quantidade);
    const SobrouProximosFilter = timeProximos.slice(
      quantidade,
      timeProximos.length
    );

    if (proximos.length < parseInt(quantidade)) {
      const message =
        "Não tem próximos suficientes para montar um time, faça isso manualmente!";
      showToast(message);
    } else {
      try {
        const NovaFormacao = [
          ...timePrimerio,
          ...FiltrarPrimeirosProximo,
          ...SobrouProximosFilter,
          ...timeSegundo,
        ];

        const newDataPerdeu = {
          id: 1,
          vezes: 1,
        };
        const newDataGanhou = {
          id: 1,
          vezes: vezes1filter + 1,
        };

        await AsyncStorage.setItem(
          "@fute:vezes_time_01",
          JSON.stringify(newDataGanhou)
        );
        await AsyncStorage.setItem(
          "@fute:vezes_time_02",
          JSON.stringify(newDataPerdeu)
        );

        await AsyncStorage.setItem(
          "@fute:list_jogadores",
          JSON.stringify(NovaFormacao)
        );
        setVeri(!veri);
        const message = "Subiu os próximos para o segundo time!";
        showToast(message);
      } catch (e) {
        console.log(e);
      }
    }
  }
  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <StatusBar style="light" backgroundColor="#027381" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <StatusBar style="light" backgroundColor="#000" />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setValoTimer(7)}
              style={{
                backgroundColor: valorTimer == 7 ? "orange" : "#696969",
                padding: 5,
                borderRadius: 6,
                width: "40%",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 17 }}>
                7 Minutos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setValoTimer(10)}
              style={{
                backgroundColor: valorTimer == 10 ? "orange" : "#696969",
                padding: 5,
                borderRadius: 6,
                width: "40%",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 17 }}>
                10 Minutos
              </Text>
            </TouchableOpacity>
          </View>

          {valorTimer == 7 ? <Timer /> : <Timer10 />}
          <View
            style={{
              borderBottomColor: "#dcdcdc",
              borderBottomWidth: 1,
            }}
          />
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, color: "#dcdcdc", fontWeight: "500" }}>
              Próximo time :
            </Text>
            <FlatList
              style={{
                padding: 5,
              }}
              showsVerticalScrollIndicator={false}
              data={proximosFilter}
              renderItem={({ item }) => (
                <Text
                  style={{ fontSize: 40, color: "orange", fontWeight: "bold" }}
                >
                  <Text
                    style={{
                      color: "#dcdcdc",
                      fontWeight: "500",
                      fontSize: 20,
                    }}
                  >
                    {data.findIndex((element) => element.id === item.id) -
                      quantidade * 2 +
                      1}
                    º{"  "}
                  </Text>
                  {item.nome}
                </Text>
              )}
            />
          </View>
        </View>
      </Modal>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          padding: 10,
          marginTop: -15,
          height: "37%",
        }}
      >
        <View
          style={{
            width: "45%",
            backgroundColor: cortime01,
            borderRadius: 5,
            padding: 10,
            elevation: 10,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "bold" }}>
              {vezes1filter}º Partida
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: "#dcdcdc",
              borderBottomWidth: 1,
              marginTop: 2,
            }}
          />
          <Times
            data={time01}
            valor={1}
            time01={time01}
            time02={time02}
            proximos={proximos}
            quantidade={quantidade}
          />
        </View>
        <View style={{ width: "5%" }}>
          <Text style={{ fontSize: 30, color: "#dcdcdc", fontWeight: "bold" }}>
            X
          </Text>
        </View>
        <View
          style={{
            width: "45%",
            backgroundColor: cortime02,
            borderRadius: 5,
            padding: 10,
            elevation: 10,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "bold" }}>
              {vezes2filter}º Partida
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: "#dcdcdc",
              borderBottomWidth: 1,
              marginTop: 2,
            }}
          />
          <Times
            data={time02}
            valor={2}
            time01={time01}
            time02={time02}
            proximos={proximos}
            quantidade={quantidade}
          />
        </View>
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#dcdcdc",
          padding: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => TimerPerdeu1()}
          style={{
            backgroundColor: cortime01,
            height: 40,
            width: "35%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            padding: 5,
          }}
        >
          <IoniconsS
            name="arrow-downward"
            size={12}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={{ fontSize: 12, color: "#ffff", fontWeight: "bold" }}>
            Esse Time Perdeu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{}}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <MaterialCommunityIcons name="timer" size={40} color="#027381" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => TimerPerdeu2()}
          style={{
            backgroundColor: cortime02,
            height: 40,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "35%",
            borderRadius: 10,
            padding: 5,
            elevation: 10,
          }}
        >
          <Text style={{ fontSize: 12, color: "#fff", fontWeight: "bold" }}>
            Esse Time Perdeu
          </Text>
          <IoniconsS
            name="arrow-downward"
            size={12}
            color="#ffff"
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ padding: 10, height: "59%" }}>
        <FlatList
          style={{
            padding: 5,
          }}
          showsVerticalScrollIndicator={false}
          data={proximos}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                alignItems: "center",
                marginTop: 10,
                borderRadius: 6,
              }}
            >
              <View
                style={{
                  width:
                    proximos.findIndex((element) => element.id === item.id) +
                      1 ==
                    1
                      ? "60%"
                      : "80%",

                  borderRadius: 6,
                  height: 50,
                  padding: 5,
                  backgroundColor: "#dcdcdc",
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
                    {data.findIndex((element) => element.id === item.id) -
                      quantidade * 2 +
                      1}
                    º
                  </Text>{" "}
                  {item.nome}
                </Text>
              </View>
              {proximos.findIndex((element) => element.id === item.id) + 1 ==
              1 ? (
                <>
                  <TouchableOpacity
                    onPress={() => SubirTime1()}
                    style={{
                      width: "15%",
                      backgroundColor: cortime01,
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
                  <TouchableOpacity
                    onPress={() => SubirTime2()}
                    style={{
                      width: "15%",
                      backgroundColor: cortime02,
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
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => Subir(item.id)}
                  style={{
                    width: "15%",
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

export default Jogo;
