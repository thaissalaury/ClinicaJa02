import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import { FormDropdown } from '@/components/form/FormDropdown';
import { FormInput } from '@/components/form/FormInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { medicosService } from '@/services/medicosService';
import { maskPhone } from '@/utils/masks';
import { validateEmail, validatePhone } from '@/utils/validators';

export default function CadastroMedico() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  // Estados dos campos do formulário
  const [nome, setNome] = useState('');
  const [crm, setCrm] = useState('');
  const [ufCrm, setUfCrm] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [clinica, setClinica] = useState('');
  const [senha, setSenha] = useState('');

  // Estados de erros individuais
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);

  // Lista de UFs do Brasil
  const opcoesUF = [
    { label: 'AC', value: 'AC' }, { label: 'AL', value: 'AL' }, { label: 'AP', value: 'AP' },
    { label: 'AM', value: 'AM' }, { label: 'BA', value: 'BA' }, { label: 'CE', value: 'CE' },
    { label: 'DF', value: 'DF' }, { label: 'ES', value: 'ES' }, { label: 'GO', value: 'GO' },
    { label: 'MA', value: 'MA' }, { label: 'MT', value: 'MT' }, { label: 'MS', value: 'MS' },
    { label: 'MG', value: 'MG' }, { label: 'PA', value: 'PA' }, { label: 'PB', value: 'PB' },
    { label: 'PR', value: 'PR' }, { label: 'PE', value: 'PE' }, { label: 'PI', value: 'PI' },
    { label: 'RJ', value: 'RJ' }, { label: 'RN', value: 'RN' }, { label: 'RS', value: 'RS' },
    { label: 'RO', value: 'RO' }, { label: 'RR', value: 'RR' }, { label: 'SC', value: 'SC' },
    { label: 'SP', value: 'SP' }, { label: 'SE', value: 'SE' }, { label: 'TO', value: 'TO' }
  ];

  // Lista de especialidades comuns para exemplo
  const opcoesEspecialidades = [
    { label: 'Cardiologia', value: 'Cardiologia' },
    { label: 'Clínica Médica', value: 'Clínica Médica' },
    { label: 'Dermatologia', value: 'Dermatologia' },
    { label: 'Ginecologia e Obstetrícia', value: 'Ginecologia e Obstetrícia' },
    { label: 'Neurologia', value: 'Neurologia' },
    { label: 'Oftalmologia', value: 'Oftalmologia' },
    { label: 'Ortopedia', value: 'Ortopedia' },
    { label: 'Pediatria', value: 'Pediatria' },
    { label: 'Psiquiatria', value: 'Psiquiatria' },
    { label: 'Outra', value: 'Outra' }
  ];

  // Validações em tempo real
  const validarCampos = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!nome.trim()) novosErros.nome = 'Nome completo é obrigatório.';
    
    if (!crm.trim()) {
      novosErros.crm = 'CRM é obrigatório.';
    } else if (crm.trim().length < 4) {
      novosErros.crm = 'CRM inválido (mínimo 4 caracteres).';
    }

    if (!ufCrm) novosErros.ufCrm = 'UF obrigatória.';
    if (!especialidade) novosErros.especialidade = 'Selecione a especialidade.';

    if (!telefone) {
      novosErros.telefone = 'Telefone é obrigatório.';
    } else if (!validatePhone(telefone)) {
      novosErros.telefone = 'Telefone inválido.';
    }

    if (!email) {
      novosErros.email = 'E-mail é obrigatório.';
    } else if (!validateEmail(email)) {
      novosErros.email = 'E-mail inválido.';
    }

    if (!clinica.trim()) novosErros.clinica = 'Clínica de atendimento é obrigatória.';

    if (!senha) {
      novosErros.senha = 'Senha é obrigatória.';
    } else if (senha.length < 6) {
      novosErros.senha = 'Senha deve ter no mínimo 6 caracteres.';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário antes de salvar.');
      return;
    }

    setSalvando(true);
    try {
      await medicosService.cadastrar({
        nome: nome.trim(),
        crm: crm.trim(),
        ufCrm,
        especialidade,
        telefone,
        email: email.trim(),
        clinica: clinica.trim(),
        senha,
      });

      Alert.alert('Sucesso', 'Médico cadastrado com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Erro ao Salvar', error.message || 'Ocorreu um erro inesperado.');
    } finally {
      setSalvando(false);
    }
  };

  const limparErro = (campo: string) => {
    if (errors[campo]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[campo];
        return copy;
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFF' : '#111'} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          Cadastrar Médico
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* INFORMAÇÕES PESSOAIS */}
        <Text style={[styles.sectionTitle, { color: isDark ? '#60A5FA' : '#007AFF' }]}>
          Dados Profissionais
        </Text>

        <FormInput
          label="Nome Completo *"
          placeholder="Dr. ou Dra. Nome Completo"
          iconName="person-outline"
          value={nome}
          onChangeText={(val) => {
            setNome(val);
            limparErro('nome');
          }}
          error={errors.nome}
          autoCapitalize="words"
        />

        <View style={styles.row}>
          <View style={[styles.col, { flex: 0.6 }]}>
            <FormInput
              label="CRM *"
              placeholder="000000"
              iconName="medical-outline"
              keyboardType="numeric"
              value={crm}
              onChangeText={(val) => {
                setCrm(val);
                limparErro('crm');
              }}
              error={errors.crm}
            />
          </View>
          <View style={[styles.col, { flex: 0.4 }]}>
            <FormDropdown
              label="UF CRM *"
              placeholder="Selecione..."
              options={opcoesUF}
              selectedValue={ufCrm}
              onValueChange={(val) => {
                setUfCrm(val);
                limparErro('ufCrm');
              }}
              iconName="map-outline"
              error={errors.ufCrm}
            />
          </View>
        </View>

        <FormDropdown
          label="Especialidade *"
          placeholder="Selecione a especialidade médica..."
          options={opcoesEspecialidades}
          selectedValue={especialidade}
          onValueChange={(val) => {
            setEspecialidade(val);
            limparErro('especialidade');
          }}
          iconName="ribbon-outline"
          error={errors.especialidade}
        />

        {/* CONTATO E LOCALIZAÇÃO */}
        <Text style={[styles.sectionTitle, { color: isDark ? '#60A5FA' : '#007AFF', marginTop: 12 }]}>
          Contato & Localização
        </Text>

        <FormInput
          label="Telefone *"
          placeholder="(00) 00000-0000"
          iconName="call-outline"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={(val) => {
            setTelefone(val);
            limparErro('telefone');
          }}
          mask={maskPhone}
          error={errors.telefone}
        />

        <FormInput
          label="E-mail *"
          placeholder="medico@clinicaja.com"
          iconName="mail-outline"
          keyboardType="email-address"
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            limparErro('email');
          }}
          error={errors.email}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          label="Clínica / Hospital de Atendimento *"
          placeholder="Ex: Consultório Central, Hospital das Clínicas..."
          iconName="business-outline"
          value={clinica}
          onChangeText={(val) => {
            setClinica(val);
            limparErro('clinica');
          }}
          error={errors.clinica}
          autoCapitalize="words"
        />

        <FormInput
          label="Senha *"
          placeholder="Mínimo 6 caracteres"
          iconName="lock-closed-outline"
          value={senha}
          onChangeText={(val) => {
            setSenha(val);
            limparErro('senha');
          }}
          error={errors.senha}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* BOTÕES */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: isDark ? '#60A5FA' : '#007AFF' }]}
            onPress={handleSalvar}
            disabled={salvando}
            activeOpacity={0.8}
          >
            {salvando ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-sharp" size={20} color="#FFF" />
                <Text style={styles.saveButtonText}>Salvar Cadastro</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 24,
    width: '100%',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
