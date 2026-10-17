import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useStyles } from '../../theme';
import BottomSheet from './BottomSheet';

// options: [{ label, value }]. No native picker dependency, looks the same on iOS and Android.
export default function Select({ label, value, options = [], onChange, placeholder = 'Choose…', disabled, required, error, style }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  return (
    <View style={style}>
      {label ? (
        <Text style={s.label}>
          {label}
          {required ? <Text style={{ color: t.colors.danger }}> *</Text> : null}
        </Text>
      ) : null}
      <Pressable onPress={() => !disabled && setOpen(true)} style={[s.box, disabled && { opacity: 0.55 }, !!error && { borderColor: t.colors.danger }]}>
        <Text style={[s.value, !selected && { color: t.colors.textMuted + 'AA' }]} numberOfLines={1}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={t.colors.textMuted} />
      </Pressable>
      {error ? <Text style={s.error}>{error}</Text> : null}
      <BottomSheet visible={open} onClose={() => setOpen(false)} title={label || 'Choose'}>
        {options.length === 0 ? <Text style={s.empty}>Nothing to choose from yet.</Text> : null}
        {options.map((o) => {
          const on = o.value === value;
          return (
            <Pressable key={String(o.value)} onPress={() => { onChange && onChange(o.value); setOpen(false); }} style={[s.option, on && s.optionOn]}>
              <Text style={[s.optionText, on && { color: t.colors.primary, fontWeight: '700' }]}>{o.label}</Text>
              {on ? <Ionicons name="checkmark-circle" size={20} color={t.colors.primary} /> : null}
            </Pressable>
          );
        })}
      </BottomSheet>
    </View>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    label: { fontSize: t.fontSize.sm, fontWeight: '600', color: t.colors.text, marginBottom: 6 },
    box: { flexDirection: 'row', alignItems: 'center', minHeight: 50, borderWidth: 1.5, borderColor: t.colors.border, borderRadius: t.radius.md, paddingHorizontal: t.spacing.md, backgroundColor: t.colors.surface },
    value: { flex: 1, fontSize: t.fontSize.md, color: t.colors.text },
    error: { color: t.colors.danger, fontSize: t.fontSize.xs + 1, marginTop: 4 },
    empty: { color: t.colors.textMuted, paddingVertical: 16, textAlign: 'center' },
    option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12, borderRadius: t.radius.md },
    optionOn: { backgroundColor: t.colors.primaryTint },
    optionText: { fontSize: t.fontSize.md, color: t.colors.text },
  });
