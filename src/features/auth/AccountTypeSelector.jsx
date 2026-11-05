import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Icon } from '../../components/ui';
import { useTheme, useStyles } from '../../theme';
import { ACCOUNT_TYPES } from './accountTypes';

// "I am a: Student | Staff | Parent"
export default function AccountTypeSelector({ value, onChange }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  return (
    <View style={s.row}>
      {ACCOUNT_TYPES.map((a) => {
        const on = a.key === value;
        return (
          <Pressable key={a.key} onPress={() => onChange(a.key)} style={[s.tile, on && s.tileOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
            <Icon name={a.icon} size={26} color={on ? t.colors.primary : t.colors.textMuted} />
            <Text style={[s.text, on && { color: t.colors.primary }]}>{a.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: t.spacing.sm },
    tile: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 12, borderRadius: t.radius.md, borderWidth: 1.5, borderColor: t.colors.border, backgroundColor: t.colors.surface },
    tileOn: { borderColor: t.colors.primary, backgroundColor: t.colors.primaryTint },
    text: { fontSize: t.fontSize.sm, fontWeight: '700', color: t.colors.textMuted },
  });
