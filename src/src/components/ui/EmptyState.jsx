import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from './Icon';
import { useTheme, useStyles } from '../../theme';

export default function EmptyState({ icon = 'file-tray-outline', text, loading }) {
  const t = useTheme();
  const s = useStyles(makeStyles);
  return (
    <View style={s.box}>
      {loading ? <ActivityIndicator color={t.colors.primary} /> : <Icon name={icon} size={30} color={t.colors.textMuted + '99'} />}
      {!loading && text ? <Text style={s.text}>{text}</Text> : null}
    </View>
  );
}

const makeStyles = (t) =>
  StyleSheet.create({
    box: { alignItems: 'center', justifyContent: 'center', paddingVertical: 28, gap: 8 },
    text: { color: t.colors.textMuted, fontSize: t.fontSize.sm, textAlign: 'center' },
  });
