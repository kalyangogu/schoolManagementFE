import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { useTheme, useStyles } from '../../theme';

export default function Chip({ label, selected, onPress }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  return (
    <Pressable onPress={onPress} style={[s.chip, selected && s.on]}>
      {selected ? <Icon name="checkmark" size={14} color={t.colors.primary} /> : null}
      <Text style={[s.text, selected && { color: t.colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, height: 36, borderRadius: t.radius.pill, backgroundColor: t.colors.surface, borderWidth: 1.5, borderColor: t.colors.border },
    on: { backgroundColor: t.colors.primaryTint, borderColor: t.colors.primaryTint },
    text: { fontSize: t.fontSize.sm, fontWeight: '600', color: t.colors.text },
  });
