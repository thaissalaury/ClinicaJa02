import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // 🚨 erros
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");

  function fazerLogin() {
    let erro = false;

    setEmailError("");
    setSenhaError("");

    // valida email
    if (!email.includes("@")) {
      setEmailError("E-mail inválido");
      erro = true;
    }

    // valida senha
    if (senha.length < 4) {
      setSenhaError("Senha deve ter pelo menos 4 caracteres");
      erro = true;
    }

    if (erro) return;

    // login simulado
    if (email.includes("medico")) {
      router.push("/medico");
    } else {
      router.push("/cliente");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* ÍCONE */}
      <Ionicons name="medical" size={70} color="#007AFF" />

      <Text style={styles.titulo}>ClínicaJá</Text>
      <Text style={styles.subtitulo}>
        Bem-vindo! Faça login para continuar.
      </Text>

      {/* EMAIL */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={22} color="#777" style={styles.icon} />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError("");
          }}
        />
      </View>

      {emailError ? (
        <Text style={styles.errorText}>{emailError}</Text>
      ) : null}

      {/* SENHA */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={22} color="#777" style={styles.icon} />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={(text) => {
            setSenha(text);
            setSenhaError("");
          }}
        />

        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Ionicons
            name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      {senhaError ? (
        <Text style={styles.errorText}>{senhaError}</Text>
      ) : null}

      {/* BOTÃO */}
      <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      {/* LINKS */}
      <TouchableOpacity>
        <Text style={styles.link}>Esqueci minha senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.link}>Não possui conta? Cadastre-se</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

/* 🎨 STYLE */
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
    marginBottom: 10,
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

  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: "12%",
  },
});