import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function fazerLogin() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Erro", "Digite um e-mail válido.");
      return;
    }

    Alert.alert("Sucesso", "Login realizado!");
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Ionicons name="medical" size={70} color="#007AFF" />

      <Text style={styles.titulo}>ClínicaJá</Text>
      <Text style={styles.subtitulo}>
        Bem-vindo! Faça login para continuar.
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={22}
          color="#777"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={22}
          color="#777"
          style={styles.icon}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Ionicons
            name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>Esqueci minha senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>
          Não possui conta? Cadastre-se
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backgroundColor: "#F4F8FB",
  },

  titulo: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 10,
  },

  subtitulo: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 35,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 18,
  },

  icon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
  },

  botao: {
    width: "65%",
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  textoBotao: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  link: {
    color: "#007AFF",
    fontSize: 15,
    marginTop: 18,
    textAlign: "center",
  },
}
);