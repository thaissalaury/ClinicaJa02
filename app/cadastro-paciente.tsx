import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { FormInput } from '@/components/form/FormInput';
import { FormDropdown } from '@/components/form/FormDropdown';

import { maskCPF, maskPhone, maskCEP, maskDate } from '@/utils/masks';
import {
  validateCPF,
  validateEmail,
  validateDate,
  validatePhone,
  validateCEP,
} from '@/utils/validators';
import { pacientesService } from '@/services/pacientesService';

export default function CadastroPaciente() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  // Estados dos campos do formulário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sexo, setSexo] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [senha, setSenha] = useState('');

  // Estados de erros individuais
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);

  // Lista de sexos para o dropdown
  const opcoesSexo = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Feminino', value: 'Feminino' },
    { label: 'Outro', value: 'Outro' },
  ];

  // Validações em tempo real
  const validarCampos = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!nome.trim()) novosErros.nome = 'Nome completo é obrigatório.';
    
    if (!cpf) {
      novosErros.cpf = 'CPF é obrigatório.';
    } else if (!validateCPF(cpf)) {
      novosErros.cpf = 'CPF inválido.';
    }

    if (!dataNascimento) {
      novosErros.dataNascimento = 'Data de nascimento é obrigatória.';
    } else if (!validateDate(dataNascimento)) {
      novosErros.dataNascimento = 'Data inválida ou no futuro (DD/MM/AAAA).';
    }

    if (!email) {
      novosErros.email = 'E-mail é obrigatório.';
    } else if (!validateEmail(email)) {
      novosErros.email = 'Formato de e-mail inválido.';
    }

    if (!telefone) {
      novosErros.telefone = 'Telefone é obrigatório.';
    } else if (!validatePhone(telefone)) {
      novosErros.telefone = 'Telefone inválido (mínimo 10 dígitos).';
    }

    if (!sexo) novosErros.sexo = 'Selecione o sexo do paciente.';

    if (!cep) {
      novosErros.cep = 'CEP é obrigatório.';
    } else if (!validateCEP(cep)) {
      novosErros.cep = 'CEP inválido.';
    }

    if (!endereco.trim()) novosErros.endereco = 'Endereço é obrigatório.';
    if (!numero.trim()) novosErros.numero = 'Número é obrigatório.';
    if (!bairro.trim()) novosErros.bairro = 'Bairro é obrigatório.';
    if (!cidade.trim()) novosErros.cidade = 'Cidade é obrigatória.';
    if (!estado.trim()) novosErros.estado = 'Estado (UF) é obrigatório.';

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
      await pacientesService.cadastrar({
        nome: nome.trim(),
        cpf,
        dataNascimento,
        email: email.trim(),
        telefone,
        sexo: sexo as 'Masculino' | 'Feminino' | 'Outro',
        cep,
        endereco: endereco.trim(),
        numero: numero.trim(),
        complemento: complemento.trim() || undefined,
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        estado: estado.trim().toUpperCase(),
        senha,
      });

      Alert.alert('Sucesso', 'Paciente cadastrado com sucesso!', [
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
          Cadastrar Paciente
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* INFORMAÇÕES PESSOAIS */}
        <Text style={[styles.sectionTitle, { color: isDark ? '#60A5FA' : '#007AFF' }]}>
          Dados Pessoais
        </Text>

        <FormInput
          label="Nome Completo *"
          placeholder="Digite o nome completo"
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
          <View style={styles.col}>
            <FormInput
              label="CPF *"
              placeholder="000.000.000-00"
              iconName="card-outline"
              keyboardType="numeric"
              value={cpf}
              onChangeText={(val) => {
                setCpf(val);
                limparErro('cpf');
              }}
              mask={maskCPF}
              error={errors.cpf}
            />
          </View>
          <View style={styles.col}>
            <FormInput
              label="Nascimento *"
              placeholder="DD/MM/AAAA"
              iconName="calendar-outline"
              keyboardType="numeric"
              value={dataNascimento}
              onChangeText={(val) => {
                setDataNascimento(val);
                limparErro('dataNascimento');
              }}
              mask={maskDate}
              error={errors.dataNascimento}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
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
          </View>
          <View style={styles.col}>
            <FormDropdown
              label="Sexo *"
              placeholder="Selecione..."
              options={opcoesSexo}
              selectedValue={sexo}
              onValueChange={(val) => {
                setSexo(val);
                limparErro('sexo');
              }}
              iconName="transgender-outline"
              error={errors.sexo}
            />
          </View>
        </View>

        <FormInput
          label="E-mail *"
          placeholder="exemplo@email.com"
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

        {/* ENDEREÇO */}
        <Text style={[styles.sectionTitle, { color: isDark ? '#60A5FA' : '#007AFF', marginTop: 12 }]}>
          Endereço Residencial
        </Text>

        <View style={styles.row}>
          <View style={[styles.col, { flex: 0.4 }]}>
            <FormInput
              label="CEP *"
              placeholder="00000-000"
              iconName="location-outline"
              keyboardType="numeric"
              value={cep}
              onChangeText={(val) => {
                setCep(val);
                limparErro('cep');
              }}
              mask={maskCEP}
              error={errors.cep}
            />
          </View>
          <View style={[styles.col, { flex: 0.6 }]}>
            <FormInput
              label="Rua / Logradouro *"
              placeholder="Nome da rua"
              value={endereco}
              onChangeText={(val) => {
                setEndereco(val);
                limparErro('endereco');
              }}
              error={errors.endereco}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.col, { flex: 0.3 }]}>
            <FormInput
              label="Número *"
              placeholder="123"
              keyboardType="numeric"
              value={numero}
              onChangeText={(val) => {
                setNumero(val);
                limparErro('numero');
              }}
              error={errors.numero}
            />
          </View>
          <View style={[styles.col, { flex: 0.7 }]}>
            <FormInput
              label="Complemento"
              placeholder="Sala, bloco, apto..."
              value={complemento}
              onChangeText={setComplemento}
            />
          </View>
        </View>

        <FormInput
          label="Bairro *"
          placeholder="Nome do bairro"
          value={bairro}
          onChangeText={(val) => {
            setBairro(val);
            limparErro('bairro');
          }}
          error={errors.bairro}
          autoCapitalize="words"
        />

        <View style={styles.row}>
          <View style={[styles.col, { flex: 0.7 }]}>
            <FormInput
              label="Cidade *"
              placeholder="Nome da cidade"
              value={cidade}
              onChangeText={(val) => {
                setCidade(val);
                limparErro('cidade');
              }}
              error={errors.cidade}
              autoCapitalize="words"
            />
          </View>
          <View style={[styles.col, { flex: 0.3 }]}>
            <FormInput
              label="Estado *"
              placeholder="SP"
              value={estado}
              onChangeText={(val) => {
                setEstado(val);
                limparErro('estado');
              }}
              error={errors.estado}
              autoCapitalize="characters"
              maxLength={2}
            />
          </View>
        </View>

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
