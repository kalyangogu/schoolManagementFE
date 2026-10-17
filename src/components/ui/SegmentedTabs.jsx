import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useStyles } from '../../theme';

// tabs: [{ key, label, icon? }]
export default function SegmentedTabs({ tabs, value, onChange }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
      {tabs.map((tab) => {
        const on = tab.key === value;
        return (
          <Pressable key={tab.key} onPress={() => onChange(tab.key)} style={[s.tab, on && s.tabOn]}>
            {on ? <Ionicons name="checkmark" size={15} color={t.colors.primary} /> : tab.icon ? <Ionicons name={tab.icon} size={15} color={t.colors.textMuted} /> : null}
            <Text style={[s.text, on && { color: t.colors.primary }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    row: { gap: 8, paddingVertical: 2 },
    tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, height: 40, borderRadius: t.radius.pill, borderWidth: 1.5, borderColor: t.colors.border, backgroundColor: t.colors.surface },
    tabOn: { backgroundColor: t.colors.primaryTint, borderColor: t.colors.primary },
    text: { fontSize: t.fontSize.sm + 1, fontWeight: '700', color: t.colors.textMuted },
  });
