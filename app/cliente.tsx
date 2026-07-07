import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const acoes = [
  {
    titulo: "Agendar",
    icon: "add-circle-outline",
    cor: "#007AFF",
  },
  {
    titulo: "Reagendar",
    icon: "calendar-outline",
    cor: "#10B981",
  },
  {
    titulo: "Perfil",
    icon: "person-outline",
    cor: "#F59E0B",
  },
] as const;

const historico = [
  {
    data: "12 jun",
    titulo: "Consulta clínica",
    detalhe: "Dra. Ana Costa",
  },
  {
    data: "28 mai",
    titulo: "Retorno de exames",
    detalhe: "Dr. Paulo Mendes",
  },
] as const;

export default function Cliente() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const background = isDark ? "#0F172A" : "#F4F8FB";
  const surface = isDark ? "#1E293B" : "#fff";
  const border = isDark ? "#334155" : "#E5EAF0";
  const text = isDark ? "#fff" : "#111";
  const muted = isDark ? "#CBD5E1" : "#666";

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: background },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Sair"
            style={[styles.iconButton, { backgroundColor: surface, borderColor: border }]}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="log-out-outline" size={22} color={isDark ? "#CBD5E1" : "#666"} />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Ionicons
            name="person-circle-outline"
            size={70}
            color={isDark ? "#60A5FA" : "#007AFF"}
          />

          <Text style={[styles.title, { color: text }]}>Área do Paciente</Text>

          <Text style={{ color: muted }}>Bem-vindo ao ClínicaJá, João</Text>
        </View>

        <View style={styles.quickActions}>
          {acoes.map((acao) => (
            <TouchableOpacity
              key={acao.titulo}
              activeOpacity={0.84}
              accessibilityRole="button"
              accessibilityLabel={acao.titulo}
              style={[styles.actionCard, { backgroundColor: surface, borderColor: border }]}
            >
              <Ionicons name={acao.icon} size={24} color={acao.cor} />
              <Text style={[styles.actionText, { color: text }]}>{acao.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: surface,
              borderColor: border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={28} color="#007AFF" />
            <Text style={[styles.cardTitle, { color: text }]}>Próxima consulta</Text>
          </View>

          <Text style={[styles.appointmentDate, { color: text }]}>
            18 de julho, 09:30
          </Text>

          <View style={styles.doctorRow}>
            <View style={styles.doctorIcon}>
              <Ionicons name="medical-outline" size={22} color="#007AFF" />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={[styles.doctorName, { color: text }]}>Dra. Ana Costa</Text>
              <Text style={{ color: muted }}>Cardiologista</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>Confirmada</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: surface,
              borderColor: border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={28} color="#F59E0B" />
            <Text style={[styles.cardTitle, { color: text }]}>Histórico</Text>
          </View>

          <View style={styles.historyList}>
            {historico.map((item) => (
              <View key={`${item.data}-${item.titulo}`} style={styles.historyRow}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{item.data}</Text>
                </View>

                <View style={styles.historyInfo}>
                  <Text style={[styles.historyTitle, { color: text }]}>{item.titulo}</Text>
                  <Text style={{ color: muted }}>{item.detalhe}</Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDark ? "#CBD5E1" : "#999"}
                />
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: surface,
              borderColor: border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="medkit-outline" size={28} color="#10B981" />
            <Text style={[styles.cardTitle, { color: text }]}>Médicos disponíveis</Text>
          </View>

          <Text style={{ color: muted }}>
            6 profissionais com horários livres nesta semana.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.86}
          accessibilityRole="button"
          accessibilityLabel="Agendar consulta"
          style={styles.mainButton}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>Agendar consulta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },

  content: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },

  topBar: {
    alignItems: "flex-end",
    marginBottom: 8,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },

  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 15,
  },

  actionCard: {
    flex: 1,
    minWidth: 110,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 8,
    elevation: 3,
  },

  actionText: {
    fontWeight: "bold",
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  appointmentDate: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
  },

  doctorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  doctorIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#E8F2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  doctorInfo: {
    flex: 1,
  },

  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },

  statusPill: {
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  statusText: {
    color: "#15803D",
    fontSize: 12,
    fontWeight: "bold",
  },

  historyList: {
    gap: 12,
  },

  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  dateBadge: {
    width: 52,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },

  dateText: {
    color: "#B45309",
    fontWeight: "bold",
    fontSize: 12,
  },

  historyInfo: {
    flex: 1,
  },

  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },

  mainButton: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
