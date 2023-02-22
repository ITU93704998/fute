import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import IoniconsS from "@expo/vector-icons/MaterialIcons";
import Times from "./components/times";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Timer from "./components/timer";
import Timer10 from "./components/timer10";

import {
  View,
  ToastAndroid,
  FlatList,
  Image,
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
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
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
    setModalVisible1(!modalVisible1);
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
    setModalVisible2(!modalVisible2);
  }

  if (data == null) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffff",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "8%",
        }}
      >
        <Image
          style={{ width: 200, height: 200 }}
          source={require("./img/jogador.png")}
        />
        <Text
          style={{
            fontSize: 20,
            color: "orange",
            fontWeight: "bold",
            marginTop: 20,
          }}
        >
          Adcione jogadores na tela 'Lista' !
        </Text>
        <Text style={{ fontSize: 15, color: "#dcdcdc", fontWeight: "bold" }}>
          -Ou faça suas configurações da partida na tela 'Configuração'.
        </Text>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar style="dark" backgroundColor="white" />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            setModalVisible1(!modalVisible1);
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 3,
            }}
          >
            <View
              style={{
                width: "95%",
                backgroundColor: cortime01,
                padding: 20,
                borderRadius: 20,
                elevation: 10,
              }}
            >
              <Text
                style={{ fontSize: 35, color: "white", fontWeight: "bold" }}
              >
                O time{" "}
                {cortime01 == "#194B32"
                  ? "Verde"
                  : cortime01 == "#F44E3F"
                  ? "Vermelho"
                  : cortime01 == "#006494"
                  ? "Azul"
                  : "Laranja"}{" "}
                perdeu?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: "100%",
                  marginTop: 100,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                  onPress={() => TimerPerdeu1()}
                >
                  <Text
                    style={{
                      fontSize: 40,
                      fontWeight: "bold",
                      color: cortime01,
                    }}
                  >
                    Sim
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                  onPress={() => setModalVisible1(!modalVisible1)}
                >
                  <Text
                    style={{
                      fontSize: 40,
                      fontWeight: "bold",
                      color: cortime01,
                    }}
                  >
                    Não
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible1(!modalVisible2);
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 3,
            }}
          >
            <View
              style={{
                width: "95%",
                backgroundColor: cortime02,
                padding: 20,
                borderRadius: 20,
                elevation: 10,
              }}
            >
              <Text
                style={{ fontSize: 35, color: "white", fontWeight: "bold" }}
              >
                O time{" "}
                {cortime02 == "#194B32"
                  ? "Verde"
                  : cortime02 == "#F44E3F"
                  ? "Vermelho"
                  : cortime02 == "#006494"
                  ? "Azul"
                  : "Laranja"}{" "}
                perdeu?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: "100%",
                  marginTop: 100,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                  onPress={() => TimerPerdeu2()}
                >
                  <Text
                    style={{
                      fontSize: 40,
                      fontWeight: "bold",
                      color: cortime02,
                    }}
                  >
                    Sim
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                  onPress={() => setModalVisible2(!modalVisible2)}
                >
                  <Text
                    style={{
                      fontSize: 40,
                      fontWeight: "bold",
                      color: cortime02,
                    }}
                  >
                    Não
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            padding: 10,
            marginTop: 30,
          }}
        >
          <View
            style={{
              width: "45%",
              backgroundColor: cortime01,
              borderRadius: 5,
              elevation: 10,
            }}
          >
            <Times
              data={time01}
              valor={1}
              time01={time01}
              time02={time02}
              proximos={proximos}
              quantidade={quantidade}
            />
            <View
              style={{
                borderBottomColor: "#fff",
                borderBottomWidth: 3,
                marginTop: 5,
              }}
            />
            <TouchableOpacity
              onPress={() => setModalVisible1(!modalVisible1)}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
              >
                Perdeu
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: "5%" }}>
            <Text style={{ fontSize: 30, color: "orange", fontWeight: "bold" }}>
              X
            </Text>
          </View>
          <View
            style={{
              width: "45%",
              backgroundColor: cortime02,
              borderRadius: 5,
              elevation: 10,
            }}
          >
            <Times
              data={time02}
              valor={2}
              time01={time01}
              time02={time02}
              proximos={proximos}
              quantidade={quantidade}
            />
            <View
              style={{
                borderBottomColor: "#fff",
                borderBottomWidth: 3,
                marginTop: 5,
              }}
            />
            <TouchableOpacity
              onPress={() => setModalVisible2(!modalVisible2)}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
              >
                Perdeu
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ padding: 10, flex: 1 }}>
          <FlatList
            style={{
              paddingEnd: 5,
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
                        ? "98%"
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
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        color: "#696969",
                        fontWeight: "500",
                        fontSize: 15,
                        color: "#696969",
                      }}
                    >
                      {proximos.findIndex(
                        (element) => element.id === item.id
                      ) <=
                      quantidade - 1
                        ? "→"
                        : ""}
                    </Text>
                    <Text
                      style={{
                        color: "#696969",
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      {" "}
                      {item.nome}
                    </Text>
                  </View>
                </View>
                {proximos.findIndex((element) => element.id === item.id) + 1 ==
                1 ? (
                  <></>
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
  }
};

export default Jogo;
