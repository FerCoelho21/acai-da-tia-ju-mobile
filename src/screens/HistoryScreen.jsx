import React, { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formatCurrency from '../utils/formatCurrency';
import theme from '../styles/theme';

const STORAGE_KEY = '@acai_da_tia_ju_orders';

export default function HistoryScreen({ navigation }) {
  const [orders, setOrders] = useState([]);

  async function loadOrders() {
    try {
      const storedOrders = await AsyncStorage.getItem(STORAGE_KEY);
      const parsedOrders = storedOrders ? JSON.parse(storedOrders) : [];
      setOrders(parsedOrders);
    } catch (error) {
      setOrders([]);
    }
  }

  async function handleClearHistory() {
    Alert.alert(
      'Limpar histórico',
      'Tem certeza que deseja apagar todos os pedidos salvos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
              setOrders([]);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar o histórico.');
            }
          },
        },
      ]
    );
  }

  function handleRepeatOrder(order) {
    navigation.navigate('Order', { reorder: order });
  }

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString('pt-BR');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextBox}>
          <Text style={styles.title}>Seus pedidos</Text>
          <Text style={styles.subtitle}>
            Histórico salvo localmente no dispositivo
          </Text>
        </View>

        {orders.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Nenhum pedido encontrado</Text>
          <Text style={styles.emptyText}>
            Finalize um pedido para que ele apareça aqui.
          </Text>
        </View>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.codeBadge}>
                <Text style={styles.codeBadgeText}>{order.code || '#Pedido'}</Text>
              </View>

              <Text style={styles.total}>{formatCurrency(order.total)}</Text>
            </View>

            <Text style={styles.customerName}>{order.customerName}</Text>

            <Text style={styles.info}>Tamanho: {order.size.name}</Text>

            <Text style={styles.info}>
              Adicionais:{' '}
              {order.extras.length > 0
                ? order.extras.map((item) => item.name).join(', ')
                : 'Nenhum'}
            </Text>

            <Text style={styles.info}>
              Observação: {order.observation ? order.observation : 'Sem observações'}
            </Text>

            <Text style={styles.info}>
              Tempo estimado: {order.preparationTime || '10 min'}
            </Text>

            <Text style={styles.date}>{formatDate(order.createdAt)}</Text>

            <TouchableOpacity
              style={styles.repeatButton}
              onPress={() => handleRepeatOrder(order)}
            >
              <Text style={styles.repeatButtonText}>Refazer pedido</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  headerTextBox: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: theme.colors.muted,
    lineHeight: 20,
  },
  clearButton: {
    backgroundColor: '#FCEBEC',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
  },
  clearButtonText: {
    color: theme.colors.danger,
    fontWeight: '700',
    fontSize: 13,
  },
  emptyBox: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadow.card,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.muted,
    textAlign: 'center',
    lineHeight: 21,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadow.card,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  codeBadge: {
    backgroundColor: theme.colors.primarySoft,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: theme.radius.pill,
  },
  codeBadgeText: {
    color: theme.colors.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 8,
  },
  total: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.success,
  },
  info: {
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: 6,
    lineHeight: 21,
  },
  date: {
    marginTop: 8,
    fontSize: 13,
    color: theme.colors.muted,
  },
  repeatButton: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingVertical: 13,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  repeatButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});