import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useStyles } from '../../theme';

// tone: primary | success | danger | warning | info | purple | neutral
export function toneColors(t, tone = 'primary') {
  const c = t.colors;
  const map = {
    primary: [c.primary, c.primaryTint],
    success: [c.success, c.successTint],
    danger: [c.danger, c.dangerTint],
    warning: [c.warning, c.warningTint],
    info: [c.info, c.infoTint],
    purple: [c.purple, c.purpleTint],
    neutral: [c.textMuted, c.background],
  };
  const [fg, bg] = map[tone] || map.primary;
  return { fg, bg };
}

export default function StatTile({ label, value, tone = 'primary', icon, style }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  const { fg, bg } = toneColors(t, tone);
  return (
    <View style={[s.tile, { backgroundColor: bg }, style]}>
      {icon ? <Ionicons name={icon} size={20} color={fg} /> : null}
      <Text style={[s.value, { color: fg }]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={s.label}>{label}</Text>
    </View>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    tile: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 6, borderRadius: t.radius.md, gap: 2 },
    value: { fontSize: t.fontSize.xl - 2, fontWeight: '800' },
    label: { fontSize: t.fontSize.xs + 1, color: t.colors.textMuted, fontWeight: '600', textAlign: 'center' },
  });
