import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import formatCurrency from '../utils/formatCurrency';
import theme from '../styles/theme';

export default function OptionCard({
  title,
  price,
  selected,
  onPress,
  multiple = false,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <Text style={[styles.title, selected && styles.titleSelected]}>
          {title}
        </Text>
        <Text style={[styles.price, selected && styles.priceSelected]}>
          {formatCurrency(price)}
        </Text>
      </View>

      <View style={[styles.badge, selected && styles.badgeSelected]}>
        <Text style={[styles.badgeText, selected && styles.badgeTextSelected]}>
          {multiple
            ? selected
              ? 'Adicionado'
              : 'Adicionar'
            : selected
            ? 'Selecionado'
            : 'Selecionar'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadow.card,
  },
  cardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  titleSelected: {
    color: theme.colors.primary,
  },
  price: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  priceSelected: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#F0EDF4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.pill,
  },
  badgeSelected: {
    backgroundColor: theme.colors.primary,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  badgeTextSelected: {
    color: theme.colors.white,
  },
});