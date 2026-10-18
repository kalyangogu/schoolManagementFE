import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, useStyles } from '../../theme';
import { toneColors } from './StatTile';

export default function Badge({ label, tone = 'primary' }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  const { fg, bg } = toneColors(t, tone);
  return (
    <View style={[s.badge, { backgroundColor: bg }]}>
      <Text style={[s.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: t.radius.pill },
    text: { fontSize: t.fontSize.xs, fontWeight: '700' },
  });
