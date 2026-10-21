import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { useTheme, useStyles } from '../../theme';
import { toneColors } from './StatTile';

const ICONS = { primary: 'information-circle-outline', info: 'information-circle-outline', success: 'checkmark-circle-outline', danger: 'alert-circle-outline', warning: 'alert-circle-outline' };

export default function Banner({ text, tone = 'primary', style }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  const { fg, bg } = toneColors(t, tone);
  return (
    <View style={[s.box, { backgroundColor: bg }, style]}>
      <Icon name={ICONS[tone] || ICONS.primary} size={20} color={fg} />
      <Text style={[s.text, { color: t.colors.text }]}>{text}</Text>
    </View>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    box: { flexDirection: 'row', gap: 10, padding: t.spacing.md, borderRadius: t.radius.md, alignItems: 'flex-start' },
    text: { flex: 1, fontSize: t.fontSize.sm, lineHeight: 19 },
  });
