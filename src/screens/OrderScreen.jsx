import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import OptionCard from '../components/OptionCard';
import { extras, sizes } from '../data/menu';
import formatCurrency from '../utils/formatCurrency';
import theme from '../styles/theme';

export default function OrderScreen({ navigation, route }) {
  const reorder = route.params?.reorder;

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [observation, setObservation] = useState('');

  useEffect(() => {
    if (reorder) {
      setSelectedSize(reorder.size || null);
      setSelectedExtras(reorder.extras || []);
      setCustomerName(reorder.customerName || '');
      setObservation(reorder.observation || '');
    }
  }, [reorder]);

  function handleToggleExtra(extra) {
    const alreadySelected = selectedExtras.some((item) => item.id === extra.id);

    if (alreadySelected) {
      setSelectedExtras(selectedExtras.filter((item) => item.id !== extra.id));
      return;
    }

    setSelectedExtras([...selectedExtras, extra]);
  }

  function handleClearForm() {
    Alert.alert(
      'Limpar seleção',
      'Deseja remover tamanho, adicionais, nome e observação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            setSelectedSize(null);
            setSelectedExtras([]);
            setCustomerName('');
            setObservation('');
          },
        },
      ]
    );
  }

  const total = useMemo(() => {
    const sizePrice = selectedSize ? selectedSize.price : 0;
    const extrasPrice = selectedExtras.reduce((sum, item) => sum + item.price, 0);
    return sizePrice + extrasPrice;
  }, [selectedSize, selectedExtras]);

  function getPreparationTime() {
    let time = 10;

    if (selectedSize?.id === 'medium') {
      time += 2;
    }

    if (selectedSize?.id === 'large') {
      time += 4;
    }

    time += selectedExtras.length;

    return `${time} min`;
  }

  function handleContinue() {
    if (!selectedSize) {
      Alert.alert('Atenção', 'Selecione um tamanho para continuar.');
      return;
    }

    if (!customerName.trim()) {
      Alert.alert('Atenção', 'Informe o nome do cliente.');
      return;
    }

    const order = {
      id: Date.now().toString(),
      code: `#${Date.now().toString().slice(-5)}`,
      customerName: customerName.trim(),
      observation: observation.trim(),
      size: selectedSize,
      extras: selectedExtras,
      total,
      preparationTime: getPreparationTime(),
      createdAt: new Date().toISOString(),
    };

    navigation.navigate('Summary', { order });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topCard}>
        <View>
          <Text style={styles.topTitle}>Monte seu açaí</Text>
          <Text style={styles.topSubtitle}>
            Escolha o tamanho, adicione complementos e veja o total em tempo real.
          </Text>
        </View>

        <TouchableOpacity style={styles.clearButton} onPress={handleClearForm}>
          <Text style={styles.clearButtonText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Tamanho</Text>
      {sizes.map((size) => (
        <OptionCard
          key={size.id}
          title={size.name}
          price={size.price}
          selected={selectedSize?.id === size.id}
          onPress={() => setSelectedSize(size)}
        />
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Adicionais</Text>
        <View style={styles.counterBadge}>
          <Text style={styles.counterBadgeText}>
            {selectedExtras.length} selecionado{selectedExtras.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {extras.map((extra) => (
        <OptionCard
          key={extra.id}
          title={extra.name}
          price={extra.price}
          selected={selectedExtras.some((item) => item.id === extra.id)}
          onPress={() => handleToggleExtra(extra)}
          multiple
        />
      ))}

      <Text style={styles.sectionTitle}>Nome do cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        placeholderTextColor={theme.colors.muted}
        value={customerName}
        onChangeText={setCustomerName}
      />

      <Text style={styles.sectionTitle}>Observação</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ex: pouco leite condensado"
        placeholderTextColor={theme.colors.muted}
        value={observation}
        onChangeText={setObservation}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total do pedido</Text>
          <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tempo estimado</Text>
          <Text style={styles.summaryTime}>{getPreparationTime()}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continuar para resumo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  topCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadow.card,
  },
  topTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 6,
  },
  topSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.muted,
    marginBottom: theme.spacing.md,
  },
  clearButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FCEBEC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.pill,
  },
  clearButtonText: {
    color: theme.colors.danger,
    fontWeight: '700',
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  counterBadge: {
    backgroundColor: theme.colors.secondarySoft,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: theme.radius.pill,
  },
  counterBadgeText: {
    color: theme.colors.secondary,
    fontWeight: '700',
    fontSize: 12,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: theme.colors.text,
    ...theme.shadow.card,
  },
  textArea: {
    minHeight: 100,
  },
  summaryBox: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    color: theme.colors.muted,
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: 25,
    fontWeight: '800',
    color: theme.colors.success,
  },
  summaryTime: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    ...theme.shadow.card,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});