import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import { useTheme, useStyles } from '../../theme';
import { addDays, prettyDate } from '../../utils/format';

// Simple date stepper (‹ date ›) so we need no extra native date-picker package yet.
// value is an ISO string: YYYY-MM-DD
export default function DateField({ label, value, onChange, style }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  return (
    <View style={style}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <View style={s.box}>
        <Pressable onPress={() => onChange(addDays(value, -1))} hitSlop={8} style={s.arrow} accessibilityLabel="Previous day">
          <Icon name="chevron-back" size={20} color={t.colors.primary} />
        </Pressable>
        <View style={s.mid}>
          <Icon name="calendar-outline" size={17} color={t.colors.textMuted} />
          <Text style={s.value}>{prettyDate(value)}</Text>
        </View>
        <Pressable onPress={() => onChange(addDays(value, 1))} hitSlop={8} style={s.arrow} accessibilityLabel="Next day">
          <Icon name="chevron-forward" size={20} color={t.colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    label: { fontSize: t.fontSize.sm, fontWeight: '600', color: t.colors.text, marginBottom: 6 },
    box: { flexDirection: 'row', alignItems: 'center', minHeight: 50, borderWidth: 1.5, borderColor: t.colors.border, borderRadius: t.radius.md, backgroundColor: t.colors.surface },
    arrow: { width: 44, height: 48, alignItems: 'center', justifyContent: 'center' },
    mid: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    value: { fontSize: t.fontSize.md, color: t.colors.text, fontWeight: '600' },
  });
