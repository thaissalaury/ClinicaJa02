import React, { useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { Calendar, LocaleConfig } from 'react-native-calendars';

// Configuração do calendário em Português
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  dayNames: [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
};

LocaleConfig.defaultLocale = 'pt-br';

export default function App() {
  const [especialidade, setEspecialidade] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horaSelecionada, setHoraSelecionada] = useState('');

  const especialidades = [
    'Cardiologia',
    'Pediatria',
    'Dermatologia',
    'Clínico Geral',
  ];

  const horarios = [
    '08:30',
    '09:15',
    '10:00',
    '11:00',
    '14:00',
    '15:30',
    '16:15',
  ];

  // Data mínima (evita problemas de fuso horário)
  const hoje = new Date();
  const dataMinima =
    hoje.getFullYear() +
    '-' +
    String(hoje.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(hoje.getDate()).padStart(2, '0');

  const handleAgendar = () => {
    if (!especialidade || !dataSelecionada || !horaSelecionada) {
      Alert.alert(
        'Erro',
        'Selecione a especialidade, a data e o horário.'
      );
      return;
    }

    const dataFormatada = dataSelecionada
      .split('-')
      .reverse()
      .join('/');

    Alert.alert(
      'Consulta Agendada! 🩺',
      `Especialidade: ${especialidade}

Data: ${dataFormatada}

Horário: ${horaSelecionada}

Chegue com 15 minutos de antecedência.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setEspecialidade('');
            setDataSelecionada('');
            setHoraSelecionada('');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo}>Agendamento Médico</Text>

        <Text style={styles.secaoTitulo}>
          1. Escolha a Especialidade
        </Text>

        <View style={styles.gridEspecialidades}>
          {especialidades.map((esp) => (
            <TouchableOpacity
              key={esp}
              style={[
                styles.cardEspecialidade,
                especialidade === esp && styles.cardSelecionado,
              ]}
              onPress={() => {
                setEspecialidade(esp);
                setHoraSelecionada('');
              }}
            >
              <Text
                style={[
                  styles.textoCard,
                  especialidade === esp &&
                    styles.textoSelecionado,
                ]}
              >
                {esp}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.secaoTitulo}>
          2. Selecione a Data
        </Text>

        <Calendar
          style={styles.calendario}
          minDate={dataMinima}
          theme={{
            todayTextColor: '#0284c7',
            selectedDayBackgroundColor: '#0284c7',
            selectedDayTextColor: '#fff',
            arrowColor: '#0284c7',
          }}
    onDayPress={(day) => {
    setDataSelecionada(day.dateString);
    setHoraSelecionada('');
                }}
          markedDates={
            dataSelecionada
              ? {
                  [dataSelecionada]: {
                    selected: true,
                    selectedColor: '#0284c7',
                  },
                }
              :{}
          }
        />

        <Text style={styles.secaoTitulo}>
          3. Horários Disponíveis
        </Text>

        {dataSelecionada ? (
          <View style={styles.gridHorarios}>
            {horarios.map((hora) => (
              <TouchableOpacity
                key={hora}
                style={[
                  styles.botaoHora,
                  horaSelecionada === hora &&
                    styles.botaoHoraSelecionada,
                ]}
                onPress={() => setHoraSelecionada(hora)}
              >
                <Text
                  style={[
                    styles.textoHora,
                    horaSelecionada === hora &&
                      styles.textoHoraSelecionada,
                  ]}
                >
                  {hora}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.textoAviso}>
            Selecione uma data para visualizar os horários.
          </Text>
        )}

        <TouchableOpacity
          style={styles.botaoAgendar}
          onPress={handleAgendar}
        >
          <Text style={styles.textoBotaoAgendar}>
            Confirmar Consulta Médica
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 25,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
    marginTop: 10,
  },
  gridEspecialidades: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardEspecialidade: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 14,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardSelecionado: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  textoCard: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  textoSelecionado: {
    color: '#fff',
    fontWeight: '600',
  },
  calendario: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 15,
  },
  gridHorarios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  botaoHora: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 10,
    width: '22%', // Exibe quase 4 por linha perfeitamente
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  botaoHoraSelecionada: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  textoHora: {
    fontSize: 13,
    color: '#475569',
  },
  textoHoraSelecionada: {
    color: '#fff',
    fontWeight: '600',
  },
  textoAviso: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 15,
    fontStyle: 'italic',
  },
  botaoAgendar: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  textoBotaoAgendar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});