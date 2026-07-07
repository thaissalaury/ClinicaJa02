import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const resumo = [
  {
    titulo: "Consultas hoje",
    valor: "8",
    icon: "calendar-outline",
    cor: "#007AFF",
  },
  {
    titulo: "Pacientes ativos",
    valor: "124",
    icon: "people-outline",
    cor: "#10B981",
  },
  {
    titulo: "Pendências",
    valor: "3",
    icon: "alert-circle-outline",
    cor: "#F59E0B",
  },
] as const;

const consultas = [
  {
    horario: "08:30",
    paciente: "Marina Lopes",
    detalhe: "Retorno cardiologia",
    status: "Confirmada",
  },
  {
    horario: "10:00",
    paciente: "Carlos Henrique",
    detalhe: "Avaliação inicial",
    status: "Aguardando",
  },
  {
    horario: "14:20",
    paciente: "Bianca Lima",
    detalhe: "Exames e conduta",
    status: "Confirmada",
  },
] as const;

const pacientes = [
  {
    nome: "Marina Lopes",
    detalhe: "Última consulta há 14 dias",
    icon: "heart-outline",
  },
  {
    nome: "Rafael Souza",
    detalhe: "Retorno solicitado",
    icon: "document-text-outline",
  },
  {
    nome: "Bianca Lima",
    detalhe: "Exames recebidos",
    icon: "folder-open-outline",
  },
] as const;

export default function Medico() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const background = isDark ? "#0F172A" : "#F4F8FB";
  const surface = isDark ? "#1E293B" : "#fff";
  const border = isDark ? "#334155" : "#E5EAF0";
  const text = isDark ? "#fff" : "#111";
  const muted = isDark ? "#CBD5E1" : "#666";

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: background }]}>
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
          <Ionicons name="medical-outline" size={70} color={isDark ? "#60A5FA" : "#007AFF"} />

          <Text style={[styles.title, { color: text }]}>Área do Médico</Text>

          <Text style={{ color: muted }}>Bem-vindo ao ClínicaJá, Dra. Ana</Text>
        </View>

        <View style={styles.statsGrid}>
          {resumo.map((item) => (
            <View
              key={item.titulo}
              style={[styles.statCard, { backgroundColor: surface, borderColor: border }]}
            >
              <Ionicons name={item.icon} size={24} color={item.cor} />
              <Text style={[styles.statValue, { color: text }]}>{item.valor}</Text>
              <Text style={[styles.statLabel, { color: muted }]}>{item.titulo}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: text }]}>Agenda de hoje</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Ver todas as consultas"
          >
            <Text style={[styles.sectionAction, { color: isDark ? "#60A5FA" : "#007AFF" }]}>
              Ver todas
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {consultas.map((consulta) => (
            <View
              key={`${consulta.horario}-${consulta.paciente}`}
              style={[styles.appointmentCard, { backgroundColor: surface, borderColor: border }]}
            >
              <View style={styles.timeBlock}>
                <Text style={styles.timeText}>{consulta.horario}</Text>
              </View>

              <View style={styles.appointmentInfo}>
                <Text style={[styles.cardTitle, { color: text }]}>{consulta.paciente}</Text>
                <Text style={{ color: muted }}>{consulta.detalhe}</Text>
              </View>

              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor:
                      consulta.status === "Confirmada" ? "#DCFCE7" : "#FEF3C7",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: consulta.status === "Confirmada" ? "#15803D" : "#B45309",
                    },
                  ]}
                >
                  {consulta.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.86}
          accessibilityRole="button"
          accessibilityLabel="Nova consulta"
          style={styles.mainButton}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>Nova consulta</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, styles.patientTitle, { color: text }]}>
          Pacientes recentes
        </Text>

        <View style={styles.list}>
          {pacientes.map((paciente) => (
            <View
              key={paciente.nome}
              style={[styles.patientRow, { backgroundColor: surface, borderColor: border }]}
            >
              <View style={styles.patientIcon}>
                <Ionicons name={paciente.icon} size={22} color="#007AFF" />
              </View>

              <View style={styles.patientInfo}>
                <Text style={[styles.cardTitle, { color: text }]}>{paciente.nome}</Text>
                <Text style={{ color: muted }}>{paciente.detalhe}</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={isDark ? "#CBD5E1" : "#999"} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
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

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    minWidth: 145,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    elevation: 3,
  },

  statValue: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 10,
  },

  statLabel: {
    fontSize: 14,
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  sectionAction: {
    fontSize: 14,
    fontWeight: "700",
  },

  list: {
    gap: 12,
  },

  appointmentCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 3,
  },

  timeBlock: {
    width: 58,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#E8F2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  timeText: {
    color: "#007AFF",
    fontWeight: "bold",
  },

  appointmentInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },

  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },

  mainButton: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  patientTitle: {
    marginTop: 26,
    marginBottom: 12,
  },

  patientRow: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 3,
  },

  patientIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#E8F2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  patientInfo: {
    flex: 1,
  },
});
