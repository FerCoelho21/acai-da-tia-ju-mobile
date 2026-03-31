import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formatCurrency from '../utils/formatCurrency';
import theme from '../styles/theme';

const STORAGE_KEY = '@acai_da_tia_ju_orders';

export default function SummaryScreen({ route, navigation }) {
  const { order } = route.params;

  async function handleFinishOrder() {
    try {
      const storedOrders = await AsyncStorage.getItem(STORAGE_KEY);
      const parsedOrders = storedOrders ? JSON.parse(storedOrders) : [];
      const updatedOrders = [order, ...parsedOrders];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));

      Alert.alert('Pedido finalizado', 'Seu pedido foi salvo com sucesso.', [
        {
          text: 'OK',
          onPress: () => navigation.popToTop(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o pedido.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{order.code}</Text>
        </View>

        <Text style={styles.title}>Confira seu pedido</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Cliente</Text>
          <Text style={styles.value}>{order.customerName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tamanho</Text>
          <Text style={styles.value}>
            {order.size.name} - {formatCurrency(order.size.price)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Adicionais</Text>
          {order.extras.length > 0 ? (
            order.extras.map((item) => (
              <Text key={item.id} style={styles.listItem}>
                • {item.name} - {formatCurrency(item.price)}
              </Text>
            ))
          ) : (
            <Text style={styles.value}>Nenhum adicional selecionado</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Observação</Text>
          <Text style={styles.value}>
            {order.observation ? order.observation : 'Sem observações'}
          </Text>
        </View>

        <View style={styles.footerBox}>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Tempo estimado</Text>
            <Text style={styles.footerTime}>{order.preparationTime}</Text>
          </View>

          <View style={styles.footerDivider} />

          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleFinishOrder}>
        <Text style={styles.buttonText}>Finalizar pedido</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...theme.shadow.card,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primarySoft,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.pill,
    marginBottom: theme.spacing.md,
  },
  badgeText: {
    color: theme.colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 13,
    color: theme.colors.muted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
  listItem: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  footerBox: {
    marginTop: theme.spacing.md,
    backgroundColor: '#F8F5FB',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 15,
    color: theme.colors.muted,
    fontWeight: '700',
  },
  footerTime: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.secondary,
  },
  footerDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  totalValue: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.success,
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